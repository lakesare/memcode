const url = {
  courseEditOrShow: (currentUser, course) => {
    const ifWideEnough = window.innerWidth > 900;

    const ifCanEdit =
      currentUser &&
      currentUser.id === course.userId;

    return ifCanEdit && ifWideEnough ?
      `/courses/${course.id}/edit` :
      `/courses/${course.id}`;
  }
};

export { url };
export default url;
