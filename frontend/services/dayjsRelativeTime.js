import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

// [claude comment] 35 hours away - before: "a day", after: "35 hours"
dayjs.extend(relativeTime, {
  thresholds: [
    { l: 's',  r: 44, d: 'second' },
    { l: 'm',  r: 89 },
    { l: 'mm', r: 44, d: 'minute' },
    { l: 'h',  r: 89 },
    { l: 'hh', r: 47, d: 'hour' },
    { l: 'dd', r: 25, d: 'day' },
    { l: 'M',  r: 45 },
    { l: 'MM', r: 10, d: 'month' },
    { l: 'y',  r: 17 },
    { l: 'yy',        d: 'year' }
  ]
});

// [claude comment] before: "an hour", "a few seconds", after: "1 hour", "12 seconds"
dayjs.extend(updateLocale);
dayjs.updateLocale('en', {
  relativeTime: {
    s: (amount) => `${amount} ${amount === 1 ? 'second' : 'seconds'}`,
    m: '1 minute',
    h: '1 hour',
    M: '1 month',
    y: '1 year'
  }
});
