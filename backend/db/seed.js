/* eslint-disable */
"use strict";

const pgp = require('pg-promise');
const pgPackage = pgp({});

import * as Course from '~/components/courses/model';
import * as User from '~/components/users/model';


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





// ___WEBPACK
// The url-loader works like the file-loader, but can return a Data URL if the file is smaller than a byte limit.

// part of css-loader functionality is seeing background: url('../pics/hi.png')
// this functionality can be turned off, but we may want to use it because eg image-loader allows us to compress images.



