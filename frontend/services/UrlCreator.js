const UrlCreator = {
  courseEditOrShow: (currentUser, course) => {
    const ifWideEnough = window.innerWidth > 900;

    const ifCanEdit =
      currentUser &&
      // Temporary, fix case in db ||
      currentUser.id === course.user_id || currentUser.id === course.userId;

    return ifCanEdit && ifWideEnough ?
      `/courses/${course.id}/edit` :
      `/courses/${course.id}`;
  }
};

export default UrlCreator;
