// @param postgresInterval - e.g. { hours: -4, minutes: -45, seconds: -5, milliseconds: -311.914 }
//
// => 4 hours (independent of whether it was '-4 hours' or '4 hours')
const humanizePostgresInterval = (postgresInterval) => {
  const biggestMeasure = Object.keys(postgresInterval)[0];
  const amount = Math.abs(postgresInterval[biggestMeasure]);

  return `${amount} ${biggestMeasure}`;
};

export default humanizePostgresInterval;
