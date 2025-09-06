import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from '#~/db/knex.js';
import NotificationModel from '#~/models/NotificationModel.js';

const signup = async (request, response) => {
  const { username, email, password } = request.body;

  // Validate input - return immediately on first error
  if (!username) {
    return response.validation('Username is required');
  }
  if (username.length < 2) {
    return response.validation('Username must be at least 2 characters');
  }

  if (!email) {
    return response.validation('Email is required');
  }

  if (!password) {
    return response.validation('Password is required');
  }
  if (password.length < 6) {
    return response.validation('Password must be at least 6 characters');
  }

  // Check if username already exists (for password users: oauthProvider='password', oauthId=username)
  const existingUserByUsername = await knex('user')
    .where({ 
      oauthProvider: 'password',
      oauthId: username 
    })
    .first();
  if (existingUserByUsername) {
    return response.validation('Username already taken');
  }

  // Check if email already exists among password users
  const existingUserByEmail = await knex('user')
    .where({ 
      email,
      oauthProvider: 'password'
    })
    .first();
  if (existingUserByEmail) {
    return response.validation('Email already registered');
  }

  // Hash password and create user
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  
  const [dbUser] = await knex('user')
    .insert({
      oauthProvider: 'password',
      oauthId: username,
      username,
      email,
      passwordHash
    })
    .returning('*');

  // Send welcome notification and add welcome course
  await NotificationModel.welcome_to_memcode({ userId: dbUser.id });
  // Only assign welcome course in production
  if (process.env.NODE_ENV === 'production') {
    const welcomeCourseId = 6868;
    await knex('courseUserIsLearning').insert({ courseId: welcomeCourseId, userId: dbUser.id, active: true });
  }

  // Generate JWT token
  const token = jwt.sign(dbUser, process.env['JWT_SECRET']);
  
  response.success({ token, user: dbUser });
};

export default signup;
