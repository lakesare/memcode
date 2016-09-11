"use strict";

const pgp = require('pg-promise');
const pgPackage = pgp({});

import { db } from './init.js';

const seedCourses = () => {
  db.none('INSERT INTO courses (title) VALUES (${title_1}), (${title_2})', {
    title_1: 'Ruby',
    title_2: 'Python'
  })
    .then(() => {
      log('courses');
      seedProblems();
    })
    .catch((data) => console.log(data.message))
}



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
//     transaction.none('delete from courses where id=${courseId}', { courseId }),
//     transaction.none('delete from problems where courseId=${courseId}', { courseId })
//   ];
//   return transaction.batch(queries);
// }).then(() => { return { data: 'deleted' }
// }).catch((error) => { return { error } 
// })
// ```



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



const seedProblems = () => {
  db.none('INSERT INTO problems (explanation, type, content, courseId) VALUES (${explanation_1}, ${type_1}, ${content_1}, ${courseId_1})', {
    explanation_1: 'some context to a problem',
    type_1: 'ORDERED_MISSING_TEXT',
    content_1: JSON.stringify({
      text: ['<h1>first answer is ', null, ', </h1> anonymous functions in ruby are called <pre><code class="ruby"> ', null, '</code></pre>'],
      answers: [
        { answer: 'hi' },
        { answer: 'hello' }
      ]

    }),
    courseId_1: 1
  })
    .then((data) => {
      log('problems');
    })
    .catch((data) => console.log(data.message));
}

const log = (table) => {
  db.any(`SELECT id from ${table}`)
    .then((data) => {
      console.log(
        `seeded ${table}: ` + data.map((column) => column.id).join(', ')
      );
    })
    .catch((data) => console.log(data.message));
}

seedCourses();

