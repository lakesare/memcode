import select from './select/index.js';
import insert from './insert.js';
import update from './update.js';
import ddelete from './delete.js';

export default {
  select,
  insert,
  update,
  delete: ddelete
};
