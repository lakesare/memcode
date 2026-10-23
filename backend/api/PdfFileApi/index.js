import express from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import { GetObjectCommand, HeadObjectCommand } from '@aws-sdk/client-s3';

import knex from '#~/db/knex.js';
import awsS3 from '#~/services/awsS3.js';
import catchAsync from '#~/services/catchAsync.js';
import authenticate from '#~/middlewares/authenticate.js';
import mustOwnPdf from '#~/api/PdfApi/mustOwnPdf.js';

const router = express.Router();

const CONTENT_TYPES = { pdf: 'application/pdf', epub: 'application/epub+zip' };

const formatOf = (fileName) => (/\.epub$/i.test(fileName) ? 'epub' : 'pdf');

// [claude comment] private, unlike flashcard images - books are only ever served back through GET /api/pdfs/:id/file below
const uploadPdfToAwsS3 = multer({
  limits: { fileSize: 300 * 1024 * 1024 },
  fileFilter: (request, file, cb) => cb(null, ['application/pdf', 'application/epub+zip'].includes(file.mimetype) || /\.(pdf|epub)$/i.test(file.originalname)),
  storage: multerS3({
    s3: awsS3,
    bucket: process.env['AWS_BUCKET_NAME'],
    acl: 'private',
    contentType: (request, file, cb) => cb(null, CONTENT_TYPES[formatOf(file.originalname)]),
    key: (request, file, cb) => cb(null, `pdfs/${request.currentUser.id}/${Date.now()}.${formatOf(file.originalname)}`)
  })
});

router.post('/upload', authenticate, uploadPdfToAwsS3.single('file'), catchAsync(async (request, response) => {
  if (!request.file) {
    response.status(400).json('Please choose a pdf or epub file');
  } else {
    const title = request.body['title'] ? request.body['title'] : Buffer.from(request.file.originalname, 'latin1').toString('utf8').replace(/\.(pdf|epub)$/i, '');
    const head = await awsS3.send(new HeadObjectCommand({ Bucket: process.env['AWS_BUCKET_NAME'], Key: request.file.key }));
    const pdf = (await knex('pdf')
      .insert({ userId: request.currentUser.id, title, s3Key: request.file.key, sizeBytes: head.ContentLength })
      .returning('*')
    )[0];
    response.status(200).json(pdf);
  }
}));

router.get('/:id/file', authenticate, catchAsync(async (request, response) => {
  const pdf = await mustOwnPdf(request.params.id, request.currentUser);
  const object = await awsS3.send(new GetObjectCommand({ Bucket: process.env['AWS_BUCKET_NAME'], Key: pdf.s3Key }));
  response.set({
    'Content-Type': CONTENT_TYPES[formatOf(pdf.s3Key)],
    'Content-Length': object.ContentLength,
    'Cache-Control': 'private, max-age=31536000, immutable'
  });
  object.Body.pipe(response);
}));

export default router;
