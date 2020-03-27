// Copied from https://stackoverflow.com/a/57120772/3192470, slightly converted for eslint
const datetimeDiff = (t0, t1) => {
  const d = t1 - t0;
  const weekdays = Math.floor(d / 1000 / 60 / 60 / 24 / 7);
  const days     = Math.floor(d / 1000 / 60 / 60 / 24 - weekdays * 7);
  const hours    = Math.floor(d / 1000 / 60 / 60 - weekdays * 7 * 24 - days * 24);
  const minutes  = Math.floor(d / 1000 / 60 - weekdays * 7 * 24 * 60 - days * 24 * 60 - hours * 60);
  const seconds  = Math.floor(d / 1000 - weekdays * 7 * 24 * 60 * 60 - days * 24 * 60 * 60 - hours * 60 * 60 - minutes * 60);
  const milliseconds = Math.floor(d - weekdays * 7 * 24 * 60 * 60 * 1000 - days * 24 * 60 * 60 * 1000 - hours * 60 * 60 * 1000 - minutes * 60 * 1000 - seconds * 1000);
  const t = {};
  ['weekdays', 'days', 'hours', 'minutes', 'seconds', 'milliseconds'].forEach((q) => {
    if (eval(q) > 0) {
      t[q] = eval(q);
    }
  });
  return t;
};

export default datetimeDiff;
