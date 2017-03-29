const dateNDaysFromToday = (n) =>
  new Date(currentDateInMilliseconds() + (n * oneDayInMilliseconds));

const currentDateInMilliseconds = () =>
  new Date().getTime();

const oneDayInMilliseconds = 1000 * 60 * 60 * 24;

export { dateNDaysFromToday };
