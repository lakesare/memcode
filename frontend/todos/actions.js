import t from './actionTypes';

export const add = (text) => ({
  type: t.ADD,
  payload: { text }
});