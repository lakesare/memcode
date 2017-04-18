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
/******/ 	return __webpack_require__(__webpack_require__.s = 40);
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
/* 1 */,
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
/* 4 */,
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
/* 6 */,
/* 7 */,
/* 8 */,
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
/* 10 */,
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
    return (0, _select.fetchCoursesAndTheirStats)('WHERE course.user_id = ${userId}', '', userId);
  },

  // for /profile. returns all courses userId is currently learning.
  // only active,
  // filtered by amount of due problems (TODO)
  allLearned: function allLearned(userId) {
    return (0, _select.fetchCoursesAndTheirStats)('\n      WHERE course_user_is_learning.user_id = ${userId} AND course_user_is_learning.active = true\n      ', 'ORDER BY amount_of_problems_to_review DESC', userId);
  },

  all: function all() {
    return _init.db.any('SELECT\n        row_to_json(course.*) AS course,\n        COUNT(problem.id)     AS amount_of_problems\n      FROM course\n      LEFT OUTER JOIN problem ON problem.course_id = course.id\n      WHERE if_public = true\n      GROUP BY course.id\n      ').then(function (array) {
      return (0, _camelizeDbColumns.camelizeDbColumns)(array, ['course', 'courseUserIsLearning']);
    });
  },

  oneForActions: function oneForActions(id, userId) {
    return (0, _select.fetchCoursesAndTheirStats)('WHERE course.id = ' + id, '', userId).then(function (array) {
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
/* 15 */,
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
var fetchCoursesAndTheirStats = function fetchCoursesAndTheirStats(where, orderBy, userId) {
  return _init.db.any('SELECT\n      row_to_json(course.*)                  AS course,\n      row_to_json(course_user_is_learning.*) AS course_user_is_learning,\n      COUNT(distinct problem_user_is_learning.id) AS amount_of_problems_to_review,\n      (\n        (SELECT COUNT(problem.*) FROM problem WHERE problem.course_id = course.id) -\n        (SELECT COUNT(problem_user_is_learning.*) FROM problem_user_is_learning WHERE problem_user_is_learning.course_user_is_learning_id = course_user_is_learning.id)\n      )                                      AS amount_of_problems_to_learn,\n      COUNT(distinct problem.id)             AS amount_of_problems\n\n    FROM course\n\n    -- course_user_is_learning\n    LEFT OUTER JOIN course_user_is_learning\n      ON (\n        course_user_is_learning.course_id = course.id\n        AND\n        course_user_is_learning.user_id = ${userId}\n      )\n\n    -- amount_of_problems_to_review\n    LEFT OUTER JOIN problem_user_is_learning\n      ON (\n        course_user_is_learning.id = problem_user_is_learning.course_user_is_learning_id\n        AND\n        problem_user_is_learning.next_due_date < timezone(\'UTC\', now())\n      )\n\n    -- amount_of_problems\n    LEFT OUTER JOIN problem ON problem.course_id = course.id\n\n    ' + where + '\n\n    GROUP BY course_user_is_learning.id, course.id\n    \n    ' + orderBy + '\n    ', { userId: userId }).then(function (array) {
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
/* 18 */,
/* 19 */,
/* 20 */,
/* 21 */,
/* 22 */,
/* 23 */,
/* 24 */,
/* 25 */,
/* 26 */,
/* 27 */,
/* 28 */,
/* 29 */,
/* 30 */,
/* 31 */,
/* 32 */,
/* 33 */,
/* 34 */,
/* 35 */,
/* 36 */,
/* 37 */,
/* 38 */,
/* 39 */,
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* eslint-disable */


var _model = __webpack_require__(5);

var Course = _interopRequireWildcard(_model);

var _model2 = __webpack_require__(9);

var User = _interopRequireWildcard(_model2);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var pgp = __webpack_require__(2);


// https://tylermcginnis.com/react-interview-questions/

// There are a variety of file system methods, all contained in the fs module


// ____Enzyme
// shallow Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.

// mount Full DOM rendering is ideal for use cases where you have components that may interact with DOM APIs, or may require the full lifecycle in order to fully test the component (i.e., componentDidMount etc.)

// Enzyme's render function is used to render react components to static HTML and analyze the resulting HTML structure.


// async Essentially wraps the return value of the function in a promise


// pg-promise transaction syntax
// ```
// return db.tx((transaction) => {
//   const queries = [
//     transaction.none('delete from courses where id=${course_Id}', { course_Id }),
//     transaction.none('delete from problems where course_Id=${course_Id}', { course_Id })
//   ];
//   return transaction.batch(queries);
// }).then(() => { return { data: 'deleted' }
// }).catch((error) => { return { error } 
// })
// ```

// UPDATE problems SET title = ${title} WHERE id = ${id}


// async await tutorial

// event loop looks at the stack, and, if there is nothing left, pushes the first thing into it. 


// ES6

// maps. are just like js objects, except everything can be a key.
// let a = new Map();
// a.set(1,'hi')
// a.get(1) //=> 'hi'


// let a = new Set();
// a.add('hi')
// a.has('hi') //=> true
// a.add('hi') //=> nothing changes, set is nonrepeating.


// javac is used for .java files into binary
// eclipse uses javac behind the scenes to run the program
// for every java class, you get one binary file.


// ___WEBPACK
// The url-loader works like the file-loader, but can return a Data URL if the file is smaller than a byte limit.

// part of css-loader functionality is seeing background: url('../pics/hi.png')
// this functionality can be turned off, but we may want to use it because eg image-loader allows us to compress images.


// http://supermemopedia.com/wiki/We_should_have_two_independent_measures_of_difficulty!
//
// Human memory works to combat complex memories by means of forgetting, replacement connections, interference, abstraction, etc. As forgetting and interference target complex memories, Darwinian mechanisms favor simple abstractions that are cheap to maintain and serve more efficient computation. That aspect of forgetting underlies human intelligence and creativity!
var pgPackage = pgp({});

/***/ })
/******/ ]);
//# sourceMappingURL=seed.js.map