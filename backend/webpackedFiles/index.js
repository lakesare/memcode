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
/******/ 	return __webpack_require__(__webpack_require__.s = 82);
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

var _pgPromise = __webpack_require__(4);

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
    // const cyan = "\x1b[36m%s\x1b[0m";
    // console.log(cyan, e.query); // log the query being executed
  },
  // https://coderwall.com/p/irklcq
  receive: function receive(data) {
    camelizeColumns(data);
  },
  // disable warnings for tests,
  // because it was complaining a lot about duplicated connection
  noWarnings: process.env.NODE_ENV === 'test'
};

var getConnectionString = function getConnectionString() {
  switch (process.env.NODE_ENV) {
    // pgweb: postgres://postgres:§1§1§1@localhost:5432/memcode
    case 'development':
      return {
        host: 'localhost', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'memcode',
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD']
      };
    case 'test':
      return {
        host: 'localhost', // 'localhost' is the default;
        port: 5432, // 5432 is the default;
        database: 'memcode_test',
        user: process.env['DB_USER'],
        password: process.env['DB_PASSWORD']
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
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
// const b = requireKeys(
//   ['userId', 'title'], // what to validate
//   (args) => {
//     console.log('creating a comment with title=' + args.title);
//   }
// )

// b({ userId: 'wow' })
var requireKeys = function requireKeys(requiredKeys, functionBeingValidated) {
  return function (realArgs) {
    requiredKeys.forEach(function (key) {
      if (realArgs[key] === undefined) {
        throw new Error(key + " is required in function, but is undefined");
      }
    });

    return functionBeingValidated(realArgs);
  };
};

exports.requireKeys = requireKeys;

/***/ }),
/* 2 */
/***/ (function(module, exports) {

module.exports = require("express");

/***/ }),
/* 3 */
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
/* 4 */
/***/ (function(module, exports) {

module.exports = require("pg-promise");

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.insert = exports.select = undefined;

var _select = __webpack_require__(29);

var _insert = __webpack_require__(28);

var _update = __webpack_require__(30);

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
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.camelizeDbColumns = undefined;

var _pgPromise = __webpack_require__(4);

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
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ddelete = exports.update = exports.insert = exports.select = undefined;

var _select = __webpack_require__(19);

var _insert = __webpack_require__(18);

var _update = __webpack_require__(21);

var _ddelete = __webpack_require__(17);

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
/* 8 */,
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ddelete = exports.update = exports.insert = exports.select = undefined;

var _select = __webpack_require__(13);

var _update = __webpack_require__(36);

var _insert = __webpack_require__(35);

var _ddelete = __webpack_require__(34);

exports.select = _select.select;
exports.insert = _insert.insert;
exports.update = _update.update;
exports.ddelete = _ddelete.ddelete;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = exports.select = exports.insert = undefined;

var _insert = __webpack_require__(22);

var _update = __webpack_require__(24);

var _select = __webpack_require__(23);

exports.insert = _insert.insert;
exports.select = _select.select;
exports.update = _update.update;

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var wherePublic = "\n  course.if_public = true\n    AND\n  (\n    SELECT COUNT(problem.id) FROM problem WHERE problem.course_id = course.id\n  ) >= 2\n";

exports.default = wherePublic;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ddelete = exports.update = exports.select = exports.insert = undefined;

var _init = __webpack_require__(0);

var _insert = __webpack_require__(32);

var _select = __webpack_require__(33);

var _ddelete = __webpack_require__(31);

var update = function update(problem, problemId) {
  return _init.db.one("UPDATE problem SET content=${content} WHERE id=${id} RETURNING *", {
    content: problem.content,
    id: problemId
  });
};

exports.insert = _insert.insert;
exports.select = _select.select;
exports.update = update;
exports.ddelete = _ddelete.ddelete;

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

var select = {
  allByCuilId: function allByCuilId(cuilId) {
    return _init.db.any('\n      SELECT *\n      FROM problem_user_is_learning\n      WHERE\n        problem_user_is_learning.course_user_is_learning_id = ${cuilId}\n      ', { cuilId: cuilId });
  },

  findByCuilIdAndProblemId: function findByCuilIdAndProblemId(cuilId, problemId) {
    return _init.db.one('SELECT * FROM problem_user_is_learning\n      WHERE course_user_is_learning_id = ${cuilId} AND problem_id = ${problemId}', { cuilId: cuilId, problemId: problemId });
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
/* 15 */
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
//
// http://making.duolingo.com/how-we-learn-how-you-learn - what duolingo uses, may be interesting.

// performanceRating: on a scale from 0-5 (0=worst, 5=best)
// 0.28
var getNextScore = function getNextScore(prevEasiness, prevConsecutiveCorrectAnswers, performanceRating) {
  var nextEasiness = clipEasiness(prevEasiness + -0.8 + 0.28 * performanceRating + -0.02 * Math.pow(performanceRating, 2));

  var nextConsecutiveCorrectAnswers = isAnswerCorrect(performanceRating) ? prevConsecutiveCorrectAnswers + 1 : 0;

  var daysToNextReview = clipDaysToNextReview(isAnswerCorrect(performanceRating) ?
  // 6 * (nextEasiness ** (nextConsecutiveCorrectAnswers - 1)) :
  0.2 + 0.2 * (Math.pow(nextEasiness, 2.2) * Math.pow(nextConsecutiveCorrectAnswers - 1, 2.2)) : 0.2 // otherwise review it in 4 hours
  );

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
/* 16 */
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
/* 17 */
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
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

var insert = {
  create: function create(course) {
    return _init.db.one("INSERT INTO course (title, description, if_public, course_category_id, user_id, created_at) \
      VALUES (${title}, ${description}, ${ifPublic}, ${courseCategoryId}, ${userId}, timezone('UTC', now())) RETURNING *", {
      title: course.title,
      description: course.description,
      ifPublic: course.ifPublic,
      courseCategoryId: course.courseCategoryId || null,
      userId: course.userId
    });
  }
};

exports.insert = insert;

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

var _camelizeDbColumns = __webpack_require__(6);

var _wherePublic = __webpack_require__(11);

var _wherePublic2 = _interopRequireDefault(_wherePublic);

var _getCoursesWithStats = __webpack_require__(20);

var _getCoursesWithStats2 = _interopRequireDefault(_getCoursesWithStats);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var select = {
  allCreated: function allCreated(userId) {
    return (0, _getCoursesWithStats2.default)({
      where: 'WHERE course.user_id = ${userId}',
      params: { userId: userId }
    });
  },

  // for /profile. returns all courses userId is currently learning.
  // only active,
  // filtered by amount of due problems (TODO)
  allLearned: function allLearned(userId) {
    return (0, _getCoursesWithStats2.default)({
      where: ' WHERE course_user_is_learning.user_id = ${userId} AND course_user_is_learning.active = true',
      orderBy: '\n        ORDER BY\n          amount_of_problems_to_review DESC,\n          amount_of_problems_to_learn DESC,\n          next_due_date_in ASC\n      ',
      params: { userId: userId }
    });
  },

  // all public courses with 2 or more problems,
  // sorted by amount of learners
  // @sortBy = ['popular', 'new']
  allPublic: function allPublic(_ref) {
    var sortBy = _ref.sortBy,
        limit = _ref.limit,
        offset = _ref.offset,
        courseCategoryId = _ref.courseCategoryId;
    return _init.db.any('\n      SELECT\n        row_to_json(course.*) AS course,\n        COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course,\n        COUNT(distinct problem.id) AS amount_of_problems\n      FROM course\n      LEFT OUTER JOIN course_user_is_learning\n        ON (\n          course_user_is_learning.active = true\n          AND\n          course.id = course_user_is_learning.course_id\n        )\n      INNER JOIN problem\n        ON problem.course_id = course.id\n      WHERE\n        ' + _wherePublic2.default + '\n        ' + (courseCategoryId ? 'AND course.course_category_id = ' + courseCategoryId : '') + '\n      GROUP BY course.id\n      ' + (sortBy === 'popular' ? '\n          ORDER BY\n            amount_of_users_learning_this_course DESC,\n            amount_of_problems DESC\n          ' : 'ORDER BY course.created_at DESC') + '\n      LIMIT ' + limit + '\n      OFFSET ' + offset + '\n      ').then(function (array) {
      return (0, _camelizeDbColumns.camelizeDbColumns)(array, ['course']);
    });
  },

  countAllPublic: function countAllPublic(_ref2) {
    var courseCategoryId = _ref2.courseCategoryId;
    return _init.db.one('\n      SELECT\n        COUNT(course.id) as amount_of_public_courses\n      FROM course\n      WHERE\n        ' + _wherePublic2.default + '\n        ' + (courseCategoryId ? 'AND course.course_category_id = ' + courseCategoryId : '') + '\n      ').then(function (result) {
      return result.amountOfPublicCourses;
    });
  },

  oneForActions: function oneForActions(id, userId) {
    return (0, _getCoursesWithStats2.default)({
      where: 'WHERE course.id = ${courseId}',
      params: { userId: userId, courseId: id }
    }).then(function (array) {
      return array[0];
    });
  },

  getCourseStats: function getCourseStats(id) {
    return _init.db.one('\n      SELECT\n        COUNT(distinct course_user_is_learning.user_id) AS amount_of_users_learning_this_course,\n        COUNT(distinct problem.id) AS amount_of_problems\n      FROM course\n      LEFT JOIN course_user_is_learning\n        ON (\n          course_user_is_learning.active = true\n          AND\n          course.id = course_user_is_learning.course_id\n        )\n      LEFT JOIN problem\n        ON problem.course_id = course.id\n      WHERE course.id = ${id}\n      GROUP BY course.id\n      ', { id: id });
  },

  oneById: function oneById(id) {
    return _init.db.one('\n      SELECT *\n      FROM course\n      WHERE course.id = ${id}\n      ', { id: id });
  },

  search: function search(userId, searchString) {
    return (0, _getCoursesWithStats2.default)({
      where: '\n        WHERE\n          (\n            course.title ILIKE ${searchString} OR\n            course.description ILIKE ${searchString}\n          )\n            AND\n          ( -- either public or created by me\n            course.user_id = ${userId} OR\n            ' + _wherePublic2.default + '\n          )\n      ',
      orderBy: '\n        ORDER BY\n          -- if matches by description instead of by title - place last\n          CASE\n            WHEN course.title ILIKE ${searchString}\n            THEN 1 ELSE 0\n          END DESC,\n          CASE\n            WHEN course_user_is_learning.active = true\n            THEN 1 ELSE 0\n          END DESC,\n          CASE\n            WHEN course_user_is_learning.user_id = ${userId}\n            THEN 1 ELSE 0\n          END DESC,\n          CASE\n            WHEN course.user_id = ${userId}\n            THEN 1 ELSE 0\n          END DESC,\n          amount_of_problems_to_review DESC,\n          amount_of_problems_to_learn DESC,\n          next_due_date_in ASC\n        LIMIT 10\n      ',
      params: { userId: userId, searchString: '%' + searchString + '%' }
    });
  }
};

exports.select = select;

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = __webpack_require__(0);

var _integerizeDbColumns = __webpack_require__(14);

var _camelizeDbColumns = __webpack_require__(6);

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
var getCoursesWithStats = function getCoursesWithStats() {
  var _ref = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
      _ref$where = _ref.where,
      where = _ref$where === undefined ? '' : _ref$where,
      _ref$orderBy = _ref.orderBy,
      orderBy = _ref$orderBy === undefined ? '' : _ref$orderBy,
      _ref$params = _ref.params,
      params = _ref$params === undefined ? {} : _ref$params;

  return _init.db.any('SELECT\n      row_to_json(course.*)                  AS course,\n      row_to_json(course_user_is_learning.*) AS course_user_is_learning,\n      COUNT(distinct problem_user_is_learning.id) AS amount_of_problems_to_review,\n      (\n        (SELECT COUNT(problem.*) FROM problem WHERE problem.course_id = course.id) -\n        (SELECT COUNT(problem_user_is_learning.*) FROM problem_user_is_learning WHERE problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id)\n      )                                      AS amount_of_problems_to_learn,\n      COUNT(distinct problem.id)             AS amount_of_problems,\n      (\n        (\n          SELECT MIN(problem_user_is_learning.next_due_date)\n          FROM problem_user_is_learning\n          WHERE\n            (\n              problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id\n                AND\n              problem_user_is_learning.if_ignored = false\n            )\n        )\n          -\n        timezone(\'UTC\', now())\n      )                                      AS next_due_date_in\n\n    FROM course\n\n    -- course_user_is_learning\n    LEFT OUTER JOIN course_user_is_learning\n      ON (\n        course_user_is_learning.course_id = course.id\n        AND\n        course_user_is_learning.user_id = ${userId}\n      )\n\n    -- amount_of_problems_to_review\n    LEFT OUTER JOIN problem_user_is_learning\n      ON (\n        course_user_is_learning.id = problem_user_is_learning.course_user_is_learning_id\n        AND\n        problem_user_is_learning.next_due_date < timezone(\'UTC\', now())\n        AND\n        problem_user_is_learning.if_ignored = false\n      )\n\n    -- amount_of_problems\n    LEFT OUTER JOIN problem ON problem.course_id = course.id\n\n    ' + where + '\n\n    GROUP BY course_user_is_learning.id, course.id\n\n    ' + orderBy + '\n    ', params).then(function (array) {
    return (0, _camelizeDbColumns.camelizeDbColumns)(array, ['course', 'courseUserIsLearning']);
  }).then(function (array) {
    return (0, _integerizeDbColumns.integerizeDbColumns)(array, ['amountOfProblemsToReview', 'amountOfProblemsToLearn', 'amountOfProblems']);
  });
};

exports.default = getCoursesWithStats;

/***/ }),
/* 21 */
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
    return _init.db.one('\n      UPDATE course\n      SET\n        title = ${title},\n        description = ${description},\n        if_public = ${ifPublic},\n        course_category_id = ${courseCategoryId}\n      WHERE id = ${id}\n      RETURNING *\n      ', _extends({}, values, {
      id: id
    }));
  }
};

exports.update = update;

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

var _requireKeys = __webpack_require__(1);

var insert = {
  createFrom: function createFrom(oauthProvider, oauthProfile) {
    switch (oauthProvider) {
      case 'github':
        return insert.create({
          oauthProvider: 'github',
          oauthId: oauthProfile.id.toString(),
          username: oauthProfile.login,
          avatarUrl: oauthProfile.avatar_url,
          email: oauthProfile.email
        });
      case 'google':
        return insert.create({
          oauthProvider: 'google',
          oauthId: oauthProfile.id.toString(),
          username: oauthProfile.name,
          avatarUrl: oauthProfile.picture,
          email: oauthProfile.email
        });
      default:
        throw new Error('No such oauthProvider as \'' + oauthProvider + '\'.');
    }
  },

  create: (0, _requireKeys.requireKeys)(['oauthProvider', 'oauthId', 'username', 'avatarUrl', 'email'], function (user) {
    return _init.db.one('\n        INSERT INTO "user"\n          (\n            oauth_provider, oauth_id,\n            username, avatar_url, email,\n            created_at\n          )\n        VALUES\n          (\n            ${oauthProvider}, ${oauthId},\n            ${username}, ${avatarUrl}, ${email},\n            timezone(\'UTC\', now())\n          )\n        RETURNING *\n        ', {
      oauthProvider: user.oauthProvider,
      oauthId: user.oauthId,
      username: user.username,
      avatarUrl: user.avatarUrl,
      email: user.email
    });
  })
};

exports.insert = insert;

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

var select = {
  // getUserByOauth('github', 7578559)
  // => user
  oneByOauth: function oneByOauth(oauthProvider, oauthId) {
    return _init.db.oneOrNone('SELECT * FROM "user" WHERE oauth_provider=${oauthProvider} and oauth_id=${oauthId}', {
      oauthProvider: oauthProvider,
      oauthId: oauthId.toString()
    });
  },

  one: function one(id) {
    return _init.db.one('SELECT * FROM "user" WHERE id = ${id}', { id: id });
  }
};

exports.select = select;

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = undefined;

var _init = __webpack_require__(0);

var update = {
  update: function update(id, email) {
    return _init.db.one('\n        UPDATE "user"\n        SET email = ${email}\n        WHERE id = ${id}\n        RETURNING *\n      ', { id: id, email: email });
  }
};

exports.update = update;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.optionalAuthenticateMiddleware = exports.authenticateMiddleware = undefined;

var _jsonwebtoken = __webpack_require__(37);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _handleErrors = __webpack_require__(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// make request.currentUser available
// request.currentUser.oauthId,
// request.currentUser.oauthProvider
var authenticateMiddleware = function authenticateMiddleware(request, response, next) {
  if (request.headers['authorization']) {
    var token = request.headers['authorization'].split('Bearer ')[1];
    _jsonwebtoken2.default.verify(token, process.env['JWT_SECRET'], function (error, user) {
      if (error) {
        (0, _handleErrors.handleErrors)(error, request, response);
      } else {
        request.currentUser = user;
        next();
      }
    });
  } else {
    (0, _handleErrors.handleErrors)(new Error("No authorization header provided"), request, response);
  }
};

var optionalAuthenticateMiddleware = function optionalAuthenticateMiddleware(request, response, next) {
  if (request.headers['authorization']) {
    var token = request.headers['authorization'].split('Bearer ')[1];
    _jsonwebtoken2.default.verify(token, process.env['JWT_SECRET'], function (error, user) {
      if (!error) request.currentUser = user;
      next();
    });
  } else {
    next();
  }
};

exports.authenticateMiddleware = authenticateMiddleware;
exports.optionalAuthenticateMiddleware = optionalAuthenticateMiddleware;

/***/ }),
/* 26 */
/***/ (function(module, exports) {

module.exports = require("node-fetch");

/***/ }),
/* 27 */
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

var _requireKeys = __webpack_require__(1);

var insert = {
  create: (0, _requireKeys.requireKeys)(['active', 'courseId', 'userId'], function (cuilFields) {
    return _init.db.one('INSERT INTO course_user_is_learning\n        (active, course_id, user_id, started_learning_at) VALUES\n        (${active}, ${courseId}, ${userId}, timezone(\'UTC\', now()))\n        RETURNING *', cuilFields);
  })
};

exports.insert = insert;

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var select = {
  oneByCourseIdAndUserId: function oneByCourseIdAndUserId(courseId, userId) {
    return _init.db.one('\n        SELECT *\n        FROM course_user_is_learning\n        WHERE course_id = ${courseId} AND user_id = ${userId}\n      ', { courseId: courseId, userId: userId });
  },

  problemsToReview: function problemsToReview(id) {
    return _init.db.any('\n      SELECT *\n      FROM problem\n      WHERE problem.id IN (\n        SELECT problem_user_is_learning.problem_id\n        FROM problem_user_is_learning\n        WHERE (\n            problem_user_is_learning.course_user_is_learning_id = ${id}\n          AND\n            problem_user_is_learning.next_due_date < timezone(\'UTC\', now())\n          AND\n            problem_user_is_learning.if_ignored = false\n        )\n      )\n      ', { id: id });
  },

  // {
  //   1: {
  //     toLearn: [1, 3, 4],
  //     toReview: [5]
  //   },
  //   43: {
  //     toLearn: [],
  //     toReview: [2]
  //   }
  // }
  idsOfProblemsToLearnAndReviewPerCourse: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(userId) {
      var toReview, toLearn, toLearnToReviewResponse;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _init.db.any('\n      SELECT\n        course.id AS id,\n        COALESCE(json_agg(problem_user_is_learning.problem_id) FILTER (WHERE problem_user_is_learning.problem_id IS NOT NULL), \'[]\') AS to_review\n\n      FROM course_user_is_learning\n\n      INNER JOIN course\n        ON course_user_is_learning.course_id = course.id\n\n      LEFT JOIN problem_user_is_learning\n        ON (\n            problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id\n          AND\n            problem_user_is_learning.next_due_date < timezone(\'UTC\', now())\n          AND\n            problem_user_is_learning.if_ignored = false\n        )\n\n      WHERE\n          course_user_is_learning.user_id = ${userId}\n        AND\n          course_user_is_learning.active = true\n      GROUP BY course.id\n      ', { userId: userId });

            case 2:
              toReview = _context.sent;
              _context.next = 5;
              return _init.db.any('\n      SELECT\n        course.id AS id,\n        COALESCE(json_agg(problem.id) FILTER (WHERE problem.id IS NOT NULL), \'[]\') AS to_learn\n\n      FROM course_user_is_learning\n\n      INNER JOIN course\n        ON course_user_is_learning.course_id = course.id\n\n      LEFT JOIN problem\n        ON problem.course_id = course.id\n\n      WHERE\n          course_user_is_learning.user_id = ${userId}\n        AND\n          course_user_is_learning.active = true\n        AND\n          -- problems in this course\n          problem.id\n          NOT IN\n          -- minus problems user is already learning\n          (\n            SELECT problem_user_is_learning.problem_id\n            FROM problem_user_is_learning\n            WHERE problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id\n          )\n      GROUP BY course.id\n      ', { userId: userId });

            case 5:
              toLearn = _context.sent;
              toLearnToReviewResponse = {};

              toReview.forEach(function (toReviewResponse) {
                var correspondingToLearnResponse = toLearn.find(function (toLearnResponse) {
                  return toLearnResponse.id === toReviewResponse.id;
                });

                toLearnToReviewResponse[toReviewResponse.id] = {
                  toReview: toReviewResponse.toReview,
                  toLearn: correspondingToLearnResponse ? correspondingToLearnResponse.toLearn : []
                };
              });

              return _context.abrupt('return', toLearnToReviewResponse);

            case 9:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function idsOfProblemsToLearnAndReviewPerCourse(_x) {
      return _ref.apply(this, arguments);
    };
  }()
};

exports.select = select;

/***/ }),
/* 30 */
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
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ddelete = undefined;

var _init = __webpack_require__(0);

var ddelete = {
  deleteMany: function deleteMany(problemIds) {
    return _init.db.none('\n      DELETE FROM problem\n      WHERE id IN (' + problemIds + ')\n      ');
  }
};

exports.ddelete = ddelete;

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

var _requireKeys = __webpack_require__(1);

var insert = {
  // we don't need to create problem_user_is_learning for every user who learns this course, because problem_user_is_learning is only for already learnt problems
  create: (0, _requireKeys.requireKeys)(['type', 'content', 'courseId'], function (_ref) {
    var type = _ref.type,
        content = _ref.content,
        courseId = _ref.courseId;
    return _init.db.one("INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, timezone('UTC', now())) RETURNING *", {
      type: type,
      content: content,
      courseId: courseId
    });
  }),

  createManyFromExcel: function createManyFromExcel(courseId, problems) {
    return _init.db.tx(function (transaction) {
      var queries = problems.map(function (problem) {
        return transaction.none("INSERT INTO problem (type, content, course_id, created_at) VALUES (${type}, ${content}, ${courseId}, timezone('UTC', now()))", {
          type: 'separateAnswer',
          content: {
            content: problem.content,
            answer: problem.answer
          },
          courseId: courseId
        });
      });
      return transaction.batch(queries);
    });
  },

  moveToCourseMany: function moveToCourseMany(problemIds, courseId) {
    var promises = problemIds.map(function (problemId) {
      var problemPromise = _init.db.one('SELECT * FROM problem WHERE id = ${problemId}', { problemId: problemId });
      return problemPromise.then(function (problem) {
        return Promise.all([insert.create({
          type: problem.type,
          content: problem.content,
          courseId: courseId
        }), _init.db.none('delete from problem where id=${problemId}', { problemId: problemId })]);
      });
    });
    return Promise.all(promises);
  }
};

exports.insert = insert;

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.select = undefined;

var _init = __webpack_require__(0);

var select = {
  one: function one(id) {
    return _init.db.one('SELECT * FROM problem WHERE id = ${id}', { id: id });
  },
  allByCourseId: function allByCourseId(courseId) {
    return _init.db.any('SELECT * FROM problem WHERE course_id = ${courseId} ORDER BY created_at', { courseId: courseId });
  },
  all: function all() {
    return _init.db.any('SELECT * FROM problem');
  }
};

exports.select = select;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ddelete = undefined;

var _init = __webpack_require__(0);

var ddelete = {
  ddelete: function ddelete(id) {
    return _init.db.none('DELETE FROM problem_user_is_learning WHERE id=${id}', { id: id });
  }
};

exports.ddelete = ddelete;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.insert = undefined;

var _init = __webpack_require__(0);

var _requireKeys = __webpack_require__(1);

var _initialScore = __webpack_require__(16);

var insert = {
  create: (0, _requireKeys.requireKeys)(['courseUserIsLearningId', 'problemId'], function (_ref) {
    var courseUserIsLearningId = _ref.courseUserIsLearningId,
        problemId = _ref.problemId,
        ifIgnored = _ref.ifIgnored;
    return _init.db.one('\n        INSERT INTO problem_user_is_learning\n        (easiness, consecutive_correct_answers, next_due_date, course_user_is_learning_id, problem_id, if_ignored) VALUES\n        (${easiness}, ${consecutiveCorrectAnswers}, timezone(\'UTC\', now()), ${courseUserIsLearningId}, ${problemId}, ${ifIgnored})\n        RETURNING *\n        ', {
      easiness: (0, _initialScore.initialScore)().easiness,
      consecutiveCorrectAnswers: (0, _initialScore.initialScore)().consecutiveCorrectAnswers,
      ifIgnored: ifIgnored || false,
      courseUserIsLearningId: courseUserIsLearningId,
      problemId: problemId
    });
  })
};

exports.insert = insert;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.update = undefined;

var _init = __webpack_require__(0);

var _getNextScore = __webpack_require__(15);

var _select = __webpack_require__(13);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var update = {
  // solve particular problem
  // performanceRating: 0-5
  review: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(courseUserIsLearningId, problemId, performanceRating) {
      var me, nextScore;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return _select.select.findByCuilIdAndProblemId(courseUserIsLearningId, problemId);

            case 2:
              me = _context.sent;
              nextScore = (0, _getNextScore.getNextScore)(me.easiness, me.consecutiveCorrectAnswers, performanceRating);
              return _context.abrupt('return', _init.db.one('\n      UPDATE problem_user_is_learning\n      SET easiness = ${easiness},\n          consecutive_correct_answers = ${consecutiveCorrectAnswers},\n          next_due_date = timezone(\'UTC\', (now() + \'' + nextScore.daysToNextReview + ' days\'::INTERVAL)),\n          last_reviewed_at = timezone(\'UTC\', now())\n      WHERE id = ${id}\n      RETURNING *\n      ', {
                easiness: nextScore.easiness,
                consecutiveCorrectAnswers: nextScore.consecutiveCorrectAnswers,
                id: me.id
              }));

            case 5:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function review(_x, _x2, _x3) {
      return _ref.apply(this, arguments);
    };
  }(),

  ignore: function ignore(id) {
    return _init.db.one('\n      UPDATE problem_user_is_learning\n      SET if_ignored = true\n      WHERE id = ${id}\n      RETURNING *\n      ', { id: id });
  }
};

exports.update = update;

/***/ }),
/* 37 */
/***/ (function(module, exports) {

module.exports = require("jsonwebtoken");

/***/ }),
/* 38 */
/***/ (function(module, exports) {

module.exports = require("pretty-error");

/***/ }),
/* 39 */,
/* 40 */,
/* 41 */
/***/ (function(module, exports) {

module.exports = require("path");

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.routes = undefined;

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _allowCrossDomain = __webpack_require__(60);

var _stopPropagationForAssets = __webpack_require__(61);

var _bodyParser = __webpack_require__(62);

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _path = __webpack_require__(41);

var _path2 = _interopRequireDefault(_path);

var _routes = __webpack_require__(54);

var _routes2 = __webpack_require__(57);

var _routes3 = __webpack_require__(55);

var _routes4 = __webpack_require__(58);

var _routes5 = __webpack_require__(53);

var _routes6 = _interopRequireDefault(_routes5);

var _routes7 = __webpack_require__(45);

var _routes8 = __webpack_require__(56);

var _routes9 = __webpack_require__(44);

var _html = __webpack_require__(59);

var _handleErrors = __webpack_require__(27);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var routes = (0, _express2.default)();

routes.use(_allowCrossDomain.allowCrossDomain);

routes.use(_stopPropagationForAssets.stopPropagationForAssets);

routes.use(_bodyParser2.default.json({ limit: '50mb' })); // to support JSON-encoded bodies
routes.use(_bodyParser2.default.urlencoded({
  limit: '50mb', // otherwise will complain about image upload
  extended: true,
  parameterLimit: 50000
}));

routes.use(_express2.default.static(_path2.default.join(__dirname, '../../frontend/staticFiles/underRoot')));
routes.use('/static-files', _express2.default.static(_path2.default.join(__dirname, '../../frontend/staticFiles/underUrlPrefix')));
routes.use('/webpacked-files', _express2.default.static(_path2.default.join(__dirname, '../../frontend/webpackedFiles')));

// routes

routes.use('/api/courses', _routes.router);

routes.use('/api/problems', _routes2.router);

routes.use('/api/coursesUserIsLearning', _routes3.router);

routes.use('/api/problemsUserIsLearning', _routes4.router);

routes.use('/api/courseCategories', _routes6.default);

routes.use('/api/auth', _routes7.router);

// GET routes that return results for particular frontend page. something like what a standard server-rendered structure would do.

routes.use('/api/pages', _routes8.router);

routes.use('/api/admin', _routes9.router);

routes.get('*', function (request, response) {
  return response.send(_html.html);
});

routes.use(_handleErrors.handleErrors);

exports.routes = routes;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// When you require('env.js') because this isn’t wrapped in a module.exports (on purpose),
// the code is literally executed and thus the variables are added to your environment
// http://thewebivore.com/super-simple-environment-variables-node-js/

// to change these, go to https://github.com/settings/applications/505783.
process.env['GITHUB_OAUTH_ID'] = 'b4f6fd40a2b6401dc1b2';
process.env['GITHUB_OAUTH_SECRET'] = '016cdc9ce2711937c92921f606965d09de545ad0';

process.env['GOOGLE_OAUTH_ID'] = '613277424660-igluqg2i4b0usmp0u45a295e5i6k3048.apps.googleusercontent.com';
process.env['GOOGLE_OAUTH_SECRET'] = 'OgmLGBupRx4rm8Cc4qLQ-En3';
process.env['GOOGLE_OAUTH_CALLBACK'] = 'http://localhost:3000/api/auth/google/callback';

process.env['CONTACT_EMAIL'] = 'contact@memcode.com';

process.env['JWT_SECRET'] = 'lamlalamkflre';

process.env['DB_USER'] = 'postgres';
process.env['DB_PASSWORD'] = '§1§1§1';

// postgres db
// 0245328cb03fe9c577709aca77614b1743e9735fa510fecbd98bf4c3ef9f0afa


// ___logo for contact@memcode.com
// https://admin.google.com/memcode.com/AdminHome?pli=1&fral=1#CompanyProfile:flyout=personalization

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

exports.router = router;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _jsonwebtoken = __webpack_require__(37);

var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);

var _catchAsync = __webpack_require__(3);

var _githubFetchAccessToken = __webpack_require__(46);

var _githubFetchAuthorizedAccount = __webpack_require__(47);

var _googleFetchAccessToken = __webpack_require__(48);

var _googleFetchAuthorizedAccount = __webpack_require__(49);

var _model = __webpack_require__(10);

var User = _interopRequireWildcard(_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

var createOauthProvider = function createOauthProvider(oauthProviderName) {
  switch (oauthProviderName) {
    case 'github':
      return {
        fetchAccessToken: _githubFetchAccessToken.githubFetchAccessToken,
        fetchProfile: _githubFetchAuthorizedAccount.githubFetchAuthorizedAccount,
        oauthId: process.env['GITHUB_OAUTH_ID'],
        oauthSecret: process.env['GITHUB_OAUTH_SECRET']
      };
    case 'google':
      return {
        fetchAccessToken: _googleFetchAccessToken.googleFetchAccessToken,
        fetchProfile: _googleFetchAuthorizedAccount.googleFetchAuthorizedAccount,
        oauthId: process.env['GOOGLE_OAUTH_ID'],
        oauthSecret: process.env['GOOGLE_OAUTH_SECRET']
      };
  }
};

// @param referrerUrl - e.g. http://memcode.com/please-sign-in
var createOauthCallbackRoute = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oauthProviderName, code, response) {
    var oauthProvider, accessToken, oauthProfile, dbUser, token, redirectUrl;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            oauthProvider = createOauthProvider(oauthProviderName);
            _context.next = 3;
            return oauthProvider.fetchAccessToken(oauthProvider.oauthId, oauthProvider.oauthSecret, code);

          case 3:
            accessToken = _context.sent;
            _context.next = 6;
            return oauthProvider.fetchProfile(accessToken);

          case 6:
            oauthProfile = _context.sent;
            _context.next = 9;
            return User.select.oneByOauth(oauthProviderName, oauthProfile.id);

          case 9:
            _context.t0 = _context.sent;

            if (_context.t0) {
              _context.next = 14;
              break;
            }

            _context.next = 13;
            return User.insert.createFrom(oauthProviderName, oauthProfile);

          case 13:
            _context.t0 = _context.sent;

          case 14:
            dbUser = _context.t0;
            token = _jsonwebtoken2.default.sign(dbUser, process.env['JWT_SECRET']);
            redirectUrl = '/?token=' + encodeURIComponent(token);

            response.redirect(redirectUrl);

          case 18:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function createOauthCallbackRoute(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

// after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here
// docs: https://developer.github.com/apps/building-integrations/setting-up-and-registering-oauth-apps/about-authorization-options-for-oauth-apps
router.get('/github/callback', (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            createOauthCallbackRoute('github', request.query.code, response);

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, undefined);
  }));

  return function (_x4, _x5) {
    return _ref2.apply(this, arguments);
  };
}()));

router.get('/google/callback', (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            createOauthCallbackRoute('google', request.query.code, response);

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, undefined);
  }));

  return function (_x6, _x7) {
    return _ref3.apply(this, arguments);
  };
}()));

exports.router = router;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.githubFetchAccessToken = undefined;

var _nodeFetch = __webpack_require__(26);

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _formData = __webpack_require__(63);

var _formData2 = _interopRequireDefault(_formData);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// getting access token by sending github authorization code that will prove to github that we are the application (client_id, client_secret) that user gave access to
var githubFetchAccessToken = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oauthId, oauthSecret, code) {
    var data, stringWithAccessToken, accessToken;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = new _formData2.default();

            data.append('client_id', oauthId);
            data.append('client_secret', oauthSecret);
            data.append('code', code);
            data.append('scope', "user:email");

            // 'access_token=0bc4d5757978a90d8e9bc96fac795c876179f2ba&scope=&token_type=bearer'
            _context.next = 7;
            return (0, _nodeFetch2.default)('https://github.com/login/oauth/access_token', {
              method: 'POST',
              headers: {
                Accept: 'application/json'
              },
              body: data
            }).then(function (response) {
              return response.json();
            });

          case 7:
            stringWithAccessToken = _context.sent;

            if (!stringWithAccessToken.error) {
              _context.next = 12;
              break;
            }

            return _context.abrupt('return', Promise.reject(stringWithAccessToken.error_description));

          case 12:
            accessToken = stringWithAccessToken.access_token;
            return _context.abrupt('return', accessToken);

          case 14:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function githubFetchAccessToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.githubFetchAccessToken = githubFetchAccessToken;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.githubFetchAuthorizedAccount = undefined;

var _nodeFetch = __webpack_require__(26);

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// fetching our profile info signed in as a user (access token)
var githubFetchAuthorizedAccount = function githubFetchAuthorizedAccount(accessToken) {
  return (0, _nodeFetch2.default)('https://api.github.com/user', {
    headers: {
      Authorization: 'token ' + accessToken
    }
  }).then(function (response) {
    if (response.ok) {
      return response.json();
    } else {
      return response.json().then(function (res) {
        return Promise.reject(res);
      });
    }
  });
};

exports.githubFetchAuthorizedAccount = githubFetchAuthorizedAccount;

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.googleFetchAccessToken = undefined;

var _nodeFetch = __webpack_require__(26);

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

var _url = __webpack_require__(65);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// getting access token by sending github authorization code that will prove to github that we are the application (client_id, client_secret) that user gave access to
var googleFetchAccessToken = function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(oauthId, oauthSecret, code) {
    var data, stringWithAccessToken, accessToken;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            data = new _url.URLSearchParams();

            data.append('client_id', oauthId);
            data.append('client_secret', oauthSecret);
            data.append('code', code);
            data.append('redirect_uri', process.env['GOOGLE_OAUTH_CALLBACK']);
            data.append('grant_type', 'authorization_code');

            _context.next = 8;
            return (0, _nodeFetch2.default)('https://www.googleapis.com/oauth2/v4/token', {
              method: 'POST',
              body: data
            }).then(function (response) {
              return response.json();
            });

          case 8:
            stringWithAccessToken = _context.sent;

            if (!stringWithAccessToken.error) {
              _context.next = 13;
              break;
            }

            return _context.abrupt('return', Promise.reject(stringWithAccessToken.error_description));

          case 13:
            accessToken = stringWithAccessToken.access_token;
            return _context.abrupt('return', accessToken);

          case 15:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, undefined);
  }));

  return function googleFetchAccessToken(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  };
}();

exports.googleFetchAccessToken = googleFetchAccessToken;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.googleFetchAuthorizedAccount = undefined;

var _nodeFetch = __webpack_require__(26);

var _nodeFetch2 = _interopRequireDefault(_nodeFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// fetching our profile info signed in as a user (access token)
var googleFetchAuthorizedAccount = function googleFetchAuthorizedAccount(accessToken) {
  return (0, _nodeFetch2.default)('https://www.googleapis.com/userinfo/v2/me', {
    headers: {
      Authorization: 'Bearer ' + accessToken,
      Accept: 'application/json'
    }
  }).then(function (response) {
    return response.ok ? response.json() : response.json().then(Promise.reject);
  });
};

exports.googleFetchAuthorizedAccount = googleFetchAuthorizedAccount;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _select = __webpack_require__(52);

var _select2 = _interopRequireDefault(_select);

var _insert = __webpack_require__(51);

var _insert2 = _interopRequireDefault(_insert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { update } from './update';
// import { ddelete } from './ddelete';

// CREATE TABLE course (
//   id SERIAL PRIMARY KEY,
//   title VARCHAR NOT NULL,

//   user_id INTEGER REFERENCES "user" (id) ON DELETE CASCADE NOT NULL
// );

exports.default = { select: _select2.default, insert: _insert2.default };

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = __webpack_require__(0);

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

// import { camelizeDbColumns } from '~/services/camelizeDbColumns';

var insert = {
  create: function create(courseCategory) {
    return _init.db.one("INSERT INTO course_category (name, course_category_group_id) \
      VALUES (${name}, ${courseCategoryGroupId}) RETURNING *", {
      name: courseCategory.name,
      courseCategoryGroupId: courseCategory.courseCategoryGroupId
    });
  },

  createGroup: function createGroup(courseCategoryGroup) {
    return _init.db.one("INSERT INTO course_category_group (name) VALUES (${name}) RETURNING *", {
      name: courseCategoryGroup.name
    });
  },

  seed: function seed() {
    var createGroupWithCategories = function () {
      var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(groupName, categoryNames) {
        var group, categoryPromises;
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return insert.createGroup({ name: groupName });

              case 2:
                group = _context.sent;
                categoryPromises = categoryNames.map(function (name) {
                  return insert.create({ name: name, courseCategoryGroupId: group.id });
                });
                _context.next = 6;
                return Promise.all(categoryPromises);

              case 6:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, undefined);
      }));

      return function createGroupWithCategories(_x, _x2) {
        return _ref.apply(this, arguments);
      };
    }();

    return Promise.all([createGroupWithCategories('Hard Sciences', ['Mathematics', 'Physics', 'Astronomy', 'Biology', 'Programming Languages', 'Computer Science']), createGroupWithCategories('Soft Sciences', ['Politics', 'Economics', 'Psychology', 'Law', 'History', 'Music', 'Literature']), createGroupWithCategories('Languages', ['English', 'German', 'Swedish'])]);
  }

};

exports.default = insert;

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _init = __webpack_require__(0);

var _integerizeDbColumns = __webpack_require__(14);

var _wherePublic = __webpack_require__(11);

var _wherePublic2 = _interopRequireDefault(_wherePublic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import { camelizeDbColumns } from '~/services/camelizeDbColumns';
exports.default = {
  // .any always returns an array ([] one if nothing is present)
  all: function all() {
    return _init.db.any('\n      SELECT\n        course_category.*,\n        COUNT(course.id) AS amount_of_courses\n      FROM course_category\n      LEFT OUTER JOIN course\n        ON\n          course.course_category_id = course_category.id\n            AND\n          ' + _wherePublic2.default + '\n      GROUP BY course_category.id\n    ').then(function (array) {
      return (0, _integerizeDbColumns.integerizeDbColumns)(array, ['amountOfCourses']);
    });
  },

  allCourseCategoryGroups: function allCourseCategoryGroups() {
    return _init.db.any('SELECT * FROM course_category_group');
  }
};

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(3);

var _model = __webpack_require__(50);

var _model2 = _interopRequireDefault(_model);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.get('/withGroups', (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var courseCategories, courseCategoryGroups;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return _model2.default.select.all();

          case 2:
            courseCategories = _context.sent;
            _context.next = 5;
            return _model2.default.select.allCourseCategoryGroups();

          case 5:
            courseCategoryGroups = _context.sent;


            response.status(200).json({ courseCategories: courseCategories, courseCategoryGroups: courseCategoryGroups });

          case 7:
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

// router.get('/withGroupsForUserLearning', catchAsync(async (request, response) => {
//   const courseCategories = await CourseCategoryModel.select.all();
//   const courseCategoryGroups = await CourseCategoryModel.select.allCourseCategoryGroups();

//   const userId = request.query.userId;

//   response.status(200).json({ courseCategories, courseCategoryGroups });
// }));

router.get('/seed', (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return _model2.default.insert.seed();

          case 2:
            response.status(200).json({});

          case 3:
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

exports.default = router;

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(3);

var _authenticate = __webpack_require__(25);

var _model = __webpack_require__(7);

var Course = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(5);

var CourseUserIsLearning = _interopRequireWildcard(_model2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.get('/public', (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var pageSize, pageNumber, onePageOfCourses, amountOfAllCourses;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            pageSize = request.query.pageSize;
            pageNumber = request.query.pageNumber;
            _context.next = 4;
            return Course.select.allPublic({
              sortBy: request.query.sortBy,
              limit: pageSize,
              offset: (pageNumber - 1) * pageSize,
              courseCategoryId: request.query.courseCategoryId
            });

          case 4:
            onePageOfCourses = _context.sent;
            _context.next = 7;
            return Course.select.countAllPublic({
              courseCategoryId: request.query.courseCategoryId
            });

          case 7:
            amountOfAllCourses = _context.sent;


            response.status(200).json({
              onePageOfCourses: onePageOfCourses,
              amountOfPages: Math.ceil(amountOfAllCourses / pageSize)
            });

          case 9:
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
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var courseCategoryId, courses;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            courseCategoryId = request.query.courseCategoryId;
            _context2.next = 3;
            return Course.select.allLearned(request.currentUser.id);

          case 3:
            courses = _context2.sent;


            if (courseCategoryId) {
              courses = courses.filter(function (course) {
                return course.course.courseCategoryId.toString() === courseCategoryId.toString();
              });
            }
            response.status(200).json(courses);

          case 6:
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
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var courses;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return Course.select.allCreated(request.currentUser.id);

          case 2:
            courses = _context3.sent;

            response.status(200).json(courses);

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

router.get('/search', _authenticate.optionalAuthenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
    var courses;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Course.select.search(request.currentUser && request.currentUser.id, request.query.searchString);

          case 2:
            courses = _context4.sent;

            response.status(200).json(courses);

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

router.get('/stats', _authenticate.optionalAuthenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    var courseStats;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Course.select.getCourseStats(request.params.courseId);

          case 2:
            courseStats = _context5.sent;

            response.status(200).json(courseStats);

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

router.post('/', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, response) {
    var course;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return Course.insert.create(_extends({}, request.body['course'], { userId: request.currentUser.id }));

          case 2:
            course = _context6.sent;
            _context6.next = 5;
            return CourseUserIsLearning.insert.create({
              courseId: course.id,
              userId: request.currentUser.id,
              active: true
            });

          case 5:

            response.status(200).json(course);

          case 6:
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

router.put('/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(request, response) {
    var updatedCourse;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return Course.update.update(request.params.id, request.body['course']);

          case 2:
            updatedCourse = _context7.sent;

            response.status(200).json(updatedCourse);

          case 4:
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

router.delete('/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8(request, response) {
    return regeneratorRuntime.wrap(function _callee8$(_context8) {
      while (1) {
        switch (_context8.prev = _context8.next) {
          case 0:
            _context8.next = 2;
            return Course.ddelete.destroyCourseWithProblems(request.params.id);

          case 2:
            response.status(200).json({});

          case 3:
          case 'end':
            return _context8.stop();
        }
      }
    }, _callee8, undefined);
  }));

  return function (_x15, _x16) {
    return _ref8.apply(this, arguments);
  };
}()));

exports.router = router;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(3);

var _authenticate = __webpack_require__(25);

var _model = __webpack_require__(5);

var CourseUserIsLearning = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(9);

var ProblemUserIsLearning = _interopRequireWildcard(_model2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.post('/', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var courseUserIsLearning;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return CourseUserIsLearning.insert.create({
              courseId: request.body['courseId'],
              userId: request.currentUser.id,
              active: true
            });

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
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
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
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
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
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
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

router.post('/:id/problems/:problemId/learn', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    var puil;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return ProblemUserIsLearning.insert.create({
              courseUserIsLearningId: request.params['id'],
              problemId: request.params['problemId']
            });

          case 2:
            puil = _context5.sent;

            response.status(200).json(puil);

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

exports.router = router;

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(3);

var _authenticate = __webpack_require__(25);

var _model = __webpack_require__(5);

var CourseUserIsLearning = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(9);

var ProblemUserIsLearning = _interopRequireWildcard(_model2);

var _model3 = __webpack_require__(7);

var Course = _interopRequireWildcard(_model3);

var _model4 = __webpack_require__(12);

var Problem = _interopRequireWildcard(_model4);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

// ___per-page routes (/api/pages/page-url)
// {
//   courseUserIsLearning: {...},
//   problems: [
//     {coursesUserIsLearning
//       problem, problemUserIsLearning
//     },
//     {
//       problem
//     }
//   ]
// }
router.get('/courses/:id/learn', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var courseId, courseUserIsLearning, problems, problemUserIsLearnings;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            courseId = request.params['id'];

            // find cuil

            _context.next = 3;
            return CourseUserIsLearning.select.oneByCourseIdAndUserId(courseId, request.currentUser.id);

          case 3:
            courseUserIsLearning = _context.sent;
            _context.next = 6;
            return Problem.select.allByCourseId(courseId);

          case 6:
            problems = _context.sent;
            _context.next = 9;
            return ProblemUserIsLearning.select.allByCuilId(courseUserIsLearning.id);

          case 9:
            problemUserIsLearnings = _context.sent;


            response.status(200).json({ courseUserIsLearning: courseUserIsLearning, problems: problems, problemUserIsLearnings: problemUserIsLearnings });

          case 11:
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
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
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

router.get('/courses/:id/review/simulated', (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var courseId, problems;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            courseId = request.params['id'];
            _context3.next = 3;
            return Problem.select.allByCourseId(courseId);

          case 3:
            problems = _context3.sent;

            response.status(200).json({ courseUserIsLearning: null, problems: problems });

          case 5:
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

router.get('/courses/:id/edit', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
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

router.get('/courses/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    var courseId, problems;
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            courseId = request.params['id'];
            _context5.next = 3;
            return Problem.select.allByCourseId(courseId);

          case 3:
            problems = _context5.sent;


            response.status(200).json(problems);

          case 5:
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

// per-component routes (/api/pages/componentName/...)
router.get('/courseActions/:courseId', _authenticate.optionalAuthenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, response) {
    var course, courseStats;
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return Course.select.oneForActions(request.params.courseId, request.currentUser ? request.currentUser.id : null);

          case 2:
            course = _context6.sent;

            if (course) {
              _context6.next = 5;
              break;
            }

            throw new Error("Sorry, course with this id has not yet been created.");

          case 5:
            _context6.next = 7;
            return Course.select.getCourseStats(request.params.courseId);

          case 7:
            courseStats = _context6.sent;


            response.status(200).json(_extends({}, course, { stats: courseStats }));

          case 9:
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

// global state (?)
router.get('/idsOfProblemsToLearnAndReviewPerCourse', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7(request, response) {
    var idsOfProblemsToLearnAndReviewPerCourse;
    return regeneratorRuntime.wrap(function _callee7$(_context7) {
      while (1) {
        switch (_context7.prev = _context7.next) {
          case 0:
            _context7.next = 2;
            return CourseUserIsLearning.select.idsOfProblemsToLearnAndReviewPerCourse(request.currentUser.id);

          case 2:
            idsOfProblemsToLearnAndReviewPerCourse = _context7.sent;

            response.status(200).json(idsOfProblemsToLearnAndReviewPerCourse);

          case 4:
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(3);

var _model = __webpack_require__(12);

var Problem = _interopRequireWildcard(_model);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.get('/', (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var courseId, problemsByCourseId;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            courseId = request.query.courseId;
            _context.next = 3;
            return Problem.select.allByCourseId(courseId);

          case 3:
            problemsByCourseId = _context.sent;


            response.status(200).json(problemsByCourseId);

          case 5:
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

router.post('/', (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var createdProblem;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _context2.next = 2;
            return Problem.insert.create(request.body['problem']);

          case 2:
            createdProblem = _context2.sent;

            response.status(200).json(createdProblem);

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

router.post('/createManyFromExcel', (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var courseId, problems, arrayOfNulls;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            courseId = request.body['courseId'];
            problems = request.body['problems'];
            _context3.next = 4;
            return Problem.insert.createManyFromExcel(courseId, problems);

          case 4:
            arrayOfNulls = _context3.sent;

            response.status(200).json({ amountOfCreatedProblems: arrayOfNulls.length });

          case 6:
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

router.put('/:id', (0, _catchAsync.catchAsync)(function () {
  var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(request, response) {
    var updatedProblem;
    return regeneratorRuntime.wrap(function _callee4$(_context4) {
      while (1) {
        switch (_context4.prev = _context4.next) {
          case 0:
            _context4.next = 2;
            return Problem.update(request.body['problem'], request.params['id']);

          case 2:
            updatedProblem = _context4.sent;

            response.status(200).json(updatedProblem);

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

router.delete('/deleteMany', (0, _catchAsync.catchAsync)(function () {
  var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(request, response) {
    return regeneratorRuntime.wrap(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            _context5.next = 2;
            return Problem.ddelete.deleteMany(request.body['problemIds']);

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

router.post('/moveToCourseMany', (0, _catchAsync.catchAsync)(function () {
  var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(request, response) {
    return regeneratorRuntime.wrap(function _callee6$(_context6) {
      while (1) {
        switch (_context6.prev = _context6.next) {
          case 0:
            _context6.next = 2;
            return Problem.insert.moveToCourseMany(request.body['problemIds'], request.body['courseId']);

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

exports.router = router;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.router = undefined;

var _express = __webpack_require__(2);

var _express2 = _interopRequireDefault(_express);

var _catchAsync = __webpack_require__(3);

var _authenticate = __webpack_require__(25);

var _model = __webpack_require__(12);

var Problem = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(5);

var CourseUserIsLearning = _interopRequireWildcard(_model2);

var _model3 = __webpack_require__(9);

var ProblemUserIsLearning = _interopRequireWildcard(_model3);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var router = _express2.default.Router();

router.post('/', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(request, response) {
    var problemId, userId, problem, cuil, createdPuil;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            problemId = request.body['problemId'];
            userId = request.currentUser.id;
            _context.next = 4;
            return Problem.select.one(problemId);

          case 4:
            problem = _context.sent;
            _context.next = 7;
            return CourseUserIsLearning.select.oneByCourseIdAndUserId(problem.courseId, userId);

          case 7:
            cuil = _context.sent;
            _context.next = 10;
            return ProblemUserIsLearning.insert.create({
              courseUserIsLearningId: cuil.id,
              problemId: problemId
            });

          case 10:
            createdPuil = _context.sent;

            response.status(200).json(createdPuil);

          case 12:
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

router.delete('/:id', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(request, response) {
    var puilId;
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            puilId = request.params['id'];
            _context2.next = 3;
            return ProblemUserIsLearning.ddelete.ddelete(puilId);

          case 3:
            response.status(200).json({});

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

router.put('/:id/ignore', _authenticate.authenticateMiddleware, (0, _catchAsync.catchAsync)(function () {
  var _ref3 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(request, response) {
    var ignoredPuil;
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            _context3.next = 2;
            return ProblemUserIsLearning.update.ignore(request.params['id']);

          case 2:
            ignoredPuil = _context3.sent;

            response.status(200).json(ignoredPuil);

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

exports.router = router;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.html = undefined;

var _querystring = __webpack_require__(64);

var googleAnalyticsScriptTag = process.env['NODE_ENV'] === 'production' ? '\n    <!-- https://analytics.google.com/analytics/web/?authuser=0#management/Settings/a109178648w163012947p163935248/%3Fm.page%3DTrackingCode%26_r.ghFlowId%3D6324039/ -->\n    <!-- Global site tag (gtag.js) - Google Analytics -->\n    <script src="https://www.googletagmanager.com/gtag/js?id=UA-109178648-1" async></script>\n    <script>\n      window.dataLayer = window.dataLayer || [];\n      function gtag() { dataLayer.push(arguments); }\n      gtag(\'js\', new Date());\n\n      gtag(\'config\', \'UA-109178648-1\');\n    </script>\n  ' : '';

var html = '\n  <!DOCTYPE html>\n  <html lang="en">\n  <head>\n    <title>Memcode</title>\n\n    <!-- css -->\n    <link href="/webpacked-files/index.css" rel="stylesheet">\n\n    <!-- quill theme support -->\n    <link rel="stylesheet" href="/static-files/quill.snow.css">\n\n    <!-- katex support -->\n    <link rel="stylesheet" href="/static-files/katex.min.css"/>\n    <script src="/static-files/katex.min.js"></script>\n\n    <!-- to verify google webmasters -->\n    <meta name="google-site-verification" content="Cv256pnTnFWM0T6qi3SXK1u1K-B6W7IJQ9JoOQ_1I_E"/>\n    <!-- to make site look bigger on mobiles -->\n    <meta id="meta" name="viewport" content="width=device-width, initial-scale=1.0"/>\n\n    <!-- as per https://realfavicongenerator.net/favicon_result?file_id=p1cd8gt6qj1kvp121l103k18gh1u4c6#.WvYIatOuzhM -->\n    <link rel="icon" type="image/png" href="/favicon-32x32.png?v=3" sizes="32x32"/>\n    <link rel="icon" type="image/png" href="/favicon-16x16.png?v=3" sizes="16x16"/>\n    <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png?v=3">\n    <link rel="mask-icon" href="/safari-pinned-tab.svg?v=3" color="#ba2490">\n    <link rel="manifest" href="/site.webmanifest">\n    <meta name="msapplication-TileColor" content="#9f00a7">\n    <meta name="theme-color" content="#ffffff">\n\n    <!-- data-react-helmet="true" for react-helmet to supersede it instead of adding a new description tag -->\n    <meta name="description" content="Create your own course to memorize anything you want. Flashcard-based, with formatting and images, with multiple flashcard types." data-react-helmet="true"/>\n  </head>\n  <body>\n    <div id="root"></div>\n\n    <!-- env vars -->\n    <script>\n      window.env = {\n        githubSignInLink: \'https://github.com/login/oauth/authorize?scope=user:email&client_id=' + process.env['GITHUB_OAUTH_ID'] + '\',\n        googleSignInLink: \'https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20email&redirect_uri=' + (0, _querystring.escape)(process.env['GOOGLE_OAUTH_CALLBACK']) + '&response_type=code&client_id=' + process.env['GOOGLE_OAUTH_ID'] + '\',\n        contactEmail: \'contact@memcode.com\'\n      };\n    </script>\n\n    <!-- main js file -->\n    <script type="text/javascript" src="/webpacked-files/index.js" defer></script>\n\n    ' + googleAnalyticsScriptTag + '\n  </html>\n';

exports.html = html;

/***/ }),
/* 60 */
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
/* 61 */
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
/* 62 */
/***/ (function(module, exports) {

module.exports = require("body-parser");

/***/ }),
/* 63 */
/***/ (function(module, exports) {

module.exports = require("form-data");

/***/ }),
/* 64 */
/***/ (function(module, exports) {

module.exports = require("querystring");

/***/ }),
/* 65 */
/***/ (function(module, exports) {

module.exports = require("url");

/***/ }),
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


__webpack_require__(77);

__webpack_require__(43);

var _routes = __webpack_require__(42);

console.log('NODE_ENV: ' + process.env.NODE_ENV);

// load environment variables.


// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 3000;

_routes.routes.listen(port, function (error) {
  error ? console.log('Server start error: ' + error) : console.log('Server is listening on port: ' + port);
});

/***/ }),
/* 70 */
/***/ (function(module, exports) {

module.exports = require("babel-polyfill");

/***/ }),
/* 71 */,
/* 72 */,
/* 73 */,
/* 74 */,
/* 75 */,
/* 76 */,
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(78).install();


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

var SourceMapConsumer = __webpack_require__(81).SourceMapConsumer;
var path = __webpack_require__(41);

var fs;
try {
  fs = __webpack_require__(79);
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
    try {
      contents = fs.readFileSync(path, 'utf8');
    } catch (er) {
      contents = '';
    }
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
    var headerLength = 62;
    if (line === 1 && column > headerLength && !isInBrowser() && !frame.isEval()) {
      column -= headerLength;
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
      try {
        contents = fs.readFileSync(source, 'utf8');
      } catch (er) {
        contents = '';
      }
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
      Module = __webpack_require__(80);
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
/* 79 */
/***/ (function(module, exports) {

module.exports = require("fs");

/***/ }),
/* 80 */
/***/ (function(module, exports) {

module.exports = require("module");

/***/ }),
/* 81 */
/***/ (function(module, exports) {

module.exports = require("source-map");

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(70);
module.exports = __webpack_require__(69);


/***/ })
/******/ ]);
//# sourceMappingURL=index.js.map