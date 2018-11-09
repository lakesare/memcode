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
/******/ 	return __webpack_require__(__webpack_require__.s = 72);
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
/* 2 */,
/* 3 */,
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
/* 8 */
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ }),
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
/* 25 */,
/* 26 */,
/* 27 */,
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
/* 37 */,
/* 38 */,
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Factory = exports.RawFactory = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _model = __webpack_require__(10);

var User = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(7);

var Course = _interopRequireWildcard(_model2);

var _model3 = __webpack_require__(12);

var Problem = _interopRequireWildcard(_model3);

var _model4 = __webpack_require__(5);

var CourseUserIsLearning = _interopRequireWildcard(_model4);

var _model5 = __webpack_require__(9);

var ProblemUserIsLearning = _interopRequireWildcard(_model5);

var _requireKeys = __webpack_require__(1);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var uniqueIndex = 1;

var RawFactory = {
  user: function user(userFields) {
    uniqueIndex++;
    return User.insert.create(_extends({
      oauthProvider: 'github',
      oauthId: uniqueIndex, // oauthId, not real one. still needs to be unique
      username: 'lakesare',
      avatarUrl: 'hi.png',
      email: 'lake@gmail.com'
    }, userFields));
  },

  // required: userId
  course: (0, _requireKeys.requireKeys)(['userId'], function (courseFields) {
    return Course.insert.create(_extends({
      title: 'React',
      description: 'Js framework',
      ifPublic: true
    }, courseFields));
  }),

  problem: (0, _requireKeys.requireKeys)(['courseId'], function (problemFields) {
    return Problem.insert.create(_extends({
      type: 'inlinedAnswers',
      content: {
        content: '2+2',
        answer: '4'
      }
    }, problemFields));
  }),

  courseUserIsLearning: (0, _requireKeys.requireKeys)(['courseId', 'userId'], function (cuilFields) {
    return CourseUserIsLearning.insert.create(_extends({
      active: true
    }, cuilFields));
  }),

  problemUserIsLearning: (0, _requireKeys.requireKeys)(['problemId', 'courseUserIsLearningId'], function (puilFields) {
    return ProblemUserIsLearning.insert.create(_extends({}, puilFields));
  })
};

var Factory = {
  // problemUserIsLearning: async (puilFields) => {
  //   const user    = await RawFactory.user();
  //   const course  = await RawFactory.course({ userId: user.id });
  //   const cuil    = await RawFactory.courseUserIsLearning({ courseId: course.id, userId: user.id });
  //   const problem = await RawFactory.problem({ courseId: course.id });
  //   const puil    = await RawFactory.problemUserIsLearning({ problemId: problem.id, courseUserIsLearningId: cuil.id });
  //   return puil;
  // },

  course: function () {
    var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee(courseFields) {
      var user, course;
      return regeneratorRuntime.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.next = 2;
              return RawFactory.user({});

            case 2:
              user = _context.sent;
              _context.next = 5;
              return RawFactory.course(_extends({
                userId: user.id
              }, courseFields));

            case 5:
              course = _context.sent;
              return _context.abrupt('return', course);

            case 7:
            case 'end':
              return _context.stop();
          }
        }
      }, _callee, undefined);
    }));

    return function course(_x) {
      return _ref.apply(this, arguments);
    };
  }(),

  // kind of course that gets returned in /courses
  publicCourse: function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2(courseFields) {
      var user, course;
      return regeneratorRuntime.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              _context2.next = 2;
              return RawFactory.user();

            case 2:
              user = _context2.sent;
              _context2.next = 5;
              return RawFactory.course(_extends({
                userId: user.id,
                ifPublic: true
              }, courseFields));

            case 5:
              course = _context2.sent;
              _context2.next = 8;
              return RawFactory.problem({ courseId: course.id });

            case 8:
              _context2.next = 10;
              return RawFactory.problem({ courseId: course.id });

            case 10:
              return _context2.abrupt('return', course);

            case 11:
            case 'end':
              return _context2.stop();
          }
        }
      }, _callee2, undefined);
    }));

    return function publicCourse(_x2) {
      return _ref2.apply(this, arguments);
    };
  }()
};

exports.RawFactory = RawFactory;
exports.Factory = Factory;

/***/ }),
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */,
/* 44 */,
/* 45 */,
/* 46 */,
/* 47 */,
/* 48 */,
/* 49 */,
/* 50 */,
/* 51 */,
/* 52 */,
/* 53 */,
/* 54 */,
/* 55 */,
/* 56 */,
/* 57 */,
/* 58 */,
/* 59 */,
/* 60 */,
/* 61 */,
/* 62 */,
/* 63 */,
/* 64 */,
/* 65 */,
/* 66 */,
/* 67 */,
/* 68 */,
/* 69 */,
/* 70 */,
/* 71 */,
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _chai = __webpack_require__(8);

var _init = __webpack_require__(0);

var _Factory = __webpack_require__(39);

var _index = __webpack_require__(7);

var Course = _interopRequireWildcard(_index);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

describe('course model', function () {
  describe('select', function () {
    describe('search', function () {
      beforeEach('truncating db', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                return _context.abrupt('return', _init.db.none('TRUNCATE TABLE problem, course, "user" RESTART IDENTITY CASCADE'));

              case 1:
              case 'end':
                return _context.stop();
            }
          }
        }, _callee, undefined);
      })));

      it('case-insensitive', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var course_2, course_3, courses;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                _context2.next = 2;
                return _Factory.Factory.publicCourse({ title: 'Hello w' });

              case 2:
                _context2.next = 4;
                return _Factory.Factory.publicCourse({ title: 'Right' });

              case 4:
                course_2 = _context2.sent;
                _context2.next = 7;
                return _Factory.Factory.publicCourse({ title: 'Riper man' });

              case 7:
                course_3 = _context2.sent;
                _context2.next = 10;
                return Course.select.search(1, "ri");

              case 10:
                courses = _context2.sent;

                (0, _chai.expect)(courses.map(function (c) {
                  return c.course.title;
                })).to.have.members([course_2.title, course_3.title]);
                (0, _chai.expect)(courses.length).to.equal(2);

              case 13:
              case 'end':
                return _context2.stop();
            }
          }
        }, _callee2, undefined);
      })));
    });
  });
});

/***/ })
/******/ ]);
//# sourceMappingURL=index.test.js.map