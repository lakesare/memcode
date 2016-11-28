import PrettyError from 'pretty-error';
const prettyError = new PrettyError();
prettyError.skipPackage('express');
prettyError.alias('/home/lakesare/Desktop/memcode/backend/webpacked/webpack:', 'backend');
prettyError.appendStyle({
  // this is a simple selector to the element that says 'Error'
  'pretty-error > header': {
    display: 'block',
    marginTop: 3
  },
  'pretty-error > header > title > kind': {
    background: 'black',
    color: 'bright-red' 
  }
});
prettyError.start();

export { prettyError };