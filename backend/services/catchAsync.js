// catch Async Await function's error
//
// catchAsync can only accept async functions, because otherwise .catch is undefined.
// (or they need to return a promise, but that's not the case with express endpoints)
const catchAsync = (asyncFunction) =>
  (request, response, next) => {
    const promise = asyncFunction(request, response, next);
    promise
      .catch((error) => {
        next(error);
      });
  };

export { catchAsync };
