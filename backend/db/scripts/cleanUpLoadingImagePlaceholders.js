import '../../../env.js';
import crypto from 'crypto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

import knex from '#~/db/knex.js';

const ifApply = process.argv.includes('--apply');

const s3 = new S3Client({
  region: process.env['AWS_REGION'],
  credentials: {
    accessKeyId:     process.env['AWS_ACCESS_KEY_ID'],
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY']
  }
});

const placeholderRegex = /<(section|span) class="placeholder-for-loading-image[^"]*"[^>]*>([^<]*)<img src="data:([^;"]*);base64,([^"]*)"([^>]*)>([^<]*)<\/\1>/g;

const stats = { uploadedImages: 0, uploadedOtherFiles: 0, removedDuplicates: 0, placeholdersLeft: 0 };

const sha1 = (buffer) => crypto.createHash('sha1').update(buffer).digest('hex');

const s3ImageHashes = {};
const getS3ImageHash = async (url) => {
  if (!(url in s3ImageHashes)) {
    const response = await fetch(url);
    s3ImageHashes[url] = response.ok ? sha1(Buffer.from(await response.arrayBuffer())) : null;
  }
  return s3ImageHashes[url];
};

const uploadToS3 = async (bytes, mimeType) => {
  const key = `placeholder-${sha1(bytes)}`;
  if (ifApply) {
    await s3.send(new PutObjectCommand({
      Bucket:      process.env['AWS_BUCKET_NAME'],
      Key:         key,
      Body:        bytes,
      ContentType: mimeType,
      ACL:         'public-read'
    }));
  }
  return `https://${process.env['AWS_BUCKET_NAME']}.s3.${process.env['AWS_REGION']}.amazonaws.com/${key}`;
};

const replacePlaceholder = async ([, tagName, textBefore, mimeType, base64, imgAttributes, textAfter], s3ImageHashesInHtml) => {
  const bytes = Buffer.from(base64, 'base64');

  if (s3ImageHashesInHtml.includes(sha1(bytes))) {
    stats.removedDuplicates++;
    const text = textBefore + textAfter;
    return tagName === 'section' && text ? `<p>${text}</p>` : text;
  } else {
    const url = await uploadToS3(bytes, mimeType);
    const width = imgAttributes.match(/ width="\d+"/);
    const ifImage = mimeType.startsWith('image/');
    if (ifImage) { stats.uploadedImages++; } else { stats.uploadedOtherFiles++; }

    const element = ifImage ?
      `<img src="${url}"${width ? width[0] : ''}>` :
      `<a href="${url}">${url}</a>`;
    const elementWithText = textBefore + element + textAfter;
    return tagName === 'section' ? `<p>${elementWithText}</p>` : elementWithText;
  }
};

const cleanUpHtml = async (html) => {
  const placeholders = [...html.matchAll(placeholderRegex)];
  const s3ImageUrls = placeholders.length > 0 ?
    [...html.matchAll(/<img src="(https:\/\/[^"]*\.amazonaws\.com\/[^"]*)"/g)].map((match) => match[1]) :
    [];
  const s3ImageHashesInHtml = await Promise.all(s3ImageUrls.map(getS3ImageHash));

  let newHtml = html;
  for (const placeholder of placeholders) {
    const replacement = await replacePlaceholder(placeholder, s3ImageHashesInHtml);
    newHtml = newHtml.replace(placeholder[0], () => replacement);
  }

  if (newHtml.includes('placeholder-for-loading-image')) stats.placeholdersLeft++;
  return newHtml;
};

const cleanUpProblems = async () => {
  const problems = await knex('problem').select('id').whereRaw(`content::text like '%placeholder-for-loading-image%'`).orderBy('id');

  for (const [index, { id }] of problems.entries()) {
    const problem = await knex('problem').where({ id }).first();
    const content = {};
    for (const [key, value] of Object.entries(problem.content)) {
      content[key] = typeof value === 'string' ? await cleanUpHtml(value) : value;
    }
    if (ifApply) await knex('problem').where({ id }).update({ content });
    console.log(`problem ${id} (${index + 1}/${problems.length})`);
  }
};

const cleanUpCourses = async () => {
  const courses = await knex('course').select('id').where('description', 'like', '%placeholder-for-loading-image%').orderBy('id');

  for (const { id } of courses) {
    const course = await knex('course').where({ id }).first();
    const description = await cleanUpHtml(course.description);
    if (ifApply) await knex('course').where({ id }).update({ description });
    console.log(`course ${id}`);
  }
};

await cleanUpProblems();
await cleanUpCourses();
console.log(stats);
console.log(ifApply ? 'Done.' : 'Dry run - nothing was uploaded or saved. Run with --apply to upload the images to S3 and save the flashcards.');
await knex.destroy();
