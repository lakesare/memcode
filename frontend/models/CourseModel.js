const validateForm = (formState) => {
  if (formState.title.length < 2) {
    return ({ title: 'Title must be longer than 2 letters' });
  } else {
    return true;
  }
};

export default { validateForm };
