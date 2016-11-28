import { db } from '../../db/init.js';
import { problemContentFromParamsToDb } from '../../services/problemContentFromParamsToDb';

const deleteProblem = (id) => {
  return(
    db.none('delete from problems where id=${id}', { id })
  )
};

// problems: [{content: "a", explanation: "aa"}]
const deleteProblems = (transaction, queries, problemIds) => {
  problemIds.forEach((id) => {
    queries.push(
      transaction.none('delete from problems where id=${id}', { id })
    )
  })
};


const createProblems = (transaction, queries, problemsToCreate, courseId) => {
  problemsToCreate.forEach((problem) => {
    queries.push(
      transaction.none(
        "insert into problems (content, explanation, course_id) values (${content}, ${explanation}, ${courseId})", 
        {
          content: problemContentFromParamsToDb(problem.content),
          explanation: problem.explanation,
          courseId: courseId
        }
      )
    );
  });
};

const updateProblems = (transaction, queries, newProblems, oldProblems) => {
  oldProblems.forEach((oldProblem) => {
    const newProblem = newProblems.find((possibleNewProblem) => { 
      return possibleNewProblem.id === oldProblem.id
    });

    if (!newProblem) { return }


    if (oldProblem.explanation !== newProblem.explanation) {
      queries.push(
        transaction.any('UPDATE problems SET explanation = ${explanation} WHERE id = ${id}', {
          explanation: newProblem.explanation, id: oldProblem.id
        })
      )
    }

    const oldContentString = JSON.stringify(oldProblem.content);
    const newContentString = problemContentFromParamsToDb(newProblem.content);

    // if existing problem changed its content, it's freaking another problem now. so let's delete associated points with it.
    if (oldContentString !== newContentString) {
      queries.push(
        transaction.any('UPDATE problems SET content = ${content} WHERE id = ${id}',
          { content: newContentString, id: oldProblem.id }
        )
      )
    }
    
  })
};


export { deleteProblem, createProblems, deleteProblems, updateProblems };