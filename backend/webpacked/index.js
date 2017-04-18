/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	return __webpack_require__(__webpack_require__.s = 48);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.db = undefined;

var _pgPromise = __webpack_require__(2);

var pgPromise = _interopRequireWildcard(_pgPromise);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// for pgOptions
/* eslint-disable */ // because it's taken from online source, may want to rewrite some time
var camelizeColumns = function camelizeColumns(data) {
  var template = data[0];

  var _loop = function _loop(prop) {
    var camel = pgPromise.utils.camelize(prop);
    if (!(camel in template)) {
      data.map(function (d) {
        d[camel] = d[prop];
        delete d[prop];
      });
    }
  };

  for (var prop in template) {
    _loop(prop);
  }
};

var pgOptions = {
  query: function query(e) {
    var cyan = "\x1b[36m%s\x1b[0m";
    console.log(cyan, e.query); // log the query being executed
  },
  receive: function receive(data) {
    camelizeColumns(data);
  } // https://coderwall.com/p/irklcq
};

var getConnectionString = function getConnectionString() {
  switch (process.env.NODE_ENV) {
    case 'development':
      return {
        host: 'localhost', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'memcode',
        user: 'postgres',
        password: '`1`1`1'
      };
    case 'test':
      return {
        host: 'localhost', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'memcode_test',
        user: 'postgres',
        password: '`1`1`1'
      };
    case 'production':
      // this variable is set automatically after we do heroku addons:create heroku-postgresql:hobby-dev
      return process.env.DATABASE_URL;
  }
};

var pgPackage = pgPromise.default(pgOptions);
var db = pgPackage(getConnectionString());
db.connect().then(function (obj) {
  obj.done(); // success, release the connection;
}).catch(function (error) {
  console.log("ERROR:", error.message || error);
});

exports.db = db;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("pg-promise");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelizeDbColumns = undefined;

var _pgPromise = __webpack_require__(2);

var camelizeHashKeys = function camelizeHashKeys(oldHash) {
  var newHash = {};
  if (oldHash === undefined || oldHash === null) return null;
  Object.keys(oldHash).forEach(function (key) {
    var camelizedKey = _pgPromise.utils.camelize(key);
    newHash[camelizedKey] = oldHash[key];
  });
  return newHash;
};

// a{ courseUserIsLearning: b{ wow_yes: 1 }, amountOfProblems: 3 }
var camelizeColumnsIn = function camelizeColumnsIn(aOld, asTitlesArray) {
  var aNew = {};

  Object.keys(aOld).forEach(function (key) {
    asTitlesArray.includes(key) ? aNew[key] = camelizeHashKeys(aOld[key]) : aNew[key] = aOld[key];
  });

  return aNew;
};

// output of row_to_json doesn't get camelized, lets do it manually like so:
// .then(array => camelizeDbColumns(array, ['course', 'courseUserIsLearning']))
// http://stackoverflow.com/questions/33023469/node-postgres-and-getting-joined-fields-with-repeated-names
var camelizeDbColumns = function camelizeDbColumns(arrayOrHash, columnTitlesArray) {
  if (Array.isArray(arrayOrHash)) {
    return arrayOrHash.map(function (hash) {
      return camelizeColumnsIn(hash, columnTitlesArray);
    });
  } else {
    return camelizeColumnsIn(arrayOrHash, columnTitlesArray);
  }
};

exports.camelizeDbColumns = camelizeDbColumns;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// catch Async Await function's error
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ddelete = exports.update = exports.insert = exports.select = undefined;

var _select = __webpack_require__(13);

var _insert = __webpack_require__(12);

var _update = __webpack_require__(14);

var _ddelete = __webpack_require__(11);

// CREATE TABLE course (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR NOT NULL,

//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
// );

exports.select = _select.select;
exports.insert = _insert.insert;
exports.update = _update.update;
exports.ddelete = _ddelete.ddelete;

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// ___why not use original method?
// (http://www.blueraja.com/blog/477/a-better-spaced-repetition-learning-algorithm-sm2)
// original method resolves into intervals too harsh:
//
// { days: 6 },
// { days: 10 },
// { days: 30 },
// { days: 99 },
// { days: 339 },
// { days: 1231 },
// { days: 4724 },
// { days: 19128 },
// { days: 24428 }

// memrise
//
// 4 hours, 12 hours, 1 day, 6 days, 12 days, 24 days, 48 days, 96 days, 180 days

// mine
// [ PostgresInterval { hours: 4, minutes: 48 },
//   PostgresInterval { days: 1, hours: 10, minutes: 59, seconds: 31 },
//   PostgresInterval { days: 4, hours: 19, minutes: 32, seconds: 9 },
//   PostgresInterval { days: 8, hours: 20, minutes: 47, seconds: 2 },
//   PostgresInterval { days: 13, hours: 15, minutes: 53, seconds: 16 },
//   PostgresInterval { days: 19, hours: 6 },
//   PostgresInterval { days: 25, hours: 16, minutes: 16, seconds: 19 },
//   PostgresInterval { days: 32, hours: 23, minutes: 51, seconds: 21 },
//   PostgresInterval { days: 41, hours: 5, minutes: 54, seconds: 14 },
//   PostgresInterval { days: 50, hours: 11, minutes: 34, seconds: 4 },
//   PostgresInterval { days: 60, hours: 18 } ]


// performanceRating: on a scale from 0-5 (0=worst, 5=best)
// 0.28
var getNextScore = function getNextScore(prevEasiness, prevConsecutiveCorrectAnswers, performanceRating) {
  var nextEasiness = clipEasiness(prevEasiness + -0.8 + 0.28 * performanceRating + -0.02 * Math.pow(performanceRating, 2));

  var nextConsecutiveCorrectAnswers = isAnswerCorrect(performanceRating) ? prevConsecutiveCorrectAnswers + 1 : 0;

  var daysToNextReview = clipDaysToNextReview(isAnswerCorrect(performanceRating) ?
  // 6 * (nextEasiness ** (nextConsecutiveCorrectAnswers - 1)) :
  0.2 + 0.2 * (Math.pow(nextEasiness, 2.2) * Math.pow(nextConsecutiveCorrectAnswers - 1, 2.2)) : 1);

  return {
    easiness: nextEasiness,
    consecutiveCorrectAnswers: nextConsecutiveCorrectAnswers,
    daysToNextReview: daysToNextReview
  };
};

var isAnswerCorrect = function isAnswerCorrect(performanceRating) {
  return performanceRating >= 4;
};

// easiness must be >= 1.3
// if it's smaller - make it 1.3
var clipEasiness = function clipEasiness(easiness) {
  return Math.max(easiness, 1.3);
};

var clipDaysToNextReview = function clipDaysToNextReview(days) {
  return Math.min(days, 300);
};

exports.getNextScore = getNextScore;

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var initialScore = function initialScore() {
  return {
    easiness: 2.5,
    consecutiveCorrectAnswers: 0
  };
};

exports.initialScore = initialScore;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = exports.select = undefined;

var _init = __webpack_require__(0);

var select = {
  // getUserByOauth('github', 7578559)
  // => user
  oneByOauth: function oneByOauth(oauthProvider, oauthId) {
    return _init.db.oneOrNone('SELECT * FROM "user" where oauth_provider=${oauthProvider} and oauth_id=${oauthId}', {
      oauthProvider: oauthProvider,
      oauthId: oauthId.toString()
    });
  }
};

var insert = {
  createFromGithub: function createFromGithub(profile) {
    return _init.db.one('INSERT INTO "user" (oauth_provider, oauth_id, username, avatar_url) VALUES (${oauthProvider}, ${oauthId}, ${username}, ${avatarUrl}) RETURNING *', {
      oauthProvider: 'github',
      oauthId: profile.id.toString(),
      username: profile.login,
      avatarUrl: profile.avatar_url
    });
  }
};

exports.select = select;
exports.insert = insert;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(18).install();


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ddelete = undefined;

var _init = __webpack_require__(0);

var ddelete = {
  // will delete all problems of this course and all course_user_is_learning
  destroyCourseWithProblems: function destroyCourseWithProblems(courseId) {
    return _init.db.none('DELETE FROM course WHERE id=${courseId}', { courseId: courseId });
  }
};

exports.ddelete = ddelete;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

var insert = {
  create: function create(course, userId) {
    return _init.db.one('INSERT INTO course (title, description, if_public, user_id) \
      VALUES (${title}, ${description}, ${ifPublic}, ${userId}) RETURNING *', {
      title: course.title,
      description: course.description,
      ifPublic: course.ifPublic,
      userId: userId
    });
  }
};

exports.insert = insert;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

var _camelizeDbColumns = __webpack_require__(3);

var _select = __webpack_require__(16);

var select = {
  allCreated: function allCreated(userId) {
    return (0, _select.fetchCoursesAndTheirStats)('WHERE course.user_id = ${userId}', userId);
  },

  // for /profile. returns all courses userId is currently learning.
  // only active,
  // filtered by amount of due problems (TODO)
  allLearned: function allLearned(userId) {
    return (0, _select.fetchCoursesAndTheirStats)('WHERE course_user_is_learning.user_id = ${userId} AND course_user_is_learning.active = true', userId);
  },

  all: function all() {
    return _init.db.any('SELECT\n        row_to_json(course.*) AS course,\n        COUNT(problem.id)     AS amount_of_problems\n      FROM course\n      LEFT OUTER JOIN problem ON problem.course_id = course.id\n      WHERE if_public = true\n      GROUP BY course.id\n      ').then(function (array) {
      return (0, _camelizeDbColumns.camelizeDbColumns)(array, ['course', 'courseUserIsLearning']);
    });
  },

  oneForActions: function oneForActions(id, userId) {
    return (0, _select.fetchCoursesAndTheirStats)('WHERE course.id = ' + id, userId).then(function (array) {
      return array[0];
    });
  },

  oneById: function oneById(id) {
    return _init.db.one('\n      SELECT *\n      FROM course\n      WHERE course.id = ${id}\n      ', { id: id });
  }
};

exports.select = select;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _init = __webpack_require__(0);

var update = {
  update: function update(id, values) {
    return _init.db.one('\n      UPDATE course\n      SET title = ${title},\n          description = ${description},\n          if_public = ${ifPublic}\n      WHERE id = ${id}\n      RETURNING *\n      ', _extends({}, values, {
      id: id
    }));
  }
};

exports.update = update;

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.authenticateMiddleware = undefined;

var _jsonwebtoken = __webpack_require__(24);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// make request.currentUser available
// request.currentUser.oauthId,
// request.currentUser.oauthProvider
var authenticateMiddleware = function authenticateMiddleware(request, response, next) {
  if (request.headers['authorization']) {
    var token = request.headers['authorization'].split('Bearer ')[1];
    _jsonwebtoken2.default.verify(token, process.env['JWT_SECRET'], function (error, user) {
      if (error) {
        response.status(401).json({ error: error });
      } else {
        // eslint-disable-next-line
        request.currentUser = user;
        next();
      }
    });
  } else {
    response.status(401).json({ error: "No authorization header provided" });
  }
};

exports.authenticateMiddleware = authenticateMiddleware;

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.fetchCoursesAndTheirStats = undefined;

var _init = __webpack_require__(0);

var _camelizeDbColumns = __webpack_require__(3);

var _integerizeDbColumns = __webpack_require__(17);

// fetch course, courseUserAndLearning etc if it exists
//
// problemsToReview - later.
//   basically problem_user_is_learning with nextDueDate < Time.now
// problemsToLearn
//   all problems of this course MINUS learned problem_user_is_learning of this course
//
// => [{
//   course,
//   courseUserIsLearning,
//   amountOfProblemsToReview: 3,
//   amountOfProblemsToLearn: 2,
// }]
var fetchCoursesAndTheirStats = function fetchCoursesAndTheirStats(where, userId) {
  return _init.db.any('SELECT\n      row_to_json(course.*)                  AS course,\n      row_to_json(course_user_is_learning.*) AS course_user_is_learning,\n      COUNT(distinct problem_user_is_learning.id) AS amount_of_problems_to_review,\n      (\n        (SELECT COUNT(problem.*) FROM problem WHERE problem.course_id = course.id) -\n        (SELECT COUNT(problem_user_is_learning.*) FROM problem_user_is_learning WHERE problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id)\n      )                                      AS amount_of_problems_to_learn,\n      COUNT(distinct problem.id)             AS amount_of_problems\n\n    FROM course\n\n    -- course_user_is_learning\n    LEFT OUTER JOIN course_user_is_learning\n      ON (\n        course_user_is_learning.course_id = course.id\n        AND\n        course_user_is_learning.user_id = ${userId}\n      )\n\n    -- amount_of_problems_to_review\n    LEFT OUTER JOIN problem_user_is_learning\n      ON (\n        course_user_is_learning.id = problem_user_is_learning.course_user_is_learning_id\n        AND\n        problem_user_is_learning.next_due_date < timezone(\'UTC\', now())\n      )\n\n    -- amount_of_problems\n    LEFT OUTER JOIN problem ON problem.course_id = course.id\n\n    ' + where + '\n\n    GROUP BY course_user_is_learning.id, course.id\n    ', { userId: userId }).then(function (array) {
    return (0, _camelizeDbColumns.camelizeDbColumns)(array, ['course', 'courseUserIsLearning']);
  }).then(function (array) {
    return (0, _integerizeDbColumns.integerizeDbColumns)(array, ['amountOfProblemsToReview', 'amountOfProblemsToLearn', 'amountOfProblems']);
  });
};

exports.fetchCoursesAndTheirStats = fetchCoursesAndTheirStats;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// a{ courseUserIsLearning: b{ wow_yes: 1 }, amountOfProblems: 3 }
var integerizeColumnsIn = function integerizeColumnsIn(aOld, asTitlesArray) {
  var aNew = {};

  Object.keys(aOld).forEach(function (key) {
    asTitlesArray.includes(key) ? aNew[key] = parseInt(aOld[key], 10) : aNew[key] = aOld[key];
  });

  return aNew;
};

// https://github.com/vitaly-t/pg-promise/issues/118
// COUNT(3) => to return js integer instead of string
var integerizeDbColumns = function integerizeDbColumns(arrayOrHash, columnTitlesArray) {
  if (Array.isArray(arrayOrHash)) {
    return arrayOrHash.map(function (hash) {
      return integerizeColumnsIn(hash, columnTitlesArray);
    });
  } else {
    return integerizeColumnsIn(arrayOrHash, columnTitlesArray);
  }
};

exports.integerizeDbColumns = integerizeDbColumns;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

var SourceMapConsumer = __webpack_require__(21).SourceMapConsumer;
var path = __webpack_require__(6);

var fs;
try {
  fs = __webpack_require__(19);
  if (!fs.existsSync || !fs.readFileSync) {
    // fs doesn't have all methods we need
    fs = null;
  }
} catch (err) {
  /* nop */
}

// Only install once if called multiple times
var errorFormatterInstalled = false;
var uncaughtShimInstalled = false;

// If true, the caches are reset before a stack trace formatting operation
var emptyCacheBetweenOperations = false;

// Supports {browser, node, auto}
var environment = "auto";

// Maps a file path to a string containing the file contents
var fileContentsCache = {};

// Maps a file path to a source map for that file
var sourceMapCache = {};

// Regex for detecting source maps
var reSourceMap = /^data:application\/json[^,]+base64,/;

// Priority list of retrieve handlers
var retrieveFileHandlers = [];
var retrieveMapHandlers = [];

function isInBrowser() {
  if (environment === "browser")
    return true;
  if (environment === "node")
    return false;
  return ((typeof window !== 'undefined') && (typeof XMLHttpRequest === 'function') && !(window.require && window.module && window.process && window.process.type === "renderer"));
}

function hasGlobalProcessEventEmitter() {
  return ((typeof process === 'object') && (process !== null) && (typeof process.on === 'function'));
}

function handlerExec(list) {
  return function(arg) {
    for (var i = 0; i < list.length; i++) {
      var ret = list[i](arg);
      if (ret) {
        return ret;
      }
    }
    return null;
  };
}

var retrieveFile = handlerExec(retrieveFileHandlers);

retrieveFileHandlers.push(function(path) {
  // Trim the path to make sure there is no extra whitespace.
  path = path.trim();
  if (path in fileContentsCache) {
    return fileContentsCache[path];
  }

  var contents = null;
  if (!fs) {
    // Use SJAX if we are in the browser
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, false);
    xhr.send(null);
    var contents = null
    if (xhr.readyState === 4 && xhr.status === 200) {
      contents = xhr.responseText
    }
  } else if (fs.existsSync(path)) {
    // Otherwise, use the filesystem
    contents = fs.readFileSync(path, 'utf8');
  }

  return fileContentsCache[path] = contents;
});

// Support URLs relative to a directory, but be careful about a protocol prefix
// in case we are in the browser (i.e. directories may start with "http://")
function supportRelativeURL(file, url) {
  if (!file) return url;
  var dir = path.dirname(file);
  var match = /^\w+:\/\/[^\/]*/.exec(dir);
  var protocol = match ? match[0] : '';
  return protocol + path.resolve(dir.slice(protocol.length), url);
}

function retrieveSourceMapURL(source) {
  var fileData;

  if (isInBrowser()) {
     try {
       var xhr = new XMLHttpRequest();
       xhr.open('GET', source, false);
       xhr.send(null);
       fileData = xhr.readyState === 4 ? xhr.responseText : null;

       // Support providing a sourceMappingURL via the SourceMap header
       var sourceMapHeader = xhr.getResponseHeader("SourceMap") ||
                             xhr.getResponseHeader("X-SourceMap");
       if (sourceMapHeader) {
         return sourceMapHeader;
       }
     } catch (e) {
     }
  }

  // Get the URL of the source map
  fileData = retrieveFile(source);
  var re = /(?:\/\/[@#][ \t]+sourceMappingURL=([^\s'"]+?)[ \t]*$)|(?:\/\*[@#][ \t]+sourceMappingURL=([^\*]+?)[ \t]*(?:\*\/)[ \t]*$)/mg;
  // Keep executing the search to find the *last* sourceMappingURL to avoid
  // picking up sourceMappingURLs from comments, strings, etc.
  var lastMatch, match;
  while (match = re.exec(fileData)) lastMatch = match;
  if (!lastMatch) return null;
  return lastMatch[1];
};

// Can be overridden by the retrieveSourceMap option to install. Takes a
// generated source filename; returns a {map, optional url} object, or null if
// there is no source map.  The map field may be either a string or the parsed
// JSON object (ie, it must be a valid argument to the SourceMapConsumer
// constructor).
var retrieveSourceMap = handlerExec(retrieveMapHandlers);
retrieveMapHandlers.push(function(source) {
  var sourceMappingURL = retrieveSourceMapURL(source);
  if (!sourceMappingURL) return null;

  // Read the contents of the source map
  var sourceMapData;
  if (reSourceMap.test(sourceMappingURL)) {
    // Support source map URL as a data url
    var rawData = sourceMappingURL.slice(sourceMappingURL.indexOf(',') + 1);
    sourceMapData = new Buffer(rawData, "base64").toString();
    sourceMappingURL = source;
  } else {
    // Support source map URLs relative to the source URL
    sourceMappingURL = supportRelativeURL(source, sourceMappingURL);
    sourceMapData = retrieveFile(sourceMappingURL);
  }

  if (!sourceMapData) {
    return null;
  }

  return {
    url: sourceMappingURL,
    map: sourceMapData
  };
});

function mapSourcePosition(position) {
  var sourceMap = sourceMapCache[position.source];
  if (!sourceMap) {
    // Call the (overrideable) retrieveSourceMap function to get the source map.
    var urlAndMap = retrieveSourceMap(position.source);
    if (urlAndMap) {
      sourceMap = sourceMapCache[position.source] = {
        url: urlAndMap.url,
        map: new SourceMapConsumer(urlAndMap.map)
      };

      // Load all sources stored inline with the source map into the file cache
      // to pretend like they are already loaded. They may not exist on disk.
      if (sourceMap.map.sourcesContent) {
        sourceMap.map.sources.forEach(function(source, i) {
          var contents = sourceMap.map.sourcesContent[i];
          if (contents) {
            var url = supportRelativeURL(sourceMap.url, source);
            fileContentsCache[url] = contents;
          }
        });
      }
    } else {
      sourceMap = sourceMapCache[position.source] = {
        url: null,
        map: null
      };
    }
  }

  // Resolve the source URL relative to the URL of the source map
  if (sourceMap && sourceMap.map) {
    var originalPosition = sourceMap.map.originalPositionFor(position);

    // Only return the original position if a matching line was found. If no
    // matching line is found then we return position instead, which will cause
    // the stack trace to print the path and line for the compiled file. It is
    // better to give a precise location in the compiled file than a vague
    // location in the original file.
    if (originalPosition.source !== null) {
      originalPosition.source = supportRelativeURL(
        sourceMap.url, originalPosition.source);
      return originalPosition;
    }
  }

  return position;
}

// Parses code generated by FormatEvalOrigin(), a function inside V8:
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js
function mapEvalOrigin(origin) {
  // Most eval() calls are in this format
  var match = /^eval at ([^(]+) \((.+):(\d+):(\d+)\)$/.exec(origin);
  if (match) {
    var position = mapSourcePosition({
      source: match[2],
      line: +match[3],
      column: match[4] - 1
    });
    return 'eval at ' + match[1] + ' (' + position.source + ':' +
      position.line + ':' + (position.column + 1) + ')';
  }

  // Parse nested eval() calls using recursion
  match = /^eval at ([^(]+) \((.+)\)$/.exec(origin);
  if (match) {
    return 'eval at ' + match[1] + ' (' + mapEvalOrigin(match[2]) + ')';
  }

  // Make sure we still return useful information if we didn't find anything
  return origin;
}

// This is copied almost verbatim from the V8 source code at
// https://code.google.com/p/v8/source/browse/trunk/src/messages.js. The
// implementation of wrapCallSite() used to just forward to the actual source
// code of CallSite.prototype.toString but unfortunately a new release of V8
// did something to the prototype chain and broke the shim. The only fix I
// could find was copy/paste.
function CallSiteToString() {
  var fileName;
  var fileLocation = "";
  if (this.isNative()) {
    fileLocation = "native";
  } else {
    fileName = this.getScriptNameOrSourceURL();
    if (!fileName && this.isEval()) {
      fileLocation = this.getEvalOrigin();
      fileLocation += ", ";  // Expecting source position to follow.
    }

    if (fileName) {
      fileLocation += fileName;
    } else {
      // Source code does not originate from a file and is not native, but we
      // can still get the source position inside the source string, e.g. in
      // an eval string.
      fileLocation += "<anonymous>";
    }
    var lineNumber = this.getLineNumber();
    if (lineNumber != null) {
      fileLocation += ":" + lineNumber;
      var columnNumber = this.getColumnNumber();
      if (columnNumber) {
        fileLocation += ":" + columnNumber;
      }
    }
  }

  var line = "";
  var functionName = this.getFunctionName();
  var addSuffix = true;
  var isConstructor = this.isConstructor();
  var isMethodCall = !(this.isToplevel() || isConstructor);
  if (isMethodCall) {
    var typeName = this.getTypeName();
    // Fixes shim to be backward compatable with Node v0 to v4
    if (typeName === "[object Object]") {
      typeName = "null";
    }
    var methodName = this.getMethodName();
    if (functionName) {
      if (typeName && functionName.indexOf(typeName) != 0) {
        line += typeName + ".";
      }
      line += functionName;
      if (methodName && functionName.indexOf("." + methodName) != functionName.length - methodName.length - 1) {
        line += " [as " + methodName + "]";
      }
    } else {
      line += typeName + "." + (methodName || "<anonymous>");
    }
  } else if (isConstructor) {
    line += "new " + (functionName || "<anonymous>");
  } else if (functionName) {
    line += functionName;
  } else {
    line += fileLocation;
    addSuffix = false;
  }
  if (addSuffix) {
    line += " (" + fileLocation + ")";
  }
  return line;
}

function cloneCallSite(frame) {
  var object = {};
  Object.getOwnPropertyNames(Object.getPrototypeOf(frame)).forEach(function(name) {
    object[name] = /^(?:is|get)/.test(name) ? function() { return frame[name].call(frame); } : frame[name];
  });
  object.toString = CallSiteToString;
  return object;
}

function wrapCallSite(frame) {
  if(frame.isNative()) {
    return frame;
  }

  // Most call sites will return the source file from getFileName(), but code
  // passed to eval() ending in "//# sourceURL=..." will return the source file
  // from getScriptNameOrSourceURL() instead
  var source = frame.getFileName() || frame.getScriptNameOrSourceURL();
  if (source) {
    var line = frame.getLineNumber();
    var column = frame.getColumnNumber() - 1;

    // Fix position in Node where some (internal) code is prepended.
    // See https://github.com/evanw/node-source-map-support/issues/36
    if (line === 1 && !isInBrowser() && !frame.isEval()) {
      column -= 62;
    }

    var position = mapSourcePosition({
      source: source,
      line: line,
      column: column
    });
    frame = cloneCallSite(frame);
    frame.getFileName = function() { return position.source; };
    frame.getLineNumber = function() { return position.line; };
    frame.getColumnNumber = function() { return position.column + 1; };
    frame.getScriptNameOrSourceURL = function() { return position.source; };
    return frame;
  }

  // Code called using eval() needs special handling
  var origin = frame.isEval() && frame.getEvalOrigin();
  if (origin) {
    origin = mapEvalOrigin(origin);
    frame = cloneCallSite(frame);
    frame.getEvalOrigin = function() { return origin; };
    return frame;
  }

  // If we get here then we were unable to change the source position
  return frame;
}

// This function is part of the V8 stack trace API, for more info see:
// http://code.google.com/p/v8/wiki/JavaScriptStackTraceApi
function prepareStackTrace(error, stack) {
  if (emptyCacheBetweenOperations) {
    fileContentsCache = {};
    sourceMapCache = {};
  }

  return error + stack.map(function(frame) {
    return '\n    at ' + wrapCallSite(frame);
  }).join('');
}

// Generate position and snippet of original source with pointer
function getErrorSource(error) {
  var match = /\n    at [^(]+ \((.*):(\d+):(\d+)\)/.exec(error.stack);
  if (match) {
    var source = match[1];
    var line = +match[2];
    var column = +match[3];

    // Support the inline sourceContents inside the source map
    var contents = fileContentsCache[source];

    // Support files on disk
    if (!contents && fs && fs.existsSync(source)) {
      contents = fs.readFileSync(source, 'utf8');
    }

    // Format the line from the original source code like node does
    if (contents) {
      var code = contents.split(/(?:\r\n|\r|\n)/)[line - 1];
      if (code) {
        return source + ':' + line + '\n' + code + '\n' +
          new Array(column).join(' ') + '^';
      }
    }
  }
  return null;
}

function printErrorAndExit (error) {
  var source = getErrorSource(error);

  if (source) {
    console.error();
    console.error(source);
  }

  console.error(error.stack);
  process.exit(1);
}

function shimEmitUncaughtException () {
  var origEmit = process.emit;

  process.emit = function (type) {
    if (type === 'uncaughtException') {
      var hasStack = (arguments[1] && arguments[1].stack);
      var hasListeners = (this.listeners(type).length > 0);

      if (hasStack && !hasListeners) {
        return printErrorAndExit(arguments[1]);
      }
    }

    return origEmit.apply(this, arguments);
  };
}

exports.wrapCallSite = wrapCallSite;
exports.getErrorSource = getErrorSource;
exports.mapSourcePosition = mapSourcePosition;
exports.retrieveSourceMap = retrieveSourceMap;

exports.install = function(options) {
  options = options || {};

  if (options.environment) {
    environment = options.environment;
    if (["node", "browser", "auto"].indexOf(environment) === -1) {
      throw new Error("environment " + environment + " was unknown. Available options are {auto, browser, node}")
    }
  }

  // Allow sources to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveFile) {
    if (options.overrideRetrieveFile) {
      retrieveFileHandlers.length = 0;
    }

    retrieveFileHandlers.unshift(options.retrieveFile);
  }

  // Allow source maps to be found by methods other than reading the files
  // directly from disk.
  if (options.retrieveSourceMap) {
    if (options.overrideRetrieveSourceMap) {
      retrieveMapHandlers.length = 0;
    }

    retrieveMapHandlers.unshift(options.retrieveSourceMap);
  }

  // Support runtime transpilers that include inline source maps
  if (options.hookRequire && !isInBrowser()) {
    var Module;
    try {
      Module = __webpack_require__(20);
    } catch (err) {
      // NOP: Loading in catch block to convert webpack error to warning.
    }
    var $compile = Module.prototype._compile;

    if (!$compile.__sourceMapSupport) {
      Module.prototype._compile = function(content, filename) {
        fileContentsCache[filename] = content;
        sourceMapCache[filename] = undefined;
        return $compile.call(this, content, filename);
      };

      Module.prototype._compile.__sourceMapSupport = true;
    }
  }

  // Configure options
  if (!emptyCacheBetweenOperations) {
    emptyCacheBetweenOperations = 'emptyCacheBetweenOperations' in options ?
      options.emptyCacheBetweenOperations : false;
  }

  // Install the error reformatter
  if (!errorFormatterInstalled) {
    errorFormatterInstalled = true;
    Error.prepareStackTrace = prepareStackTrace;
  }

  if (!uncaughtShimInstalled) {
    var installHandler = 'handleUncaughtExceptions' in options ?
      options.handleUncaughtExceptions : true;

    // Provide the option to not install the uncaught exception handler. This is
    // to support other uncaught exception handlers (in test frameworks, for
    // example). If this handler is not installed and there are no other uncaught
    // exception handlers, uncaught exceptions will be caught by node's built-in
    // exception handler and the process will still be terminated. However, the
    // generated JavaScript code will be shown above the stack trace instead of
    // the original source code.
    if (installHandler && hasGlobalProcessEventEmitter()) {
      uncaughtShimInstalled = true;
      shimEmitUncaughtException();
    }
  }
};


/***/ }),
/* 19 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 20 */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),
/* 21 */
/***/ (function(module, exports) {

module.exports = require("source-map");

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.insert = exports.select = undefined;

var _select = __webpack_require__(31);

var _insert = __webpack_require__(30);

var _update = __webpack_require__(32);

exports.select = _select.select;
exports.insert = _insert.insert;
exports.update = _update.update; // CREATE TABLE course_user_is_learning (
//   id SERIAL PRIMARY KEY,

//   active BOOLEAN,

//   course_id INTEGER REFERENCES course (id) ON DELETE CASCADE,
//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
//   unique (course_id, user_id)
// );

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.destroy = exports.update = exports.select = exports.insert = undefined;

var _init = __webpack_require__(0);

var _insert = __webpack_require__(35);

var _select = __webpack_require__(36);

var update = function update(problem, problemId) {
  return _init.db.one("UPDATE problem SET content=${content} WHERE id=${id} RETURNING *", {
    content: problem.content,
    id: problemId
  });
};

var destroy = function destroy(id) {
  return _init.db.none('delete from problem where id=${id}', { id: id });
};

exports.insert = _insert.insert;
exports.select = _select.select;
exports.update = update;
exports.destroy = destroy;

/***/ }),
/* 24 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(10);

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

__webpack_require__(44);

var _allowCrossDomain = __webpack_require__(41);

var _stopPropagationForAssets = __webpack_require__(43);

var _bodyParser = __webpack_require__(45);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _static = __webpack_require__(42);

var _routes = __webpack_require__(29);

var _routes2 = __webpack_require__(37);

var _routes3 = __webpack_require__(33);

var _routes4 = __webpack_require__(34);

var _routes5 = __webpack_require__(28);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log('node env: ' + process.env.NODE_ENV);

// load environment variables.


var app = (0, _express2.default)();

app.use(_allowCrossDomain.allowCrossDomain);

app.use(_stopPropagationForAssets.stopPropagationForAssets);

app.use(_bodyParser2.default.json()); // to support JSON-encoded bodies

app.use(_static.staticAssets);

// routes

app.use('/api/courses', _routes.router);

app.use('/api/problems', _routes2.router);

app.use('/api/coursesUserIsLearning', _routes3.router);

// GET routes that return results for particular frontend page. something like what server-rendering would do.

app.use('/api/pages', _routes4.router);

app.use('/api/auth', _routes5.router);

app.get('*', function (request, response) {
  return response.send('\n    <!DOCTYPE html>\n    <html lang="en">\n    <head>\n      <title>Memcode</title>\n      <link rel="stylesheet" href="/styles.css">\n      <link href="/index.css" rel="stylesheet">\n      <!-- to verify google webmasters -->\n      <meta name="google-site-verification" content="Cv256pnTnFWM0T6qi3SXK1u1K-B6W7IJQ9JoOQ_1I_E" />\n      <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32" />\n      <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16" />\n    </head>\n    <body>\n      <div id="root"></div>\n      <script>\n        window.env = {\n          githubSignInLink: \'https://github.com/login/oauth/authorize?client_id=' + process.env['GITHUB_OAUTH_ID'] + '\'\n        };\n      </script>\n      <script type="text/javascript" src="/index.js"></script>\n    </html>\n    ');
});

// because express needs to see there are 4 arguments to treat :error as error.
// this middleware should also come last.
// eslint-disable-next-line no-unused-vars
app.use(function (error, req, res, next) {
  res.status(500).json({ error: error.message });
});

// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

app.listen(port, function (err) {
  err ? console.log('server start error: ' + err) : console.log('server is listening on port: ' + port);
});

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 27 */,
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = __webpack_require__(24);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _formData = __webpack_require__(46);

var _formData2 = _interopRequireDefault(_formData);

var _nodeFetch = __webpack_require__(47);

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _catchAsync = __webpack_require__(4);

var _model = __webpack_require__(9);

var User = _interopRequireWildcard(_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

// 1. after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
router.get('/github/callback', (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response) {
    var data, stringWithAccessToken, accessToken, accountReturnedFromGithub, existingUser, token, createdUser, _token;

    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            // getting access token by sending github authorization code that will prove to github that it's indeed
            // we are the application (client_id, client_secret) that user gave access to
            data = new _formData2.default();

            data.append('client_id', process.env['GITHUB_OAUTH_ID']);
            data.append('client_secret', process.env['GITHUB_OAUTH_SECRET']);
            data.append('code', request.query.code);

            // 'access_token=0bc4d5757978a90d8e9bc96fac795c876179f2ba&scope=&token_type=bearer'
            _context.next = 6;
            return (0, _nodeFetch2.default)('https://github.com/login/oauth/access_token', {
              method: 'POST',
              body: data
            }).then(function (res) {
              return res.ok ? res.text() : Promise.reject(res);
            });

          case 6:
            stringWithAccessToken = _context.sent;
            accessToken = stringWithAccessToken.split('access_token=')[1].split('&scope')[0];

            // fetching our profile info signed in as a user (access token)

            _context.next = 10;
            return (0, _nodeFetch2.default)('https://api.github.com/user', {
              headers: {
                Authorization: 'token ' + accessToken
              }
            }).then(function (res) {
              return res.json();
            });

          case 10:
            accountReturnedFromGithub = _context.sent;
            _context.next = 13;
            return User.select.oneByOauth('github', accountReturnedFromGithub.id);

          case 13:
            existingUser = _context.sent;

            if (!existingUser) {
              _context.next = 19;
              break;
            }

            // user with this github_id is already in our db! sign in.
            token = _jsonwebtoken2.default.sign(existingUser, process.env['JWT_SECRET']);

            redirectWithToken(response, token);
            _context.next = 24;
            break;

          case 19:
            _context.next = 21;
            return User.insert.createFromGithub(accountReturnedFromGithub);

          case 21:
            createdUser = _context.sent;
            _token = _jsonwebtoken2.default.sign(createdUser, process.env['JWT_SECRET']);

            redirectWithToken(response, _token);

          case 24:
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

// let's put token into header, so that we don't have to display the query string and the delete it
// nope, because turns out we can't see headers on initial page load
var redirectWithToken = function redirectWithToken(response, token) {
  return response.redirect('/?token=' + token);
};

exports.router = router;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(4);

var _authenticate = __webpack_require__(15);

var _model = __webpack_require__(5);

var Course = _interopRequireWildcard(_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.get('/', (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response) {
    var courses;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Course.select.all();

          case 2:
            courses = _context.sent;

            response.status(200).json(courses);

          case 4:
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

// => [{
//   course: {},
//   courseUserIsLearning: {},
//   amountOfProblemsToReview: 3
//   amountOfProblemsToLearn: 1
// }], active, filtered by amount of due problems
router.get('/allLearned', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response) {
    var res;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Course.select.allLearned(request.currentUser.id);

          case 2:
            res = _context2.sent;

            response.status(200).json(res);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));

router.get('/allCreated', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, response) {
    var res;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Course.select.allCreated(request.currentUser.id);

          case 2:
            res = _context3.sent;

            response.status(200).json(res);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));

// move to /pages
router.get('/:id', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(request, response) {
    var course;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Course.select.oneForActions(request.params.id, request.currentUser.id);

          case 2:
            course = _context4.sent;

            response.status(200).json(course);

          case 4:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()));

router.post('/', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(request, response) {
    var course;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Course.insert.create(request.body['course'], request.currentUser.id);

          case 2:
            course = _context5.sent;


            response.status(200).json(course);

          case 4:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}()));

router.put('/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref6 = _asyncToGenerator(regeneratorRuntime.mark(function _callee6(request, response) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return Course.update.update(request.params.id, request.body['course']);

          case 2:
            response.status(200).json({});

          case 3:
          case 'end':
            return _context6.stop();
        }
      }
    }, _callee6, undefined);
  }));

  return function (_x11, _x12) {
    return _ref6.apply(this, arguments);
  };
}()));

router.delete('/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref7 = _asyncToGenerator(regeneratorRuntime.mark(function _callee7(request, response) {
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return Course.ddelete.destroyCourseWithProblems(request.params.id);

          case 2:
            response.status(200).json({});

          case 3:
          case 'end':
            return _context7.stop();
        }
      }
    }, _callee7, undefined);
  }));

  return function (_x13, _x14) {
    return _ref7.apply(this, arguments);
  };
}()));

exports.router = router;

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var insert = {
  create: function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(courseId, userId) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt("return", _init.db.one("INSERT INTO course_user_is_learning \
      (active, course_id, user_id) VALUES \
      (true, ${courseId}, ${userId}) \
      RETURNING *", { courseId: courseId, userId: userId }));

            case 1:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function create(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()
};

exports.insert = insert;

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

var select = {
  oneByCourseIdAndUserId: function oneByCourseIdAndUserId(courseId, userId) {
    return _init.db.one('\n        SELECT *\n        FROM course_user_is_learning\n        WHERE course_id = ${courseId} AND user_id = ${userId}\n      ', { courseId: courseId, userId: userId });
  },

  problemsToLearn: function problemsToLearn(id) {
    return _init.db.any('\n      SELECT *\n      FROM problem\n      WHERE problem.id NOT IN (\n        SELECT problem_user_is_learning.problem_id\n        FROM problem_user_is_learning\n        WHERE problem_user_is_learning.course_user_is_learning_id = ${id}\n      )\n      AND problem.course_id = (\n        SELECT course_user_is_learning.course_id\n        FROM course_user_is_learning\n        WHERE course_user_is_learning.id = ${id}\n      )\n      ', { id: id });
  },

  problemsToReview: function problemsToReview(id) {
    return _init.db.any('\n      SELECT *\n      FROM problem\n      WHERE problem.id IN (\n        SELECT problem_user_is_learning.problem_id\n        FROM problem_user_is_learning\n        WHERE (\n          problem_user_is_learning.course_user_is_learning_id = ${id}\n          AND\n          problem_user_is_learning.next_due_date < timezone(\'UTC\', now())\n        )\n      )\n      ', { id: id });
  }
};

exports.select = select;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = undefined;

var _init = __webpack_require__(0);

var update = {
  ifActive: function ifActive(id, _ifActive) {
    return _init.db.one("UPDATE course_user_is_learning \
      SET active = ${active} \
      WHERE id = ${id} \
      RETURNING *", { active: _ifActive, id: id });
  }
};

exports.update = update;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(4);

var _authenticate = __webpack_require__(15);

var _model = __webpack_require__(22);

var CourseUserIsLearning = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(38);

var ProblemUserIsLearning = _interopRequireWildcard(_model2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.post('/', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response) {
    var courseUserIsLearning;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return CourseUserIsLearning.insert.create(request.body['courseId'], request.currentUser.id);

          case 2:
            courseUserIsLearning = _context.sent;

            response.status(200).json(courseUserIsLearning);

          case 4:
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

router.put('/:id/resumeLearning', (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response) {
    var courseUserIsLearning;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return CourseUserIsLearning.update.ifActive(request.params['id'], true);

          case 2:
            courseUserIsLearning = _context2.sent;

            response.status(200).json(courseUserIsLearning);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));

router.put('/:id/stopLearning', (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, response) {
    var courseUserIsLearning;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return CourseUserIsLearning.update.ifActive(request.params['id'], false);

          case 2:
            courseUserIsLearning = _context3.sent;

            response.status(200).json(courseUserIsLearning);

          case 4:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));

router.put('/:id/problems/:problemId/review', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(request, response) {
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return ProblemUserIsLearning.update.review(request.params['id'], request.params['problemId'], request.body['performanceRating']);

          case 2:
            response.status(200).json({});

          case 3:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()));

// needs courseUserIsLearningId, problemId
router.post('/:id/problems/:problemId/learn', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref5 = _asyncToGenerator(regeneratorRuntime.mark(function _callee5(request, response) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return ProblemUserIsLearning.insert.create(request.params['id'], request.params['problemId']);

          case 2:
            response.status(200).json({});

          case 3:
          case 'end':
            return _context5.stop();
        }
      }
    }, _callee5, undefined);
  }));

  return function (_x9, _x10) {
    return _ref5.apply(this, arguments);
  };
}()));

exports.router = router;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(4);

var _authenticate = __webpack_require__(15);

var _model = __webpack_require__(22);

var CourseUserIsLearning = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(5);

var Course = _interopRequireWildcard(_model2);

var _model3 = __webpack_require__(23);

var Problem = _interopRequireWildcard(_model3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // we are putting all per-page get routes here, because they don't really tend to belong to certain components.
// for the single page we may want to fetch may things, for example: course, courseUserIsLearning, and problems.
// we will only want GET routes here, as deletes and updates tend to only concern one component at a time.


var router = _express2.default.Router();

router.get('/courses/:id/learn', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response) {
    var courseId, courseUserIsLearning, problems;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            courseId = request.params['id'];
            _context.next = 3;
            return CourseUserIsLearning.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);

          case 3:
            courseUserIsLearning = _context.sent;
            _context.next = 6;
            return CourseUserIsLearning.select.problemsToLearn(courseUserIsLearning.id);

          case 6:
            problems = _context.sent;


            response.status(200).json({ courseUserIsLearning: courseUserIsLearning, problems: problems });

          case 8:
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

router.get('/courses/:id/review', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response) {
    var courseId, courseUserIsLearning, problems;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            courseId = request.params['id'];
            _context2.next = 3;
            return CourseUserIsLearning.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);

          case 3:
            courseUserIsLearning = _context2.sent;
            _context2.next = 6;
            return CourseUserIsLearning.select.problemsToReview(courseUserIsLearning.id);

          case 6:
            problems = _context2.sent;


            response.status(200).json({ courseUserIsLearning: courseUserIsLearning, problems: problems });

          case 8:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));

router.get('/courses/:id/edit', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, response) {
    var courseId, course, problems;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            courseId = request.params['id'];
            _context3.next = 3;
            return Course.select.oneById(courseId);

          case 3:
            course = _context3.sent;
            _context3.next = 6;
            return Problem.select.allByCourseId(courseId);

          case 6:
            problems = _context3.sent;


            response.status(200).json({ course: course, problems: problems });

          case 8:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));

router.get('/courses/:id', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref4 = _asyncToGenerator(regeneratorRuntime.mark(function _callee4(request, response) {
    var courseId, course, problems;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            courseId = request.params['id'];
            _context4.next = 3;
            return Course.select.oneById(courseId);

          case 3:
            course = _context4.sent;
            _context4.next = 6;
            return Problem.select.allByCourseId(courseId);

          case 6:
            problems = _context4.sent;


            response.status(200).json({ course: course, problems: problems });

          case 8:
          case 'end':
            return _context4.stop();
        }
      }
    }, _callee4, undefined);
  }));

  return function (_x7, _x8) {
    return _ref4.apply(this, arguments);
  };
}()));

exports.router = router;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

var insert = {
  // we don't need to create problem_user_is_learning for every user who learns this course, because problem_user_is_learning is only for already learnt problems
  create: function create(problem) {
    return _init.db.one("INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, ${created_at}) RETURNING *", {
      type: problem.type,
      content: problem.content,
      courseId: problem.courseId,
      created_at: new Date()
    });
  }
};

exports.insert = insert;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

var select = {
  allByCourseId: function allByCourseId(courseId) {
    return _init.db.any('SELECT * FROM problem WHERE course_id = ${courseId} ORDER BY created_at', { courseId: courseId });
  }
};

exports.select = select;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(4);

var _model = __webpack_require__(23);

var Problem = _interopRequireWildcard(_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.post('/', (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response) {
    var createdProblem;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return Problem.insert.create(request.body['problem']);

          case 2:
            createdProblem = _context.sent;

            response.status(200).json(createdProblem);

          case 4:
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

router.put('/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(request, response) {
    var updatedProblem;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Problem.update(request.body['problem'], request.params['id']);

          case 2:
            updatedProblem = _context2.sent;

            response.status(200).json(updatedProblem);

          case 4:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x3, _x4) {
    return _ref2.apply(this, arguments);
  };
}()));

router.delete('/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator(regeneratorRuntime.mark(function _callee3(request, response) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Problem.destroy(request.params['id']);

          case 2:
            response.status(200).json({});

          case 3:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x5, _x6) {
    return _ref3.apply(this, arguments);
  };
}()));

exports.router = router;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.insert = undefined;

var _init = __webpack_require__(0);

var _initialScore = __webpack_require__(8);

var _getNextScore = __webpack_require__(7);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; } // CREATE TABLE problem_user_is_learning (
//   id SERIAL PRIMARY KEY,
//
//   is_learned BOOLEAN,
//
//   easiness SMALLINT, [A number ≥ 1.3 representing how easy the item is, with 1.3 being the hardest.  Defaults to 2.5]
//
//   consecutive_correct_answers SMALLINT, [How many times in a row the user has correctly answered this item]
//
//   nextDueDate TIMESTAMP, [The next time this item needs to be reviewed]
//
//   problem_id INTEGER REFERENCES problem (id) ON DELETE CASCADE,
//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE,
//   unique (problem_id, user_id)
// );


var select = {
  findByCuilIdAndProblemId: function () {
    var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(cuilId, problemId) {
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              return _context.abrupt('return', _init.db.one('SELECT * FROM problem_user_is_learning\n      WHERE course_user_is_learning_id = ${cuilId} AND problem_id = ${problemId}', { cuilId: cuilId, problemId: problemId }));

            case 1:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function findByCuilIdAndProblemId(_x, _x2) {
      return _ref.apply(this, arguments);
    };
  }()
};

var update = {
  // solve particular problem
  // performanceRating: 0-5
  review: function () {
    var _ref2 = _asyncToGenerator(regeneratorRuntime.mark(function _callee2(courseUserIsLearningId, problemId, performanceRating) {
      var me, nextScore;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return select.findByCuilIdAndProblemId(courseUserIsLearningId, problemId);

            case 2:
              me = _context2.sent;


              // was easiness was NAN once?
              console.log('________________________');
              console.log({ me: me });
              console.log('__________________________');
              nextScore = (0, _getNextScore.getNextScore)(me.easiness, me.consecutiveCorrectAnswers, performanceRating);

              console.log({ nextScore: nextScore });
              console.log('__________________');

              return _context2.abrupt('return', _init.db.one('\n      UPDATE problem_user_is_learning\n      SET easiness = ${easiness},\n          consecutive_correct_answers = ${consecutiveCorrectAnswers},\n          next_due_date = timezone(\'UTC\', (now() + \'' + nextScore.daysToNextReview + ' days\'::INTERVAL))\n      WHERE id = ${id}\n      RETURNING *\n      ', {
                easiness: nextScore.easiness,
                consecutiveCorrectAnswers: nextScore.consecutiveCorrectAnswers,
                id: me.id
              }));

            case 10:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function review(_x3, _x4, _x5) {
      return _ref2.apply(this, arguments);
    };
  }()
};

var insert = {
  create: function create(courseUserIsLearningId, problemId) {
    return _init.db.one('\n      INSERT INTO problem_user_is_learning\n      (easiness, consecutive_correct_answers, next_due_date, course_user_is_learning_id, problem_id) VALUES\n      (${easiness}, ${consecutiveCorrectAnswers}, timezone(\'UTC\', now()), ${courseUserIsLearningId}, ${problemId})\n      RETURNING *\n      ', {
      easiness: (0, _initialScore.initialScore)().easiness,
      consecutiveCorrectAnswers: (0, _initialScore.initialScore)().consecutiveCorrectAnswers,
      courseUserIsLearningId: courseUserIsLearningId,
      problemId: problemId
    });
  }
};

exports.insert = insert;
exports.update = update;

/***/ }),
/* 39 */,
/* 40 */,
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var allowCrossDomain = function allowCrossDomain(req, res, next) {
  res.status(200);
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
};

exports.allowCrossDomain = allowCrossDomain;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.staticAssets = undefined;

var _express = __webpack_require__(1);

var _express2 = _interopRequireDefault(_express);

var _path = __webpack_require__(6);

var _path2 = _interopRequireDefault(_path);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// (global routes, because path.join didn't work after update to webpacked ES6)
// serves index.js, index.css.
var staticAssets = _express2.default.static(_path2.default.join(__dirname, '../..', '/frontend/webpacked'));

exports.staticAssets = staticAssets;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// https://github.com/jaredhanson/passport/issues/14#issuecomment-21863553
var stopPropagationForAssets = function stopPropagationForAssets(req, res, next) {
  if (req.url !== '/favicon.ico' && req.url !== '/styles.css') {
    return next();
  } else {
    res.status(200);
    res.header('Cache-Control', 'max-age=4294880896');
    res.end();
  }
};

exports.stopPropagationForAssets = stopPropagationForAssets;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// When you require('env.js') because this isn’t wrapped in a module.exports (on purpose), the code is literally executed and thus the variables are added to your environment
// http://thewebivore.com/super-simple-environment-variables-node-js/

// to change them, go to https://github.com/settings/applications/505783.
process.env['GITHUB_OAUTH_ID'] = "b4f6fd40a2b6401dc1b2";
process.env['GITHUB_OAUTH_SECRET'] = "016cdc9ce2711937c92921f606965d09de545ad0";
process.env['JWT_SECRET'] = 'lamlalamkflre';

// postgres db
// 0245328cb03fe9c577709aca77614b1743e9735fa510fecbd98bf4c3ef9f0afa

/***/ }),
/* 45 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 46 */
/***/ (function(module, exports) {

module.exports = require("form-data");

/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(26);
module.exports = __webpack_require__(25);


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map