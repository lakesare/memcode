const getAmountOfCoursesPerGroup = (group, categories) => {
  const categoriesInThisGroup = categories.filter((category) => category.courseCategoryGroupId === group.id);
  const sumOfCoursesInCategoriesInThisGroup = categoriesInThisGroup.reduce(
    (sum, category) => sum + category.amountOfCourses,
    0 // initial sum is 0
  );
  return sumOfCoursesInCategoriesInThisGroup;
};

const sortByAmountOfCourses = (groups, categories) =>
  groups.sort((a, b) => {
    const amountA = getAmountOfCoursesPerGroup(a, categories);
    const amountB = getAmountOfCoursesPerGroup(b, categories);
    if (amountA > amountB) {
      return -1;
    } else if (amountA < amountB) {
      return 1;
    } else {
      return 0;
    }
  });

export default {
  sortByAmountOfCourses
};
