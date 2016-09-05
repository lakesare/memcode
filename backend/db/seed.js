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

// To ensure the stability of my tests, as well as for performance reasons, I can use .shallow() to render this component only one level deep:
// const wrapper = shallow(<App />);


// promise that resolves to hi === promise.then((hi) => {})






// ____Enzyme
// shallow Shallow rendering is useful to constrain yourself to testing a component as a unit, and to ensure that your tests aren't indirectly asserting on behavior of child components.

// mount Full DOM rendering is ideal for use cases where you have components that may interact with DOM APIs, or may require the full lifecycle in order to fully test the component (i.e., componentDidMount etc.)

// Enzyme's render function is used to render react components to static HTML and analyze the resulting HTML structure.




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

