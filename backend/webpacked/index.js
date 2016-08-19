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

	var _bodyParser = __webpack_require__(4);

	var _bodyParser2 = _interopRequireDefault(_bodyParser);

	var _routes = __webpack_require__(6);

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
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.db = undefined;

	var _pgPromise = __webpack_require__(3);

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
/* 3 */
/***/ function(module, exports) {

	module.exports = require("pg-promise");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 5 */,
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.router = undefined;

	var _express = __webpack_require__(1);

	var _express2 = _interopRequireDefault(_express);

	var _init = __webpack_require__(2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var router = _express2.default.Router();

	router.get('/:id', function (request, response) {
	  var problems = _init.db.any('select * from problems where courseId = ${courseId}', {
	    courseId: request.params.id
	  }).then(function (data) {
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
	  response.json(request.body);
	});

	exports.router = router;

/***/ }
/******/ ]);