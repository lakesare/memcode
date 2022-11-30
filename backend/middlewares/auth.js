import jwt from 'jsonwebtoken';

const auth = (callback) =>
  (request, response, next) => {
    const authorizationHeader = request.headers['authorization'];
    // (does work!)
    if (!authorizationHeader) next(new Error("No authorization header provided"));

    const token = authorizationHeader.split('Bearer ')[1];
    try {
      const user = jwt.verify(token, process.env['JWT_SECRET']);
      request.currentUser = user;
      callback(request, response, next);
    } catch (e) {
      // (does work too!)
      next(new Error("Couldn't authorize."));
    }
  };

export default auth;
