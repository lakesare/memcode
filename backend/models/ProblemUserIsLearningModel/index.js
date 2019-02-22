import insert from './insert';
import select from './select';
import ddelete from './delete';

const Model = {
  select,
  insert,
  delete: ddelete
};

export default Model;
