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
/******/ 	return __webpack_require__(__webpack_require__.s = 75);
/******/ })
/************************************************************************/
/******/ ({

/***/ 0:
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

/***/ 1:
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

/***/ 10:
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

/***/ 11:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var wherePublic = "\n  course.if_public = true\n    AND\n  (\n    SELECT COUNT(problem.id) FROM problem WHERE problem.course_id = course.id\n  ) >= 2\n";

exports.default = wherePublic;

/***/ }),

/***/ 14:
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

/***/ 17:
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

/***/ 18:
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

/***/ 19:
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

/***/ 20:
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

/***/ 21:
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

/***/ 22:
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

/***/ 23:
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

/***/ 24:
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

/***/ 4:
/***/ (function(module, exports) {

module.exports = require("pg-promise");

/***/ }),

/***/ 6:
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

/***/ 7:
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

/***/ 75:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */


var _model = __webpack_require__(7);

var Course = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(10);

var User = _interopRequireWildcard(_model2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var pgp = __webpack_require__(4);


// ____Enzyme
// shallow Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.

// mount Full DOM rendering is ideal for use cases where you have components that may interact with DOM APIs, or may require the full lifecycle in order to fully test the component (i.e., componentDidMount etc.)

// Enzyme's render function is used to render react components to static HTML and analyze the resulting HTML structure.
var pgPackage = pgp({});

/***/ })

/******/ });
//# sourceMappingURL=seed.js.map