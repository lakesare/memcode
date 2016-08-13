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




const seedProblems = () => {
  db.none('INSERT INTO problems (explanation, type, content, courseId) VALUES (${explanation_1}, ${type_1}, ${content_1}, ${courseId_1})', {
    explanation_1: 'some context to a problem',
    type_1: 'ORDERED_MISSING_TEXT',
    content_1: JSON.stringify({
      text: ['first answer is ', null, ', second answer is ', null],
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

