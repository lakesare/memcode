// import { db } from '../../db/init.js';


// const createProblemsForCourse = (problems, courseId) => {
//   db.task((t) => {
//     let queries = [];
//     problems.forEach((problem) => {
//       queries.push(
//         t.none("insert into problems (title) values (${title})", problem)
//       );
//     });


//     return t.batch(queries);
//   });
// }

// export { createProblemsForCourse };