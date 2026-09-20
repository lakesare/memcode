// because express needs to see there are 4 arguments to treat :error as error.
// this middleware should also come last.
const handleErrors = (error, request, response, next) => {
  console.error(error);

  // interestingly if error.message is undefined, express will return {}
  // it must _always_ be a string. I'm not sure if it is.
  const status = error.status || 500;
  response.status(status).json(error.message || error || '');
};

export default handleErrors;
