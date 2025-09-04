// Returns the user's avatar URL, or default avatar if avatarUrl is null/undefined
const getUserAvatar = (user) => {
  if (user && user.avatarUrl) {
    return user.avatarUrl;
  }
  return '/android-chrome-512x512.png';
};

export default getUserAvatar;
