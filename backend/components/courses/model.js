import { db } from '../../db/init.js';
import { problemContentFromParamsToDb } from '../../services/problemContentFromParamsToDb';


// course: {title: "aaa"}
// problems: [{content: "a", explanation: "aa"}]
const createCourseWithProblems = (course, problems) => {
  // { validation: 'failed' }

  const result = db
    .one("insert into courses (title) values (${title}) RETURNING id", course)
    .then((course) => {
      let monad = db.tx((transaction) => {
        return createProblemsForCourse(transaction, problems, course.id);
      })
      return monad
    })
    .then((data) => {
      return { data }
    })
    .catch((error) => {
      return { error }
    })

  return result
}




// problems: [{content: "a", explanation: "aa"}]
const createProblemsForCourse = (transaction, problems, courseId) => {
  let queries = [];
  problems.forEach((problem) => {
    console.log(problem)
    queries.push(
      transaction.none(
        "insert into problems (content, explanation, courseId) values (${content}, ${explanation}, ${courseId})", 
        {
          content: problemContentFromParamsToDb(problem.content),
          explanation: problem.explanation,
          courseId: courseId
        }
      )
    );
  });

  return transaction.batch(queries);
}



export { createCourseWithProblems };
