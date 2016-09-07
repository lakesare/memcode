/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _bodyParser = __webpack_require__(2);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _routes = __webpack_require__(3);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var app = (0, _express2.default)();
	var port = 3000;

	app.use(_bodyParser2.default.json()); // to support JSON-encoded bodies

	// (global routes, because path.join didn't work after update to webpacked ES6)
	// serve our static stuff like index.css
	app.use(_express2.default.static('/home/lakesare/Desktop/memcode/frontend/webpacked'));

	app.use('/api/courses', _routes.router);

	app.get('*', function (req, res) {
	  res.sendFile('/home/lakesare/Desktop/memcode/frontend/webpacked/index.html');
	});

	app.listen(port, function (err) {
	  if (err) {
	    return console.log('something bad happened', err);
	  }
	  console.log('server is listening on ' + port);
	});

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.router = undefined;

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _init = __webpack_require__(4);

	var _model = __webpack_require__(6);

	var Course = _interopRequireWildcard(_model);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var router = _express2.default.Router();

	router.get('/:id', function (request, response) {
	  Course.getCourseWithProblems(request.params.id).then(function (data) {
	    response.status(200).json(data);
	  }).catch(function (data) {
	    response.status(500).json({ error: data.message });
	  });
	});

	router.get('/', function (request, response) {
	  var courses = _init.db.any("select * from courses").then(function (data) {
	    response.status(200).json(data);
	  }).catch(function (data) {
	    response.status(500).json({ error: data.message });
	  });
	});

	router.post('/', function (request, response) {
	  var result = Course.createCourseWithProblems(request.body["course"], request.body["problems"]);

	  result.then(function (aaa) {
	    response.status(200).json({ data: aaa.data });
	  });

	  // if (result.data) {
	  //   response.status(200).json({ data: result.data });
	  // } else if (result.error) {
	  //   response.status(500).json({ error: result.error });
	  // };
	});

	router.delete('/', function (request, response) {});

	exports.router = router;

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.db = undefined;

	var _pgPromise = __webpack_require__(5);

	var pgPromise = _interopRequireWildcard(_pgPromise);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	var pgPackage = pgPromise.default({});

	var connectionString = {
	  host: 'localhost', // 'localhost' is the default;
	  port: 5432, // 5432 is the default;
	  database: isTest ? 'memcode_test' : 'memcode',
	  user: 'postgres',
	  password: '`1`1`1'
	};
	var db = pgPackage(connectionString);
	db.connect().then(function (obj) {
	  obj.done(); // success, release the connection;
	}).catch(function (error) {
	  console.log("ERROR:", error.message || error);
	});

	var isTest = function isTest() {
	  return process.env.NODE_ENV === 'test';
	};

	exports.db = db;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("pg-promise");

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.deleteCourseWithProblems = exports.getCourseWithProblems = exports.createCourseWithProblems = undefined;

	var _init = __webpack_require__(4);

	var _problemContentFromParamsToDb = __webpack_require__(7);

	// course: {title: "aaa"}
	// problems: [{content: "a", explanation: "aa"}]
	var createCourseWithProblems = function createCourseWithProblems(course, problems) {
	  // { validation: 'failed' }
	  var courseId = null;
	  var result = _init.db.one("insert into courses (title) values (${title}) RETURNING id", course).then(function (course) {
	    courseId = course.id;
	    var monad = _init.db.tx(function (transaction) {
	      return createProblemsOfCourse(transaction, problems, course.id);
	    });
	    return monad;
	  }).then(function (data) {
	    return { data: { courseId: courseId } };
	  }).catch(function (error) {
	    return { error: error };
	  });

	  return result;
	};

	// problems: [{content: "a", explanation: "aa"}]
	var createProblemsOfCourse = function createProblemsOfCourse(transaction, problems, courseId) {
	  var queries = [];
	  problems.forEach(function (problem) {
	    queries.push(transaction.none("insert into problems (content, explanation, courseId) values (${content}, ${explanation}, ${courseId})", {
	      content: (0, _problemContentFromParamsToDb.problemContentFromParamsToDb)(problem.content),
	      explanation: problem.explanation,
	      courseId: courseId
	    }));
	  });

	  return transaction.batch(queries);
	};

	var getCourseWithProblems = function getCourseWithProblems(courseId) {
	  var result = Promise.all([_init.db.one('select * from courses where id = ${courseId}', { courseId: courseId }), _init.db.any('select * from problems where courseId = ${courseId}', { courseId: courseId })]).then(function (values) {
	    return {
	      data: {
	        course: values[0],
	        problems: values[1]
	      }
	    };
	  }).catch(function (error) {
	    return { error: error };
	  });

	  return result;
	};

	var deleteCourseWithProblems = function deleteCourseWithProblems(courseId) {
	  return _init.db.tx(function (transaction) {
	    return transaction.batch([transaction.none('delete from problems where courseId=${courseId}', { courseId: courseId }), transaction.none('delete from courses where id=${courseId}', { courseId: courseId })]);
	  }).then(function () {
	    return { data: true };
	  }).catch(function (error) {
	    return { error: error };
	  });
	};

	exports.createCourseWithProblems = createCourseWithProblems;
	exports.getCourseWithProblems = getCourseWithProblems;
	exports.deleteCourseWithProblems = deleteCourseWithProblems;

/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// input: "<h1></h1>"

	// output: "text: ['<h1>first answer is ', null, ', </h1> anonymous functions in ruby are called <pre><code class="ruby"> ', null, '</code></pre>'],
	// answers: [
	//   { answer: 'hi' },
	//   { answer: 'hello' }
	// ]"
	var problemContentFromParamsToDb = function problemContentFromParamsToDb(content) {
	  var text = [];
	  var answers = [];

	  var contentRemaining = content;

	  while (contentRemaining.length > 0) {
	    var nextSubstringOfProblemParsed = findNextAnswer(contentRemaining);
	    text.push(nextSubstringOfProblemParsed.textPiece);
	    if (nextSubstringOfProblemParsed.answer !== null) {
	      answers.push({ answer: nextSubstringOfProblemParsed.answer });
	      text.push(null);
	    }
	    contentRemaining = nextSubstringOfProblemParsed.newContentRemaining;
	  }

	  return JSON.stringify({ answers: answers, text: text });
	};

	var findNextAnswer = function findNextAnswer(contentRemaining) {
	  var answerOpens = contentRemaining.indexOf("<answer>");
	  var answerCloses = contentRemaining.indexOf("</answer>");

	  var _ref = answerOpens === -1 ? {
	    textPiece: contentRemaining,
	    answer: null,
	    newContentRemaining: ''
	  } : {
	    textPiece: contentRemaining.slice(0, answerOpens),
	    answer: contentRemaining.slice(answerOpens + "<answer>".length, answerCloses),
	    newContentRemaining: contentRemaining.slice(answerCloses + "</answer>".length)
	  };

	  var textPiece = _ref.textPiece;
	  var answer = _ref.answer;
	  var newContentRemaining = _ref.newContentRemaining;


	  return { textPiece: textPiece, answer: answer, newContentRemaining: newContentRemaining };
	};

	exports.problemContentFromParamsToDb = problemContentFromParamsToDb;

/***/ }
/******/ ]);