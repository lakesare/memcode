const url = {
  courseEditOrShow: (currentUser, course) => {
    const ifCanEdit =
      currentUser &&
      currentUser.id === course.userId;

    return ifCanEdit ?
      `/courses/${course.id}/edit` :
      `/courses/${course.id}`;
  }
};

export { url };
