import knex from '#~/db/knex.js';
import { mustBeAuthenticated } from '#~/services/auth.js';

const mustOwnPdf = async (pdfId, currentUser) => {
  await mustBeAuthenticated(currentUser);

  const pdf = await knex('pdf').where({ id: pdfId }).first();
  if (!pdf || pdf.userId !== currentUser.id) {
    const error = new Error('Pdf not found');
    error.status = 404;
    throw error;
  }

  return pdf;
};

const mustOwnBookmark = async (bookmarkId, currentUser) => {
  const bookmark = await knex('pdfBookmark').where({ id: bookmarkId }).first();
  if (!bookmark) {
    const error = new Error('Bookmark not found');
    error.status = 404;
    throw error;
  }
  await mustOwnPdf(bookmark.pdfId, currentUser);
  return bookmark;
};

export { mustOwnPdf, mustOwnBookmark };
export default mustOwnPdf;
