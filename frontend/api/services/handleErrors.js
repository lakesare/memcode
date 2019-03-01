const handleErrors = (response) => {
  if (response.status === 200) {
    return response.json()
      .catch((error) => Promise.reject(error.toString()));
  } else {
    return response.json()
      .then((error) => Promise.reject(error))
      .catch((error) => Promise.reject(error.toString()));
  }
};

export { handleErrors };
export default handleErrors;
