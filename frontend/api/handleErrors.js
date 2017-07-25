// as per https://www.tjvantoll.com/2015/09/13/fetch-and-errors
const handleErrors = (response) => {
  if (response.status === 200) {
    return response.json();
  } else {
    return response.json()
      .then((error) => {
        console.log(error);
        return Promise.reject(error);
      });
  }
};

export { handleErrors };
