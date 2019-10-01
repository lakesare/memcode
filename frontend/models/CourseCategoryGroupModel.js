const sort = (groups) => {
  const a = groups.find((group) => group.name === 'Hard Sciences');
  const b = groups.find((group) => group.name === 'Soft Sciences');
  const c = groups.find((group) => group.name === 'Languages');
  const d = groups.find((group) => group.name === 'Other');

  return [a, b, c, d];
};

export default {
  sort
};
