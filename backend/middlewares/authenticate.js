import jwt from 'jsonwebtoken';

// make request.currentUser available
// request.currentUser.oauthId,
// request.currentUser.oauthProvider
const authenticateMiddleware = (request, response, next) => {
  if (request.headers['authorization']) {
    const token = request.headers['authorization'].split('Bearer ')[1];
    jwt.verify(token, process.env['JWT_SECRET'], (error, user) => {
      if (error) {
        response.status(401).json({ error });
      } else {
        request.currentUser = user;
        next();
      }
    });
  } else {
    response.status(401).json({ error: "No authorization header provided" });
  }
};

const optionalAuthenticateMiddleware = (request, response, next) => {
  if (request.headers['authorization']) {
    const token = request.headers['authorization'].split('Bearer ')[1];
    jwt.verify(token, process.env['JWT_SECRET'], (error, user) => {
      if (!error) request.currentUser = user;
      next();
    });
  } else {
    next();
  }
};

export { authenticateMiddleware, optionalAuthenticateMiddleware };
