import { Buffer } from 'buffer/';

const getCurrentUserFromLocalStorage = () => {
  const token = localStorage.getItem('jwt'); // => lala.lala.lala
  if (token === "null") {
    return null;
  } else {
    const base64User = token.split('.')[1]; // => lala
    const stringedUser = Buffer.from(base64User, 'base64').toString(); // => "{"username":"lakesare","oauthProvider":"github","oauthId":"7578559","avatarUrl":"https://avatars.githubusercontent.com/u/7578559?v=3","iat":1485801827}"
    return JSON.parse(stringedUser);
  }
}

export { getCurrentUserFromLocalStorage };
