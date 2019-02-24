const injectResponseTypes = (request, response, next) => {
  response.success = (obj) => {
    response.status(200).json(obj || {});
  };
  response.error = (string) => {
    response.status(500).json(string);
  };
  response.validation = (array) => {
    response.status(400).json(array);
  };
  next();
};

export default injectResponseTypes;
