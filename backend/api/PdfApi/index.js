import knex from '#~/db/knex.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import awsS3 from '#~/services/awsS3.js';
import { mustBeAuthenticated } from '#~/services/auth.js';
import { mustOwnPdf, mustOwnBookmark } from './mustOwnPdf.js';

const DAY = 24 * 60 * 60 * 1000;

const getMyPdfs = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);

  const pdfs = await knex('pdf')
    .where({ userId: request.currentUser.id })
    .select('pdf.*')
    .select(knex.raw(`(SELECT count(*)::int FROM pdf_bookmark b WHERE b.pdf_id = pdf.id AND b.archived_at IS NULL) AS n_of_bookmarks`))
    .select(knex.raw(`(SELECT count(*)::int FROM pdf_bookmark b WHERE b.pdf_id = pdf.id AND b.archived_at IS NULL AND b.next_due_at <= now()) AS n_of_due_bookmarks`))
    .orderBy('lastOpenedAt', 'desc');

  response.success(pdfs);
};

const getPdf = async (request, response) => {
  const pdf = await mustOwnPdf(request.body['pdfId'], request.currentUser);

  const highlights = await knex('pdfHighlight').where({ pdfId: pdf.id }).orderBy('createdAt');
  const bookmarks = await knex('pdfBookmark').where({ pdfId: pdf.id }).whereNull('archivedAt').orderBy(['page', 'y']);

  response.success({ pdf, highlights, bookmarks });
};

const updatePdf = async (request, response) => {
  const pdf = await mustOwnPdf(request.body['pdfId'], request.currentUser);
  const changes = {};
  ['title', 'currentPage', 'currentY', 'nOfPages'].forEach((key) => {
    if (request.body[key] !== undefined) changes[key] = request.body[key];
  });
  if (request.body['opened']) changes.lastOpenedAt = new Date();

  const updated = (await knex('pdf').where({ id: pdf.id }).update(changes).returning('*'))[0];
  response.success(updated);
};

const deletePdf = async (request, response) => {
  const pdf = await mustOwnPdf(request.body['pdfId'], request.currentUser);
  await knex('pdf').where({ id: pdf.id }).del();
  await awsS3.send(new DeleteObjectCommand({ Bucket: process.env['AWS_BUCKET_NAME'], Key: pdf.s3Key }));
  response.success({});
};

const createHighlight = async (request, response) => {
  const { id, pdfId, page, color, width, points } = request.body;
  await mustOwnPdf(pdfId, request.currentUser);
  const highlight = (await knex('pdfHighlight')
    .insert({ id, pdfId, page, color, width, points: JSON.stringify(points) })
    .onConflict('id').ignore()
    .returning('*')
  )[0];
  response.success(highlight || {});
};

const deleteHighlight = async (request, response) => {
  const highlight = await knex('pdfHighlight').where({ id: request.body['highlightId'] }).first();
  if (highlight) {
    await mustOwnPdf(highlight.pdfId, request.currentUser);
    await knex('pdfHighlight').where({ id: highlight.id }).del();
  }
  response.success({});
};

const createBookmark = async (request, response) => {
  const { id, pdfId, page, y, highlightIds } = request.body;
  await mustOwnPdf(pdfId, request.currentUser);
  const bookmark = (await knex('pdfBookmark')
    .insert({ id, pdfId, page, y })
    .onConflict('id').ignore()
    .returning('*')
  )[0];
  if (highlightIds && highlightIds.length > 0) {
    await knex('pdfHighlight').where({ pdfId }).whereIn('id', highlightIds).update({ bookmarkId: id });
  }
  response.success(bookmark || {});
};

// [claude comment] "again" - see it tomorrow, "good" - stretch the interval, "understood" - the bookmark comes out of the book
const reviewBookmark = async (request, response) => {
  const bookmark = await mustOwnBookmark(request.body['bookmarkId'], request.currentUser);
  const now = new Date();
  let changes;
  if (request.body['outcome'] === 'understood') {
    changes = { archivedAt: now };
  } else if (request.body['outcome'] === 'again') {
    changes = { intervalDays: 1, nextDueAt: new Date(now.getTime() + DAY) };
  } else {
    const intervalDays = bookmark.nOfReviews === 0 ? 3 : Math.max(3, Math.round(bookmark.intervalDays * 2.5));
    changes = { intervalDays, nextDueAt: new Date(now.getTime() + intervalDays * DAY) };
  }

  const updated = (await knex('pdfBookmark')
    .where({ id: bookmark.id })
    .update({ ...changes, nOfReviews: bookmark.nOfReviews + 1, lastReviewedAt: now })
    .returning('*')
  )[0];
  response.success(updated);
};

const removeBookmark = async (request, response) => {
  const bookmark = await mustOwnBookmark(request.body['bookmarkId'], request.currentUser);
  await knex('pdfBookmark').where({ id: bookmark.id }).update({ archivedAt: new Date() });
  response.success({});
};

// [claude comment] with ifAhead, also returns bookmarks that aren't due yet (soonest first) - for "review ahead"
const getBookmarksToReview = async (request, response) => {
  await mustBeAuthenticated(request.currentUser);
  const query = knex('pdfBookmark')
    .join('pdf', 'pdf.id', 'pdfBookmark.pdfId')
    .where('pdf.userId', request.currentUser.id)
    .whereNull('pdfBookmark.archivedAt')
    .select('pdfBookmark.*', 'pdf.title as pdfTitle')
    .orderBy('pdfBookmark.nextDueAt');
  if (request.body['pdfId']) query.where('pdf.id', request.body['pdfId']);
  if (!request.body['ifAhead'] || request.body['ifAhead'] === 'false') query.where('pdfBookmark.nextDueAt', '<=', new Date());

  response.success(await query);
};

export default {
  getMyPdfs, getPdf, updatePdf, deletePdf,
  createHighlight, deleteHighlight,
  createBookmark, reviewBookmark, removeBookmark, getBookmarksToReview
};
