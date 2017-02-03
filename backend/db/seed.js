/* eslint-disable */
"use strict";

const pgp = require('pg-promise');
const pgPackage = pgp({});

import * as Course from '~/components/courses/model';
import * as User from '~/components/users/model';



const a = () => Course.createCourseWithProblems({ id: 5, title: 'Encryption',   userOauthId: '7578559',
  userOauthProvider: 'github' }, 
  [ 
    { id: 13,
      explanation: 'On the Internet, a digital signature is used not only to ensure that a message or document has been electronically signed by the person that purported to sign the document, but also, since a digital signature can only be created by one person, to ensure that a person cannot later deny that they furnished the signature.',
      type: null,
      content: '  <answer>repudiation</answer>   - denial of the truth or validity of something.\n\n',
      course_id: 5 },
    { id: 6,
      explanation: null,
      type: null,
      content: '\nto encrypt letter for someone, we take their key.\nto sign letter, we use our key.',
      course_id: 5 },
    { id: 14,
      explanation: null,
      type: null,
      content: '<ol>\n<li> user sends their username and password  to server </li>\n<li> server creates a JWT using the secret, and sends it to user </li>\n<li> user saves JWT in localStorage </li>\n<li> whenever the user wants to access a protected route, they should send the JWT, typically in the Authorization header using the Bearer schema.  \n    <code>Authorization: Bearer cn389ncoiwuencr</code>\n</li>\n<li> server checks for a valid JWT in the Authorization header (by generating a signature with their secret and comparing it to the one sent to it) </li>\n</ol>',
      course_id: 5 },
    { id: 11,
      explanation: null,
      type: null,
      content: '<ul>\n<li><strong>Encoding</strong> is for maintaining data <em>usability</em> and can be reversed by employing the same algorithm that encoded the content, i.e. no key is used. (ASCII, Unicode, URL Encoding, Base64)</li>\n\n<li><strong>Encryption</strong> is to transform data in order to keep it secret from others, e.g. sending someone a secret letter that only they should be able to read and requires the use of a key (kept secret) in order to return to plaintext. (RSA)</li>\n\n<li><strong>Hashing</strong> is for validating the <em>integrity</em> of content by detecting all modification thereof via obvious changes to the hash output, that is - signing. ( SHA-3, MD5)</li>\n\n<li><strong>Obfuscation</strong> is used to <em>prevent people from understanding</em> the meaning of something, and is often used with computer code to help prevent successful reverse engineering and/or theft of a product’s functionality. Obfuscation is not a strong control, but rather an obstacle.</li>\n</ul>',
      course_id: 5 },
    { id: 7,
      explanation: null,
      type: null,
      content: 'JWT:                      <answer>JSON</answer>                      Web Token',
      course_id: 5 },
    { id: 12,
      explanation: null,
      type: null,
      content: '<pre>\nCryptographic primitive | Hash |    MAC    | Digital\nSecurity Goal           |      |           | signature\n------------------------+------+-----------+-------------\nIntegrity               |  Yes |    Yes    |   Yes\nAuthentication          |  No  |    Yes    |   Yes\nNon-repudiation         |  No  |    No     |   Yes\n------------------------+------+-----------+-------------\nKind of keys            | none | symmetric | asymmetric\n                        |      |    keys   |    keys\n</pre>',
      course_id: 5 },
    { id: 8,
      explanation: 'Public claims  are the claims that we create ourselves (eg username).\nRegistered claims are not mandatory, but their names are reserved for us (eg iss (issuer), exp (expiration of token)).\nIt is important to understand that the purpose of using JWT is NOT to hide or obscure data in any way. The reason why JWT are used is to prove that the sent data was actually created by an authentic source.\nData inside a JWT is encoded and signed, not encrypted. ',
      type: null,
      content: 'JWT consists of 3 string divided by dot: <b>header.payload.signature</b>.\n<hr/>\n<h5>Header:</h5>\n<pre>\n{\n    "typ": "JWT", (          <answer>type</answer>          )  \n    "alg": "HS256" ( specifies which hashing algorithm is being used to create the JWT       <answer>signature</answer>        (HMAC SHA256 in this case))  \n}\n</pre>\nWe base64encode encode it, and get something like: <b>eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9</b>\n\n<hr/>\n\n<h5>Payload:</h5>\n<pre>\n{\n  "iss": "scotch.io",\n  "exp": 1300819380,\n  "name": "Jane",\n  "admin": true\n}\n</pre>\nOur example payload has two registered (iss, and exp) and two public          <answer>claim</answer>       s (name, admin).\n\n</hr>\n\n<h5>Signature:</h5>\n<pre>\ndata = base64Encode( header ) + “.” + base64Encode( payload )\nsignature = Hash( data, secret );\n</pre>',
      course_id: 5 }
  ]
)



const b = () => Course.createCourseWithProblems({ id: 1, title: 'Attacks',   userOauthId: '7578559',
  userOauthProvider: 'github' }, 
  [ { id: 1,
      explanation: 'What if only one of the scripts you use is compromised? Malicious JavaScript can be embedded on the page, and Web Storage is compromised. These types of XSS attacks can get everyone’s Web Storage that visits your site, without their knowledge.',
      type: 'ORDERED_MISSING_TEXT',
      content: ' cross-site scripting   <answer>XSS</answer>   is a type of vulnerability where an attacker can inject JavaScript that will run on your page. ',
      course_id: 1 } 
  ]
)






const c = () => Course.createCourseWithProblems(
  { id: 7, title: 'Oauth 2',   userOauthId: '7578559',
    userOauthProvider: 'github'  }
  , 
  [ { id: 16,
      explanation: null,
      type: null,
      content: 'Before you can begin the OAuth process, you must first register a new app with the service. <br>\nYou\'ll be given <b>client_     <answer>id</answer>     </b> and  <b>client_     <answer>secret</answer>     </b>  then.',
      course_id: 7 },
    { id: 15,
      explanation: null,
      type: null,
      content: '<h4>Oauth grant types:</h4>\n\n<ol>\n<li><b>Authorization Code Grant</b><br>\n\n\n\n</li>\n\n<li>\n<b>Implicit Grant</b><br>\nReturns an access token to JavaScript clients right away. No refresh tokens for long-lived access are returned, so use it for cases when you need a short-lived (few hours) access to someone\'s account.\n</li>\n\n<li>\n<b>Resource Owner Password Credentials Grant</b> <br>\ncredentials (and thus the password) are sent to the client and then to the authorization server. \n</li>\n\n<li>\n    <b>Client Credentials Grant</b> <br>\n     when the client is himself the resource owner\n</li>\n</ol>',
      course_id: 7 },
    { id: 18,
      explanation: null,
      type: null,
      content: 'As far as an OAuth client is concerned, it asked for a token, got a token, and eventually used that token to access some API.\n\nFrom a viewpoint of OpenID guys, authentication based on OAuth was not secure enough, but they had to admit that people preferred OAuth authentication. As a result,   <answer>OpenID</answer>   guys decided to define a new specification, OpenID Connect, on top of OAuth 2.0.\n',
      course_id: 7 },
    { id: 17,
      explanation: null,
      type: null,
      content: '<h4>Authorization Code grant type</h4>\n\nwe reate a "Log In" link sending the user to:\n\n<pre>\nhttps://oauth2server.com/auth?response_type=code&\n  client_id=CLIENT_ID&\n  redirect_uri=REDIRECT_URI&\n  scope=photos\n</pre>\n\nif user allows access, oauth server redirects user to <code>https://oauth2client.com/cb?code=AUTH_CODE_HERE</code>\n\nwe exchange <b>AUTH_CODE</b> for an <b>access token</b>.\n<pre>\nPOST https://api.oauth2server.com/token\n    grant_type=authorization_code&\n    code=AUTH_CODE_HERE&\n    redirect_uri=REDIRECT_URI&\n    client_id=CLIENT_ID&\n    client_secret=CLIENT_SECRET\n</pre>\n\n\nOauth server replies with an access token\n<pre>\n{\n    "access_token":"RsT5OjbzRn430zqMLgV3Ia"\n}\n</pre>\n\naccess token can now be used to access some API.',
      course_id: 7 } ]
  )


const d = () => Course.createCourseWithProblems(
{ id: 7,
  title: 'Gestalt',
  userOauthId: '7578559',
  userOauthProvider: 'github' }
,
[ { id: 16,
    explanation: '<img src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/Gestalt_closure.svg/220px-Gestalt_closure.svg.png">',
    type: null,
    content: 'gestalt principle of  <answer>closure</answer> : refers to the mind’s tendency to see complete figures or forms even if a picture is incomplete',
    courseId: 7 },
  { id: 15,
    explanation: '<img src="https://blog.usertesting.com/wp-content/uploads/2016/02/proximity.png">',
    type: null,
    content: 'principle of   <answer>proximity</answer>  : shapes that are close to one another appear to form groups\n',
    courseId: 7 } ]
)



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
const userPromise = User.createUserFromGithub({
  id: '7578559',
  username: 'lakesarerere'
});













userPromise.then(() => {
  Promise.all([a(), b(), c(), d()]).catch((error) => console.log(error.stack))
})



