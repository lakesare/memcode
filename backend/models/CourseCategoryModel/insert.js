import db from '~/db/init.js';
// import { camelizeDbColumns } from '~/services/camelizeDbColumns';

const insert = {
  create: (courseCategory) =>
    db.one(
      "INSERT INTO course_category (name, course_category_group_id) \
      VALUES (${name}, ${courseCategoryGroupId}) RETURNING *",
      {
        name: courseCategory.name,
        courseCategoryGroupId: courseCategory.courseCategoryGroupId
      }
    ),

  createGroup: (courseCategoryGroup) =>
    db.one(
      "INSERT INTO course_category_group (name) VALUES (${name}) RETURNING *",
      {
        name: courseCategoryGroup.name
      }
    ),

  seed: () => {
    const createGroupWithCategories = async (groupName, categoryNames) => {
      const group = await insert.createGroup({ name: groupName });

      const categoryPromises = categoryNames.map((name) =>
        insert.create({ name, courseCategoryGroupId: group.id })
      );
      await Promise.all(categoryPromises);
    };

    return Promise.all([
      createGroupWithCategories('Hard Sciences', ['Mathematics', 'Physics', 'Astronomy', 'Biology', 'Programming Languages', 'Computer Science']),
      createGroupWithCategories('Soft Sciences', ['Politics', 'Economics', 'Psychology', 'Law', 'History', 'Music', 'Literature']),
      createGroupWithCategories('Languages', ['English', 'German', 'Swedish'])
    ]);
  }

};

export default insert;
