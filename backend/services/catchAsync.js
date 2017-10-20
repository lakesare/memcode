// catch Async Await function's error
const catchAsync = (asyncFunction) =>
  (request, response, next) => {
    const promise = asyncFunction(request, response, next);
    promise.catch((error) => {
      next(error);
    });
  };

export { catchAsync };
