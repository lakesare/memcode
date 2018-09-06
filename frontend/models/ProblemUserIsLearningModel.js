const getHumanNextDueDateIn = (nextDueDateIn) => {
  const biggestMeasure = Object.keys(nextDueDateIn)[0];
  const amount = nextDueDateIn[biggestMeasure];

  return `${amount} ${biggestMeasure}`;
};

export default { getHumanNextDueDateIn };
