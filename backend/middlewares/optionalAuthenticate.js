import jwt from 'jsonwebtoken';

const optionalAuthenticate = (request, response, next) => {
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

export default optionalAuthenticate;
