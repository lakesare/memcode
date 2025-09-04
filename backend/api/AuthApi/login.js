import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import knex from '#~/db/knex.js';

const login = async (request, response) => {
  const { username, password } = request.body;

  // Validate input
  if (!username || !password) {
    return response.validation('Username and password are required');
  }

  // Find password user (oauthProvider='password', oauthId=username)
  const dbUser = await knex('user')
    .where({ 
      oauthProvider: 'password',
      oauthId: username 
    })
    .first();
  if (!dbUser) {
    return response.validation('Invalid username or password');
  }

  // Verify password
  if (!dbUser.passwordHash) {
    return response.validation('Invalid username or password');
  }
  
  const isValidPassword = await bcrypt.compare(password, dbUser.passwordHash);
  if (!isValidPassword) {
    return response.validation('Invalid username or password');
  }

  // Generate JWT token
  const token = jwt.sign(dbUser, process.env['JWT_SECRET']);
  
  response.success({ token, user: dbUser });
};

export default login;
