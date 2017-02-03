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
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
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
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(1);
	module.exports = __webpack_require__(2);


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("babel-polyfill");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	__webpack_require__(3);
	
	var _express = __webpack_require__(9);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _prettyError = __webpack_require__(10);
	
	var _allowCrossDomain = __webpack_require__(12);
	
	var _stopPropagationForAssets = __webpack_require__(13);
	
	var _bodyParser = __webpack_require__(14);
	
	var _bodyParser2 = _interopRequireDefault(_bodyParser);
	
	var _static = __webpack_require__(15);
	
	var _ourSession = __webpack_require__(16);
	
	var _routes = __webpack_require__(18);
	
	var _routes2 = __webpack_require__(26);
	
	var _routes3 = __webpack_require__(27);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var app = (0, _express2.default)();
	var port = 3000;
	
	app.use(_allowCrossDomain.allowCrossDomain);
	
	app.use(_stopPropagationForAssets.stopPropagationForAssets);
	
	app.use(_bodyParser2.default.json()); // to support JSON-encoded bodies
	
	app.use(_static.staticAssets);
	
	app.use(_ourSession.ourSession);
	
	// routes
	
	app.use('/api/courses', _routes.router);
	
	app.use('/api/problems', _routes2.router);
	
	app.use('/auth', _routes3.router);
	
	// setting current user
	// app.use((req, res, next) => {
	//   req.session.currentUser = req.user
	//   res.cookie('currentUser', JSON.stringify(req.user))
	//   next();
	// })
	
	app.get('*', function (req, res) {
	  return res.sendFile('/home/lakesare/Desktop/memcode/frontend/webpacked/index.html');
	});
	
	app.listen(port, function (err) {
	  if (err) {
	    console.log('something bad happened', err);
	  }
	  console.log('server is listening on ' + port);
	});

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	__webpack_require__(4).install();


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var SourceMapConsumer = __webpack_require__(5).SourceMapConsumer;
	var path = __webpack_require__(6);
	
	var fs;
	try {
	  fs = __webpack_require__(7);
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
	       return null;
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
	      Module = __webpack_require__(8);
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


/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("source-map");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("module");

/***/ },
/* 9 */
/***/ function(module, exports) {

	module.exports = require("express");

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.prettyError = undefined;
	
	var _prettyError = __webpack_require__(11);
	
	var _prettyError2 = _interopRequireDefault(_prettyError);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var prettyError = new _prettyError2.default();
	prettyError.skipPackage('express');
	prettyError.alias('/home/lakesare/Desktop/memcode/backend/webpacked/webpack:', 'backend');
	prettyError.appendStyle({
	  // this is a simple selector to the element that says 'Error'
	  'pretty-error > header': {
	    display: 'block',
	    marginTop: 3
	  },
	  'pretty-error > header > title > kind': {
	    background: 'black',
	    color: 'bright-red'
	  }
	});
	prettyError.start();
	
	exports.prettyError = prettyError;

/***/ },
/* 11 */
/***/ function(module, exports) {

	module.exports = require("pretty-error");

/***/ },
/* 12 */
/***/ function(module, exports) {

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

/***/ },
/* 13 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// https://github.com/jaredhanson/passport/issues/14#issuecomment-21863553
	var stopPropagationForAssets = function stopPropagationForAssets(req, res, next) {
	  if (req.url != '/favicon.ico' && req.url != '/styles.css') {
	    return next();
	  } else {
	    res.status(200);
	    res.header('Cache-Control', 'max-age=4294880896');
	    res.end();
	  }
	};
	
	exports.stopPropagationForAssets = stopPropagationForAssets;

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = require("body-parser");

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.staticAssets = undefined;
	
	var _express = __webpack_require__(9);
	
	var _express2 = _interopRequireDefault(_express);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var staticAssets = _express2.default.static('/home/lakesare/Desktop/memcode/frontend/webpacked'); // (global routes, because path.join didn't work after update to webpacked ES6)
	// serve our static stuff like index.css
	exports.staticAssets = staticAssets;

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.ourSession = undefined;
	
	var _expressSession = __webpack_require__(17);
	
	var _expressSession2 = _interopRequireDefault(_expressSession);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var ourSession = (0, _expressSession2.default)({
	  secret: 'keyboard cat',
	  resave: true,
	  saveUninitialized: true
	});
	
	exports.ourSession = ourSession;

/***/ },
/* 17 */
/***/ function(module, exports) {

	module.exports = require("express-session");

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.router = undefined;
	
	var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };
	
	var _express = __webpack_require__(9);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _model = __webpack_require__(21);
	
	var Course = _interopRequireWildcard(_model);
	
	var _authenticate = __webpack_require__(24);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
	
	var router = _express2.default.Router();
	
	router.get('/:id', function (request, response) {
	  Course.getCourseWithProblems(request.params.id).then(function (data) {
	    response.status(200).json(data);
	  }).catch(function (data) {
	    response.status(500).json({ error: data.message });
	  });
	});
	
	// catch Async Await function's error
	var catchAsync = function catchAsync(asyncFunction) {
	  return function (request, response, next) {
	    var promise = asyncFunction(request, response, next);
	    promise.catch(function (error) {
	      return next(error);
	    });
	  };
	};
	
	router.get('/', catchAsync(function () {
	  var _ref = _asyncToGenerator(regeneratorRuntime.mark(function _callee(request, response) {
	    var courses;
	    return regeneratorRuntime.wrap(function _callee$(_context) {
	      while (1) {
	        switch (_context.prev = _context.next) {
	          case 0:
	            _context.next = 2;
	            return Course.getCourses();
	
	          case 2:
	            courses = _context.sent;
	
	            response.json(courses);
	
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
	
	router.use(function (error, request, response) {
	  console.error(error);
	  response.status(500).json({ error: error.message });
	});
	
	router.post('/', _authenticate.authenticateMiddleware, function (request, response) {
	  var course = _extends({}, request.body["course"], {
	    userOauthId: request.currentUser.oauthId,
	    userOauthProvider: request.currentUser.oauthProvider
	  });
	
	  Course.createCourseWithProblems(course, request.body["problems"]).then(function (courseIdMap) {
	    response.status(200).json({
	      data: courseIdMap
	    });
	  }).catch(function (error) {
	    response.status(500).json({ error: error.message });
	  });
	});
	
	router.put('/:id', function (request, response) {
	  var result = Course.updateCourseWithProblems(request.body["course"], request.body["problems"]);
	
	  console.log("\n\n\n");
	  var a = JSON.parse(JSON.stringify(request.body["course"]));
	  var b = JSON.parse(JSON.stringify(request.body["problems"]));
	  console.log("Course.createCourseWithProblems(");
	  console.log(a);
	  console.log(', ');
	  console.log(b);
	  console.log(')');
	  console.log("\n\n\n");
	
	  result.then(function () {
	    response.status(200).json({ data: true });
	  }).catch(function (error) {
	    response.status(500).json({ error: error.message });
	  });
	});
	
	router.delete('/:id', function (request, response) {
	  Course.deleteCourseWithProblems(request.params.id).then(function () {
	    response.status(200).json();
	  }).catch(function (error) {
	    response.status(500).json(error);
	  });
	});
	
	exports.router = router;

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.db = undefined;
	
	var _pgPromise = __webpack_require__(20);
	
	var pgPromise = _interopRequireWildcard(_pgPromise);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	// for pgOptions
	var camelizeColumns = function camelizeColumns(data) {
	  var template = data[0];
	  for (var prop in template) {
	    var camel = pgPromise.utils.camelize(prop);
	    if (!(camel in template)) {
	      for (var i = 0; i < data.length; i++) {
	        var d = data[i];
	        d[camel] = d[prop];
	        delete d[prop];
	      }
	    }
	  }
	};
	
	var pgOptions = {
	  query: function query(e) {
	    var cyan = "\x1b[36m%s\x1b[0m";
	    console.log(cyan, e.query); // log the query being executed
	  },
	  receive: function receive(data, result, e) {
	    camelizeColumns(data);
	  } // https://coderwall.com/p/irklcq
	};
	
	var pgPackage = pgPromise.default(pgOptions);
	
	var isTest = function isTest() {
	  return process.env.NODE_ENV === 'test';
	};
	
	var connectionString = {
	  host: 'localhost', // 'localhost' is the default;
	  port: 5432, // 5432 is the default;
	  database: isTest() ? 'memcode_test' : 'memcode',
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
/* 20 */
/***/ function(module, exports) {

	module.exports = require("pg-promise");

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getCourses = exports.updateCourseWithProblems = exports.deleteCourseWithProblems = exports.getCourseWithProblems = exports.createCourseWithProblems = undefined;
	
	var _init = __webpack_require__(19);
	
	var _model = __webpack_require__(22);
	
	// course: {title: "aaa"}
	// problems: [{content: "a", explanation: "aa"}]
	// => { courseId: 5 }
	var createCourseWithProblems = function createCourseWithProblems(course, problems) {
	  // { validation: 'failed fields' }
	  var courseId = null;
	  return _init.db.one("insert into courses (title, user_oauth_id, user_oauth_provider) values (${title}, ${userOauthId}, ${userOauthProvider}) RETURNING id", course).then(function (course) {
	    courseId = course.id;
	    return _init.db.tx(function (transaction) {
	      var queries = [];
	      (0, _model.createProblems)(transaction, queries, problems, courseId);
	      return transaction.batch(queries);
	    });
	  }).then(function () {
	    return { courseId: courseId };
	  });
	};
	
	var getCourses = function getCourses() {
	  return _init.db.any('\
	    SELECT courses.*, COUNT(*) AS "amount_of_problems"\
	    FROM courses\
	      LEFT OUTER JOIN problems ON problems.course_id=courses.id\
	    GROUP BY courses.id;\
	  ');
	};
	
	var updateCourseWithProblems = function updateCourseWithProblems(newCourse, newProblems) {
	  return getCourseWithProblems(newCourse.id).then(function (data) {
	
	    var oldCourse = data.data.course;
	    var oldProblems = data.data.problems;
	
	    return _init.db.tx(function (transaction) {
	      var queries = [];
	
	      var oldProblemIdsToDelete = oldProblems.filter(function (oldProblem) {
	        return !newProblems.find(function (newProblem) {
	          return newProblem.id === oldProblem.id;
	        });
	      }).map(function (oldProblem) {
	        return oldProblem.id;
	      });
	
	      var newProblemsToCreate = newProblems.filter(function (newProblem) {
	        return !newProblem.id;
	      });
	
	      updateCourse(transaction, queries, oldCourse, newCourse);
	      (0, _model.deleteProblems)(transaction, queries, oldProblemIdsToDelete);
	      (0, _model.createProblems)(transaction, queries, newProblemsToCreate, oldCourse.id);
	      (0, _model.updateProblems)(transaction, queries, newProblems, oldProblems);
	
	      return transaction.batch(queries);
	    });
	  });
	};
	
	var updateCourse = function updateCourse(transaction, queries, oldCourse, newCourse) {
	  if (oldCourse.title !== newCourse.title) {
	    queries.push(transaction.any('UPDATE courses SET title = ${title} WHERE id = ${id}', { title: newCourse.title, id: oldCourse.id }));
	  }
	};
	
	var getCourseWithProblems = function getCourseWithProblems(courseId) {
	  return Promise.all([_init.db.one('select * from courses where id = ${courseId}', { courseId: courseId }), _init.db.any('select * from problems where course_id = ${courseId}', { courseId: courseId })]).then(function (values) {
	    return {
	      data: {
	        course: values[0],
	        problems: values[1]
	      }
	    };
	  });
	};
	
	var deleteCourseWithProblems = function deleteCourseWithProblems(courseId) {
	  return _init.db.tx(function (transaction) {
	    return transaction.batch([transaction.none('delete from problems where course_id=${courseId}', { courseId: courseId }), transaction.none('delete from courses where id=${courseId}', { courseId: courseId })]);
	  }).then(function () {
	    return { data: true };
	  }).catch(function (error) {
	    return Promise.reject({ error: error });
	  });
	};
	
	exports.createCourseWithProblems = createCourseWithProblems;
	exports.getCourseWithProblems = getCourseWithProblems;
	exports.deleteCourseWithProblems = deleteCourseWithProblems;
	exports.updateCourseWithProblems = updateCourseWithProblems;
	exports.getCourses = getCourses;

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updateProblems = exports.deleteProblems = exports.createProblems = exports.deleteProblem = undefined;
	
	var _init = __webpack_require__(19);
	
	var _problemContentFromParamsToDb = __webpack_require__(23);
	
	var deleteProblem = function deleteProblem(id) {
	  return _init.db.none('delete from problems where id=${id}', { id: id });
	};
	
	// problems: [{content: "a", explanation: "aa"}]
	var deleteProblems = function deleteProblems(transaction, queries, problemIds) {
	  problemIds.forEach(function (id) {
	    queries.push(transaction.none('delete from problems where id=${id}', { id: id }));
	  });
	};
	
	var createProblems = function createProblems(transaction, queries, problemsToCreate, courseId) {
	  problemsToCreate.forEach(function (problem) {
	    queries.push(transaction.none("insert into problems (content, explanation, course_id) values (${content}, ${explanation}, ${courseId})", {
	      content: (0, _problemContentFromParamsToDb.problemContentFromParamsToDb)(problem.content),
	      explanation: problem.explanation,
	      courseId: courseId
	    }));
	  });
	};
	
	var updateProblems = function updateProblems(transaction, queries, newProblems, oldProblems) {
	  oldProblems.forEach(function (oldProblem) {
	    var newProblem = newProblems.find(function (possibleNewProblem) {
	      return possibleNewProblem.id === oldProblem.id;
	    });
	
	    if (!newProblem) {
	      return;
	    }
	
	    if (oldProblem.explanation !== newProblem.explanation) {
	      queries.push(transaction.any('UPDATE problems SET explanation = ${explanation} WHERE id = ${id}', {
	        explanation: newProblem.explanation, id: oldProblem.id
	      }));
	    }
	
	    var oldContentString = JSON.stringify(oldProblem.content);
	    var newContentString = (0, _problemContentFromParamsToDb.problemContentFromParamsToDb)(newProblem.content);
	
	    // if existing problem changed its content, it's freaking another problem now. so let's delete associated points with it.
	    if (oldContentString !== newContentString) {
	      queries.push(transaction.any('UPDATE problems SET content = ${content} WHERE id = ${id}', { content: newContentString, id: oldProblem.id }));
	    }
	  });
	};
	
	exports.deleteProblem = deleteProblem;
	exports.createProblems = createProblems;
	exports.deleteProblems = deleteProblems;
	exports.updateProblems = updateProblems;

/***/ },
/* 23 */
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
	  },
	      textPiece = _ref.textPiece,
	      answer = _ref.answer,
	      newContentRemaining = _ref.newContentRemaining;
	
	  return { textPiece: textPiece, answer: answer, newContentRemaining: newContentRemaining };
	};
	
	exports.problemContentFromParamsToDb = problemContentFromParamsToDb;

/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.authenticateMiddleware = undefined;
	
	var _jsonwebtoken = __webpack_require__(25);
	
	var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var authenticateMiddleware = function authenticateMiddleware(request, response, next) {
	  if (request.headers['authorization']) {
	    var token = request.headers['authorization'].split('Bearer ')[1];
	    _jsonwebtoken2.default.verify(token, 'serverereSecretty', function (error, user) {
	      if (error) {
	        response.status(403).json({ error: error });
	      } else {
	        request.currentUser = user;
	        next();
	      }
	    });
	  } else {
	    response.status(403).json({ error: "No authorization header provided" });
	  }
	};
	
	exports.authenticateMiddleware = authenticateMiddleware;

/***/ },
/* 25 */
/***/ function(module, exports) {

	module.exports = require("jsonwebtoken");

/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.router = undefined;
	
	var _express = __webpack_require__(9);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _model = __webpack_require__(22);
	
	var Problem = _interopRequireWildcard(_model);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var router = _express2.default.Router();
	
	router.delete('/:id', function (request, response) {
	  Problem.deleteProblem(request.params.id).then(function () {
	    response.status(200).json();
	  }).catch(function (error) {
	    response.status(500).json(error);
	  });
	});
	
	exports.router = router;

/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.router = undefined;
	
	var _express = __webpack_require__(9);
	
	var _express2 = _interopRequireDefault(_express);
	
	var _jsonwebtoken = __webpack_require__(25);
	
	var _jsonwebtoken2 = _interopRequireDefault(_jsonwebtoken);
	
	var _formData = __webpack_require__(28);
	
	var _formData2 = _interopRequireDefault(_formData);
	
	var _nodeFetch = __webpack_require__(29);
	
	var _nodeFetch2 = _interopRequireDefault(_nodeFetch);
	
	var _model = __webpack_require__(30);
	
	var User = _interopRequireWildcard(_model);
	
	var _init = __webpack_require__(19);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var router = _express2.default.Router();
	
	var github = {
	  clientId: '1d94a714bab1f1576872',
	  clientSecret: 'cfd3be4dfba0dea31889e869e2eaf7dd3418ee5f',
	  callbackURL: 'http://localhost:3000/auth/github/callback'
	};
	
	// 1. after user goes to github.com/login/oauth/authorize?client_id=OUR_ID, she is redirected here 
	router.get('/github/callback', function (req, res) {
	  // getting access token by sending github authorization code that will prove to github that it's indeed
	  // we are the application (client_id, client_secret) that user gave access to
	  var data = new _formData2.default();
	  data.append('client_id', github.clientId);
	  data.append('client_secret', github.clientSecret);
	  data.append('code', req.query.code);
	
	  (0, _nodeFetch2.default)('https://github.com/login/oauth/access_token', {
	    method: 'POST',
	    body: data
	  }).then(function (response) {
	    return response.ok ? response.text() : Promise.reject(response);
	  }).then(function (response) {
	    // 'access_token=0bc4d5757978a90d8e9bc96fac795c876179f2ba&scope=&token_type=bearer'
	    var accessToken = response.split('access_token=')[1].split('&scope')[0];
	
	    // fetching our profile info signed in as a user (access token)
	    return (0, _nodeFetch2.default)('https://api.github.com/user', {
	      headers: {
	        Authorization: 'token ' + accessToken
	      }
	    }).then(function (response) {
	      return response.json();
	    }).then(function (accountReturnedFromGithub) {
	      // now that we are sure our user is this github's user, let's
	      return _init.db.oneOrNone("SELECT * FROM users WHERE oauth_provider=${oauth_provider} AND oauth_id=${oauth_id}", {
	        oauth_provider: 'github',
	        oauth_id: accountReturnedFromGithub.id.toString()
	      }).then(function (existingUser) {
	        if (existingUser) {
	          // user with this github_id is already in our db! sign in.
	          var token = _jsonwebtoken2.default.sign(existingUser, 'serverereSecretty');
	          console.log({ existingUser: existingUser, token: token });
	          redirectWithToken(res, token);
	        } else {
	          // no users with this id found! create such user and sign in.
	          return _init.db.one("INSERT INTO users(oauth_provider, oauth_id, username, avatar_url) VALUES(${oauth_provider}, ${oauth_id}, ${username}, ${avatar_url}) RETURNING *", {
	            oauth_provider: 'github',
	            oauth_id: accountReturnedFromGithub.id.toString(),
	            username: accountReturnedFromGithub.login,
	            avatar_url: accountReturnedFromGithub.avatar_url
	          }).then(function (createdUser) {
	            var token = _jsonwebtoken2.default.sign(createdUser, 'serverereSecretty');
	            redirectWithToken(res, token);
	          });
	        }
	      });
	    });
	  }).catch(function (error) {
	    return console.log(error.stack ? error.stack : error);
	  });
	});
	
	// let's put token into header, so that we don't have to display the query string and the delete it
	// nope, because turns out we can't see headers on initial page load
	var redirectWithToken = function redirectWithToken(res, token) {
	  return res.redirect('/?token=' + token);
	};
	
	exports.router = router;

/***/ },
/* 28 */
/***/ function(module, exports) {

	module.exports = require("form-data");

/***/ },
/* 29 */
/***/ function(module, exports) {

	module.exports = require("node-fetch");

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.createUserFromGithub = exports.getUserByOauth = undefined;
	
	var _init = __webpack_require__(19);
	
	// getUserByOauth('github', 7578559)
	// => user
	var getUserByOauth = function getUserByOauth(oauthProvider, oauthId) {
	  return _init.db.oneOrNone("select * from users where oauth_provider=${oauthProvider} and oauth_id=${oauthId}", { oauthProvider: oauthProvider, oauthId: oauthId });
	};
	
	var createUserFromGithub = function createUserFromGithub(profile) {
	  return _init.db.none("insert into users (oauth_provider, oauth_id, username) values (${oauthProvider}, ${oauthId}, ${username})", {
	    oauthProvider: 'github',
	    oauthId: profile.id,
	    username: profile.username
	  });
	};
	
	exports.getUserByOauth = getUserByOauth;
	exports.createUserFromGithub = createUserFromGithub;

/***/ }
/******/ ]);
//# sourceMappingURL=index.js.map