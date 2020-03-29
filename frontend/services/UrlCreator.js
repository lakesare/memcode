const UrlCreator = {
  courseEditOrShow: (currentUser, course) => {
    return `/courses/${course.id}`;
  }
};

export default UrlCreator;
