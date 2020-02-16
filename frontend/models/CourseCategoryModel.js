const deriveAndSortCategoriesPerGroup = (categories, group) =>
  categories
    .filter((category) => category.courseCategoryGroupId === group.id)
    .sort((a, b) => {
      const order = [
        'Programming Languages', 'Computer Science', 'Mathematics', 'Biology', 'Physics',
        'Psychology', 'Politics', 'Economics', 'Law', 'History', 'Music', 'Literature', 'Philosophy', 'Psychology',
        'English', 'German', 'Spanish',
        'Other'
      ];

      if (order.indexOf(a.name) < order.indexOf(b.name)) {
        return -1;
      } else {
        return 1;
      }
    });

export default {
  deriveAndSortCategoriesPerGroup
};
