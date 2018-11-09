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
/******/ 	return __webpack_require__(__webpack_require__.s = 74);
/******/ })
/************************************************************************/
/******/ ({

/***/ 15:
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

/***/ 16:
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

/***/ 74:
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _chai = __webpack_require__(8);

var _getNextScore = __webpack_require__(15);

var _initialScore = __webpack_require__(16);

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

describe('getNextScore', function () {
  it('all 5 rating', function () {
    var score = (0, _initialScore.initialScore)();
    var intervals = generateNReviews(score, 5, 10);

    (0, _chai.expect)(intervals).to.deep.equal([0, 1, 9, 23, 47, 83, 133, 200, 286, 300]);
  });

  it('all 4 ratings', function () {
    var score = (0, _initialScore.initialScore)();
    var intervals = generateNReviews(score, 4, 10);

    (0, _chai.expect)(intervals).to.deep.equal([0, 1, 7, 17, 31, 51, 77, 108, 145, 188]);
  });

  it('all 0 ratings', function () {
    var score = (0, _initialScore.initialScore)();
    var intervals = generateNReviews(score, 0, 10);

    (0, _chai.expect)(intervals).to.deep.equal([0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
  });

  it('different ratings', function () {
    var score = (0, _initialScore.initialScore)();
    var intervals = [];
    intervals.push.apply(intervals, _toConsumableArray(generateNReviews(score, 5.0, 5)));
    intervals.push.apply(intervals, _toConsumableArray(generateNReviews(score, 3.0, 3)));
    intervals.push.apply(intervals, _toConsumableArray(generateNReviews(score, 4.0, 5)));

    (0, _chai.expect)(intervals).to.deep.equal([0, 1, 9, 23, 47, 0, 0, 0, 0, 1, 7, 18, 34]);
  });
});

var generateNReviews = function generateNReviews(score, performanceRating, n) {
  var intervals = [];
  for (var i = 0; i < n; i++) {
    var nextScore = (0, _getNextScore.getNextScore)(score.easiness, score.consecutiveCorrectAnswers, performanceRating);
    intervals.push(Math.floor(nextScore.daysToNextReview));
    score.easiness = nextScore.easiness;
    score.consecutiveCorrectAnswers = nextScore.consecutiveCorrectAnswers;
  }
  return intervals;
};

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

module.exports = require("chai");

/***/ })

/******/ });
//# sourceMappingURL=getNextScore.test.js.map