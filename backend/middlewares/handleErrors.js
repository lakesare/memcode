// eslint-disable-next-line import/no-extraneous-dependencies
import PrettyError from 'pretty-error';
const prettyError = new PrettyError();

prettyError.skipPackage('express', 'babel-polyfill', 'regenerator-runtime');
prettyError.skipPath('internal/process/next_tick.js');
prettyError.skipNodeFiles();
prettyError.alias('/Users/lakesare/Desktop/memcode/backend/webpacked/test/components/auth/routes/webpack:', '');
prettyError.alias('/Users/lakesare/Desktop/memcode/backend/webpacked/test', '');
prettyError.alias('/Users/lakesare/Desktop/memcode/backend/webpacked/webpack:', '/backend');
prettyError.appendStyle({
  // our error message
  'pretty-error > header > message': {
    // let's change its color:
    color: 'bright-white',
    // we can also change the background color:
    background: 'black'
  },

  // each trace item ...
  'pretty-error > trace > item': {
    // ... can have a margin ...
    marginLeft: 20
  },

  'pretty-error > trace > item > header > pointer > file': {
    color: 'blue'
  },

  'pretty-error > trace > item > header > pointer > colon': {
    color: 'cyan'
  },

  'pretty-error > trace > item > header > pointer > line': {
    color: 'black'
  },

  'pretty-error > trace > item > header > what': {
    color: 'bright-white'
  }
});

// because express needs to see there are 4 arguments to treat :error as error.
// this middleware should also come last.
// eslint-disable-next-line no-unused-vars
const handleErrors = (error, request, response, next) => {
  if (process.env.NODE_ENV === 'development') {
    const renderedError = prettyError.render(error);
    console.log(renderedError);
  } else {
    console.error(error);
  }

  // interestingly if error.message is undefined, express will return {}
  // it must _always_ be a string. I'm not sure if it is.
  const status = error.status || 500;
  response.status(status).json(error.message || error || '');
};

export default handleErrors;
