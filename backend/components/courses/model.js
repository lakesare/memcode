import { db } from '../../db/init.js';
import { problemContentFromParamsToDb } from '../../services/problemContentFromParamsToDb';


// course: {title: "aaa"}
// problems: [{content: "a", explanation: "aa"}]
const createCourseWithProblems = (course, problems) => {
  // { validation: 'failed' }
  let courseId = null;
  const result = db
    .one("insert into courses (title) values (${title}) RETURNING id", course)
      .then((course) => {
      courseId = course.id;
      let monad = db.tx((transaction) => {
        return createProblemsOfCourse(transaction, problems, course.id);
      })
      return monad
    }).then((data) => { return { data: { courseId } } 
    }).catch((error) => { return { error } 
    })

  return result
}

// problems: [{content: "a", explanation: "aa"}]
const createProblemsOfCourse = (transaction, problems, courseId) => {
  let queries = [];
  problems.forEach((problem) => {
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


const getCourseWithProblems = (courseId) => {
  const result = Promise.all([
    db.one('select * from courses where id = ${courseId}', { courseId }),
    db.any('select * from problems where courseId = ${courseId}', { courseId })
  ]).then((values) => {
    return(
      { 
        data: {
          course: values[0],
          problems: values[1]
        }
      }
    )
  }).catch((error) => {
    return({ error })
  })

  return result
}


const deleteCourseWithProblems = (courseId) => {
  return(
    db.tx((transaction) => {
      return transaction.batch([
        transaction.none('delete from problems where courseId=${courseId}', { courseId }),
        transaction.none('delete from courses where id=${courseId}', { courseId }),
      ]);
    }).then(() => { return { data: true }
    }).catch((error) => { return { error } 
    })
  )
}




export { createCourseWithProblems, getCourseWithProblems, deleteCourseWithProblems };
