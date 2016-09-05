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

	"use strict";

	var _init = __webpack_require__(4);

	var pgp = __webpack_require__(5);

	var pgPackage = pgp({});

	var seedCourses = function seedCourses() {
	  _init.db.none('INSERT INTO courses (title) VALUES (${title_1}), (${title_2})', {
	    title_1: 'Ruby',
	    title_2: 'Python'
	  }).then(function () {
	    log('courses');
	    seedProblems();
	  }).catch(function (data) {
	    return console.log(data.message);
	  });
	};

	// There are a variety of file system methods, all contained in the <answer>fs</answer> module

	// To ensure the stability of my tests, as well as for performance reasons, I can use .shallow() to render this component only one level deep:
	// const wrapper = shallow(<App />);


	// promise that resolves to hi === promise.then((hi) => {})


	// ____Enzyme
	// shallow Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.

	// mount Full DOM rendering is ideal for use cases where you have components that may interact with DOM APIs, or may require the full lifecycle in order to fully test the component (i.e., componentDidMount etc.)

	// Enzyme's render function is used to render react components to static HTML and analyze the resulting HTML structure.


	var seedProblems = function seedProblems() {
	  _init.db.none('INSERT INTO problems (explanation, type, content, courseId) VALUES (${explanation_1}, ${type_1}, ${content_1}, ${courseId_1})', {
	    explanation_1: 'some context to a problem',
	    type_1: 'ORDERED_MISSING_TEXT',
	    content_1: JSON.stringify({
	      text: ['<h1>first answer is ', null, ', </h1> anonymous functions in ruby are called <pre><code class="ruby"> ', null, '</code></pre>'],
	      answers: [{ answer: 'hi' }, { answer: 'hello' }]

	    }),
	    courseId_1: 1
	  }).then(function (data) {
	    log('problems');
	  }).catch(function (data) {
	    return console.log(data.message);
	  });
	};

	var log = function log(table) {
	  _init.db.any('SELECT id from ' + table).then(function (data) {
	    console.log('seeded ' + table + ': ' + data.map(function (column) {
	      return column.id;
	    }).join(', '));
	  }).catch(function (data) {
	    return console.log(data.message);
	  });
	};

	seedCourses();

/***/ },
/* 1 */,
/* 2 */,
/* 3 */,
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
	  database: 'memcode',
	  user: 'postgres',
	  password: '`1`1`1'
	};
	var db = pgPackage(connectionString);
	db.connect().then(function (obj) {
	  obj.done(); // success, release the connection;
	}).catch(function (error) {
	  console.log("ERROR:", error.message || error);
	});

	exports.db = db;

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("pg-promise");

/***/ }
/******/ ]);