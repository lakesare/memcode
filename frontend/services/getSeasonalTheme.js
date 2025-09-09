const getSeasonalTheme = () => {
  // return 'halloween';
  // return 'christmas';
  const now = new Date();
  const month = now.getMonth() + 1; // getMonth() returns 0-11, we want 1-12
  const day = now.getDate();
  
  // Halloween: October 24 - November 2 (1 week before + 2 days after Oct 31)
  if (
    (month === 10 && day >= 24) || // Oct 24-31
    (month === 11 && day <= 2)    // Nov 1-2
  ) {
    return 'halloween';
  }
  
  // Christmas: December 18 - December 27 (1 week before + 2 days after Dec 25)
  if (month === 12 && day >= 18 && day <= 27) {
    return 'christmas';
  }
  
  return null; // No seasonal theme
};

export default getSeasonalTheme;
