import knex from '#~/db/knex.js';
import jwt from 'jsonwebtoken';
import { mustBeAuthenticated } from '#~/services/auth.js';

const updateAccount = async (request, response, next) => {
  await mustBeAuthenticated(request.currentUser);

  const { username, email, avatar_url, isSubscribedToMarketingEmails } = request.body;
  const userId = request.currentUser.id;

  // Validate inputs
  if (!username || username.trim().length < 2) {
    return response.validation(['Username must be at least 2 characters long.']);
  }

  if (!email || !email.includes('@')) {
    return response.validation(['Please provide a valid email address.']);
  }

  try {
    // Only check username uniqueness if the user is actually changing their username
    if (username.trim() !== request.currentUser.username) {
      const existingUser = await knex('user')
        .where('username', username.trim())
        .whereNot('id', userId)
        .first();

      if (existingUser) {
        return response.validation(['Username is already taken.']);
      }
    }

    // Update user account
    const updateData = {
      username: username.trim(),
      email: email.trim()
    };
    
    // Update email subscription preference
    updateData.is_subscribed_to_marketing_emails = isSubscribedToMarketingEmails;
    
    // Only update avatar_url if provided
    if (avatar_url) {
      updateData.avatar_url = avatar_url;
    }
    
    await knex('user')
      .where('id', userId)
      .update(updateData);

    // Fetch updated user data
    const updatedUser = await knex('user')
      .select('id', 'username', 'email', 'avatar_url', 'oauth_provider', 'oauth_id', 'is_subscribed_to_marketing_emails')
      .where('id', userId)
      .first();

    // Generate new JWT token with updated user data
    const token = jwt.sign(updatedUser, process.env['JWT_SECRET']);

    response.success({ user: updatedUser, token });
  } catch (error) {
    console.error('Error updating user account:', error);
    response.error('Failed to update account. Please try again.');
  }
};

export default updateAccount;