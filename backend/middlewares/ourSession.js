import session from 'express-session';

const ourSession = session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
});

export { ourSession };