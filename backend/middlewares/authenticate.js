import jwt from 'jsonwebtoken';

// make request.currentUser available
// request.currentUser.oauthId,
// request.currentUser.oauthProvider
const authenticateMiddleware = (request, response, next) => {
  if (request.headers['authorization']) {
    const token = request.headers['authorization'].split('Bearer ')[1];
    jwt.verify(token, 'serverereSecretty', (error, user) => {
      if (error) {
        response.status(500).json({ error });
      } else {
        // eslint-disable-next-line
        request.currentUser = user;
        next();
      }
    });
  } else {
    response.status(500).json({ error: "No authorization header provided" });
  }
};

export { authenticateMiddleware };
