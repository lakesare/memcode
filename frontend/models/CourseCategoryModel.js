const sortByAmountOfCoursesFn = (a, b) => {
  if (a.amountOfCourses > b.amountOfCourses) {
    return -1;
  } else if (a.amountOfCourses < b.amountOfCourses) {
    return 1;
  } else {
    return 0;
  }
};

const sortByAlphabetFn = (a, b) => {
  if (a.name < b.name) {
    return -1;
  } else if (a.name > b.name) {
    return 1;
  } else {
    return 0;
  }
};

const deriveAndSortCategoriesPerGroup = (categories, group) =>
  categories
    .filter((category) => category.courseCategoryGroupId === group.id)
    .sort((a, b) => sortByAmountOfCoursesFn(a, b) || sortByAlphabetFn(a, b));

export default {
  sortByAmountOfCoursesFn, sortByAlphabetFn,
  deriveAndSortCategoriesPerGroup
};
