/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 76);
/******/ })
/************************************************************************/
/******/ ({

/***/ 2:
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),

/***/ 27:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handleErrors = undefined;

var _prettyError = __webpack_require__(38);

var _prettyError2 = _interopRequireDefault(_prettyError);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prettyError = new _prettyError2.default(); // eslint-disable-next-line import/no-extraneous-dependencies


prettyError.skipPackage('express', 'babel-polyfill', 'regenerator-runtime');
prettyError.skipPath('internal/process/next_tick.js');
prettyError.skipNodeFiles();
prettyError.alias('/Users/lakesare/Desktop/memcode/backend/webpacked/test/components/auth/routes/webpack:', '');
prettyError.alias('/Users/lakesare/Desktop/memcode/backend/webpacked/test', '');
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
var handleErrors = function handleErrors(error, request, response, next) {
  if (process.env.NODE_ENV !== 'test') {
    var renderedError = prettyError.render(error);
    console.log(renderedError);
  }

  // interestingly if error.message is undefined, express will return {}
  // it must _always_ be a string. I'm not sure if it is.
  response.status(500).json({ error: error.message || error || '' });
};

exports.handleErrors = handleErrors;

/***/ }),

/***/ 3:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// catch Async Await function's error
//
// catchAsync can only accept async functions, because otherwise .catch is undefined.
// (or they need to return a promise, but that's not the case with express endpoints)
var catchAsync = function catchAsync(asyncFunction) {
  return function (request, response, next) {
    var promise = asyncFunction(request, response, next);
    promise.catch(function (error) {
      next(error);
    });
  };
};

exports.catchAsync = catchAsync;

/***/ }),

/***/ 38:
/***/ (function(module, exports) {

module.exports = require("pretty-error");

/***/ }),

/***/ 40:
/***/ (function(module, exports) {

module.exports = require("supertest");

/***/ }),

/***/ 76:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _chai = __webpack_require__(8);

var _supertest = __webpack_require__(40);

var _supertest2 = _interopRequireDefault(_supertest);

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(3);

var _handleErrors = __webpack_require__(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var createAppWithRoute = function createAppWithRoute(routeCallback) {
  var app = (0, _express2.default)();
  var testRouter = _express2.default.Router();
  testRouter.get('/hello', routeCallback);

  app.use('/test', testRouter);
  app.use(_handleErrors.handleErrors);

  return app;
};

describe('catchingErrorsInRoutes', function () {
  it('no errors => returns status and json as per route definition', function (done) {
    var app = createAppWithRoute((0, _catchAsync.catchAsync)(function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                response.status(234).json({ hm: 'yes' });

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function (_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }()));

    (0, _supertest2.default)(app).get('/test/hello').expect(234).end(function (error, response) {
      (0, _chai.expect)(response.body).to.deep.equal({ hm: 'yes' });
      error ? done(error) : done();
    });
  });

  it('sync error without catchAsync', function (done) {
    var app = createAppWithRoute(function () {
      throw new Error('Rrr!');
    });

    (0, _supertest2.default)(app).get('/test/hello').expect(500, { error: 'Rrr!' }, done);
  });

  it('sync error with catchAsync', function (done) {
    var app = createAppWithRoute((0, _catchAsync.catchAsync)(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              throw new Error('Rrr!');

            case 1:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }))));

    (0, _supertest2.default)(app).get('/test/hello').expect(500, { error: 'Rrr!' }, done);
  });

  // ___didn't include because couldn't catch Unhandled promise rejection (rejection id: 2): Rrr!
  // it('async error without catchAsync', (done) => {})

  it('async error with catchAsync', function (done) {
    var app = createAppWithRoute((0, _catchAsync.catchAsync)(_asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
      return regeneratorRuntime.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              _context3.next = 2;
              return Promise.reject('Sss!');

            case 2:
            case 'end':
              return _context3.stop();
          }
        }
      }, _callee3, undefined);
    }))));

    (0, _supertest2.default)(app).get('/test/hello').expect(500, { error: 'Sss!' }, done);
  });
});

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ })

/******/ });
//# sourceMappingURL=catchingErrorsInRoutes.test.js.map