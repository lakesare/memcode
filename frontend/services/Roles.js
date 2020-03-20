const canIEditCourse = ({ currentUser, course, coauthors }) => {
  if (!currentUser) return false;
  const isAuthor = amICourseAuthor({ currentUser, course });
  const isCoauthor = amICourseCoauthor({ currentUser, coauthors });
  return isAuthor || isCoauthor;
};

const amICourseAuthor = ({ currentUser, course }) => {
  return currentUser && currentUser.id === course.userId;
};

const amICourseCoauthor = ({ currentUser, coauthors }) => {
  return !!coauthors.find((coauthor) => coauthor.id === currentUser.id);
};

export default {
  canIEditCourse,
  amICourseCoauthor,
  amICourseAuthor
};
