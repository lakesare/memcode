import select from './select';
import insert from './insert';
import update from './update';
import ddelete from './delete';

const Model = {
  select,
  insert,
  update,
  delete: ddelete
};

export default Model;
