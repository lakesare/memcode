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
/******/ ({

/***/ 0:
/***/ function(module, exports, __webpack_require__) {

	/* eslint-disable */
	"use strict";
	
	var _model = __webpack_require__(18);
	
	var Course = _interopRequireWildcard(_model);
	
	var _model2 = __webpack_require__(29);
	
	var User = _interopRequireWildcard(_model2);
	
	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }
	
	var pgp = __webpack_require__(20);
	var pgPackage = pgp({});
	
	var a = function a() {
	  return Course.createCourseWithProblems({ id: 5, title: 'Encryption', userOauthId: '7578559',
	    userOauthProvider: 'github' }, [{ id: 13,
	    explanation: 'On the Internet, a digital signature is used not only to ensure that a message or document has been electronically signed by the person that purported to sign the document, but also, since a digital signature can only be created by one person, to ensure that a person cannot later deny that they furnished the signature.',
	    type: null,
	    content: '  <answer>repudiation</answer>   - denial of the truth or validity of something.\n\n',
	    course_id: 5 }, { id: 6,
	    explanation: null,
	    type: null,
	    content: '\nto encrypt letter for someone, we take their key.\nto sign letter, we use our key.',
	    course_id: 5 }, { id: 14,
	    explanation: null,
	    type: null,
	    content: '<ol>\n<li> user sends their username and password  to server </li>\n<li> server creates a JWT using the secret, and sends it to user </li>\n<li> user saves JWT in localStorage </li>\n<li> whenever the user wants to access a protected route, they should send the JWT, typically in the Authorization header using the Bearer schema.  \n    <code>Authorization: Bearer cn389ncoiwuencr</code>\n</li>\n<li> server checks for a valid JWT in the Authorization header (by generating a signature with their secret and comparing it to the one sent to it) </li>\n</ol>',
	    course_id: 5 }, { id: 11,
	    explanation: null,
	    type: null,
	    content: '<ul>\n<li><strong>Encoding</strong> is for maintaining data <em>usability</em> and can be reversed by employing the same algorithm that encoded the content, i.e. no key is used. (ASCII, Unicode, URL Encoding, Base64)</li>\n\n<li><strong>Encryption</strong> is to transform data in order to keep it secret from others, e.g. sending someone a secret letter that only they should be able to read and requires the use of a key (kept secret) in order to return to plaintext. (RSA)</li>\n\n<li><strong>Hashing</strong> is for validating the <em>integrity</em> of content by detecting all modification thereof via obvious changes to the hash output, that is - signing. ( SHA-3, MD5)</li>\n\n<li><strong>Obfuscation</strong> is used to <em>prevent people from understanding</em> the meaning of something, and is often used with computer code to help prevent successful reverse engineering and/or theft of a product’s functionality. Obfuscation is not a strong control, but rather an obstacle.</li>\n</ul>',
	    course_id: 5 }, { id: 7,
	    explanation: null,
	    type: null,
	    content: 'JWT:                      <answer>JSON</answer>                      Web Token',
	    course_id: 5 }, { id: 12,
	    explanation: null,
	    type: null,
	    content: '<pre>\nCryptographic primitive | Hash |    MAC    | Digital\nSecurity Goal           |      |           | signature\n------------------------+------+-----------+-------------\nIntegrity               |  Yes |    Yes    |   Yes\nAuthentication          |  No  |    Yes    |   Yes\nNon-repudiation         |  No  |    No     |   Yes\n------------------------+------+-----------+-------------\nKind of keys            | none | symmetric | asymmetric\n                        |      |    keys   |    keys\n</pre>',
	    course_id: 5 }, { id: 8,
	    explanation: 'Public claims  are the claims that we create ourselves (eg username).\nRegistered claims are not mandatory, but their names are reserved for us (eg iss (issuer), exp (expiration of token)).\nIt is important to understand that the purpose of using JWT is NOT to hide or obscure data in any way. The reason why JWT are used is to prove that the sent data was actually created by an authentic source.\nData inside a JWT is encoded and signed, not encrypted. ',
	    type: null,
	    content: 'JWT consists of 3 string divided by dot: <b>header.payload.signature</b>.\n<hr/>\n<h5>Header:</h5>\n<pre>\n{\n    "typ": "JWT", (          <answer>type</answer>          )  \n    "alg": "HS256" ( specifies which hashing algorithm is being used to create the JWT       <answer>signature</answer>        (HMAC SHA256 in this case))  \n}\n</pre>\nWe base64encode encode it, and get something like: <b>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</b>\n\n<hr/>\n\n<h5>Payload:</h5>\n<pre>\n{\n  "iss": "scotch.io",\n  "exp": 1300819380,\n  "name": "Jane",\n  "admin": true\n}\n</pre>\nOur example payload has two registered (iss, and exp) and two public          <answer>claim</answer>       s (name, admin).\n\n</hr>\n\n<h5>Signature:</h5>\n<pre>\ndata = base64Encode( header ) + “.” + base64Encode( payload )\nsignature = Hash( data, secret );\n</pre>',
	    course_id: 5 }]);
	};
	
	var b = function b() {
	  return Course.createCourseWithProblems({ id: 1, title: 'Attacks', userOauthId: '7578559',
	    userOauthProvider: 'github' }, [{ id: 1,
	    explanation: 'What if only one of the scripts you use is compromised? Malicious JavaScript can be embedded on the page, and Web Storage is compromised. These types of XSS attacks can get everyone’s Web Storage that visits your site, without their knowledge.',
	    type: 'ORDERED_MISSING_TEXT',
	    content: ' cross-site scripting   <answer>XSS</answer>   is a type of vulnerability where an attacker can inject JavaScript that will run on your page. ',
	    course_id: 1 }]);
	};
	
	var c = function c() {
	  return Course.createCourseWithProblems({ id: 7, title: 'Oauth 2', userOauthId: '7578559',
	    userOauthProvider: 'github' }, [{ id: 16,
	    explanation: null,
	    type: null,
	    content: 'Before you can begin the OAuth process, you must first register a new app with the service. <br>\nYou\'ll be given <b>client_     <answer>id</answer>     </b> and  <b>client_     <answer>secret</answer>     </b>  then.',
	    course_id: 7 }, { id: 15,
	    explanation: null,
	    type: null,
	    content: '<h4>Oauth grant types:</h4>\n\n<ol>\n<li><b>Authorization Code Grant</b><br>\n\n\n\n</li>\n\n<li>\n<b>Implicit Grant</b><br>\nReturns an access token to JavaScript clients right away. No refresh tokens for long-lived access are returned, so use it for cases when you need a short-lived (few hours) access to someone\'s account.\n</li>\n\n<li>\n<b>Resource Owner Password Credentials Grant</b> <br>\ncredentials (and thus the password) are sent to the client and then to the authorization server. \n</li>\n\n<li>\n    <b>Client Credentials Grant</b> <br>\n     when the client is himself the resource owner\n</li>\n</ol>',
	    course_id: 7 }, { id: 18,
	    explanation: null,
	    type: null,
	    content: 'As far as an OAuth client is concerned, it asked for a token, got a token, and eventually used that token to access some API.\n\nFrom a viewpoint of OpenID guys, authentication based on OAuth was not secure enough, but they had to admit that people preferred OAuth authentication. As a result,   <answer>OpenID</answer>   guys decided to define a new specification, OpenID Connect, on top of OAuth 2.0.\n',
	    course_id: 7 }, { id: 17,
	    explanation: null,
	    type: null,
	    content: '<h4>Authorization Code grant type</h4>\n\nwe reate a "Log In" link sending the user to:\n\n<pre>\nhttps://oauth2server.com/auth?response_type=code&\n  client_id=CLIENT_ID&\n  redirect_uri=REDIRECT_URI&\n  scope=photos\n</pre>\n\nif user allows access, oauth server redirects user to <code>https://oauth2client.com/cb?code=AUTH_CODE_HERE</code>\n\nwe exchange <b>AUTH_CODE</b> for an <b>access token</b>.\n<pre>\nPOST https://api.oauth2server.com/token\n    grant_type=authorization_code&\n    code=AUTH_CODE_HERE&\n    redirect_uri=REDIRECT_URI&\n    client_id=CLIENT_ID&\n    client_secret=CLIENT_SECRET\n</pre>\n\n\nOauth server replies with an access token\n<pre>\n{\n    "access_token":"RsT5OjbzRn430zqMLgV3Ia"\n}\n</pre>\n\naccess token can now be used to access some API.',
	    course_id: 7 }]);
	};
	
	var d = function d() {
	  return Course.createCourseWithProblems({ id: 7,
	    title: 'Gestalt',
	    userOauthId: '7578559',
	    userOauthProvider: 'github' }, [{ id: 16,
	    explanation: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Gestalt_closure.svg/220px-Gestalt_closure.svg.png">',
	    type: null,
	    content: 'gestalt principle of  <answer>closure</answer> : refers to the mind’s tendency to see complete figures or forms even if a picture is incomplete',
	    courseId: 7 }, { id: 15,
	    explanation: '<img src="https://blog.usertesting.com/wp-content/uploads/2016/02/proximity.png">',
	    type: null,
	    content: 'principle of   <answer>proximity</answer>  : shapes that are close to one another appear to form groups\n',
	    courseId: 7 }]);
	};
	
	// There are a variety of file system methods, all contained in the <answer>fs</answer> module
	
	
	// promise that resolves to hi === promise.then((hi) => {})
	
	
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
	
	
	// const log = (table) => {
	//   db.any(`SELECT id from ${table}`)
	//     .then((data) => {
	//       console.log(
	//         `seeded ${table}: ` + data.map((column) => column.id).join(', ')
	//       );
	//     })
	//     .catch((data) => console.log(data.message));
	// };
	
	
	// first seeding our user to avoid violating foreign key constraint
	var userPromise = User.createUserFromGithub({
	  id: '7578559',
	  username: 'lakesarerere'
	});
	
	userPromise.then(function () {
	  Promise.all([a(), b(), c(), d()]).catch(function (error) {
	    return console.log(error.stack);
	  });
	});

/***/ },

/***/ 18:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getCourses = exports.update = exports.deleteCourseWithProblems = exports.getCourseWithProblems = exports.createCourseWithProblems = undefined;
	
	var _init = __webpack_require__(19);
	
	var _model = __webpack_require__(21);
	
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
	
	var update = function update(course) {
	  return _init.db.any('UPDATE courses SET title = ${title} WHERE id = ${id}', {
	    title: course.title, id: course.id
	  });
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
	exports.update = update;
	exports.getCourses = getCourses;

/***/ },

/***/ 19:
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

/***/ 20:
/***/ function(module, exports) {

	module.exports = require("pg-promise");

/***/ },

/***/ 21:
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.updateProblems = exports.deleteProblems = exports.createProblems = exports.deleteProblem = undefined;
	
	var _init = __webpack_require__(19);
	
	var _problemContentFromParamsToDb = __webpack_require__(22);
	
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

/***/ 22:
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	// input: "<h1></h1>"
	
	// output: "text: ['<h1>first answer is ', null, ', </h1> anonymous functions in ruby are called <pre><code class="ruby"> ', null, '</code></pre>'],
	// answers: [ 'hi', 'hello' ]
	var problemContentFromParamsToDb = function problemContentFromParamsToDb(content) {
	  var text = [];
	  var answers = [];
	
	  var contentRemaining = content;
	
	  while (contentRemaining.length > 0) {
	    var nextSubstringOfProblemParsed = findNextAnswer(contentRemaining);
	    text.push(nextSubstringOfProblemParsed.textPiece);
	    if (nextSubstringOfProblemParsed.answer !== null) {
	      answers.push(nextSubstringOfProblemParsed.answer);
	      text.push(null);
	    }
	    contentRemaining = nextSubstringOfProblemParsed.newContentRemaining;
	  }
	
	  return JSON.stringify({ answers: answers, text: text });
	};
	
	var findNextAnswer = function findNextAnswer(contentRemaining) {
	  var answerOpens = contentRemaining.indexOf('<answer>');
	  var answerCloses = contentRemaining.indexOf('</answer>');
	
	  var _ref = answerOpens === -1 ? {
	    textPiece: contentRemaining,
	    answer: null,
	    newContentRemaining: ''
	  } : {
	    textPiece: contentRemaining.slice(0, answerOpens),
	    answer: contentRemaining.slice(answerOpens + '<answer>'.length, answerCloses),
	    newContentRemaining: contentRemaining.slice(answerCloses + '</answer>'.length)
	  },
	      textPiece = _ref.textPiece,
	      answer = _ref.answer,
	      newContentRemaining = _ref.newContentRemaining;
	
	  return { textPiece: textPiece, answer: answer, newContentRemaining: newContentRemaining };
	};
	
	exports.problemContentFromParamsToDb = problemContentFromParamsToDb;

/***/ },

/***/ 29:
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

/******/ });
//# sourceMappingURL=seed.js.map