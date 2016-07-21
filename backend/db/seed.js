"use strict";

const pgp = require('pg-promise');


const pgPackage = pgp({});

import { db } from './init.js';

db.none('INSERT INTO courses (title) VALUES (${title_1}), (${title_2})', {
  title_1: 'Ruby',
  title_2: 'Python'
})
  .catch((data) => console.log(data.message));



db.none('INSERT INTO problems (explanation, type, content, courseId) VALUES (${explanation_1}, ${type_1}, ${content_1}, ${courseId_1})', {
  explanation_1: 'some context to a problem',
  type_1: 'ORDERED_MISSING_TEXT',
  content_1: JSON.stringify([
    {
      precedingText: 'first answer is',
      answer: 'hi',
      answered: null
    },
    {
      precedingText: 'second answer is',
      answer: 'hello',
      answered: null
    }
  ]),
  courseId_1: 1
})
  .catch((data) => console.log(data.message));




