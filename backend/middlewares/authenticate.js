import jwt from 'jsonwebtoken';

const authenticateMiddleware = (request, response, next) => {
  if (request.headers['authorization']){
    const token = request.headers['authorization'].split('Bearer ')[1];
    jwt.verify(token, 'serverereSecretty', (error, user) => {
      if (error) {
        response.status(403).json({ error })
      } else {
        request.currentUser = user;
        next();
      }
    });
  } else {
    response.status(403).json({ error: "No authorization header provided" })
  }
};

export { authenticateMiddleware };
