import * as cookies from "js-cookie";

const string = cookies.get('currentUser');
const currentUser = (string !== "undefined") ? JSON.parse(string) : null;

window.currentUser = currentUser;

export { currentUser };