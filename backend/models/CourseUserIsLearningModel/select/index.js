import knex from '#~/db/knex.js';
import dayjs from 'dayjs';

const selectReview = async(cuilId) => {
  const now = dayjs();

  return await knex('problem')
    .select('problem.*')
    .join('problem_user_is_learning', {
      'problem_user_is_learning.problem_id': 'problem.id'
    })
    .where({ 
      'problem_user_is_learning.course_user_is_learning_id': cuilId,
      'problem_user_is_learning.if_ignored': false
    })
    .andWhere('problem_user_is_learning.next_due_date', '<', now)
    .orderBy([ 
      { column: 'position' },
      { column: 'created_at' }
    ]);
};

const selectAll = async(cuilId) => {
  const now = dayjs();

  return await knex('problem')
    .select('problem.*')
    .join('problem_user_is_learning', {
      'problem_user_is_learning.problem_id': 'problem.id'
    })
    .where({ 
      'problem_user_is_learning.course_user_is_learning_id': cuilId,
      'problem_user_is_learning.if_ignored': false
    })
    .orderBy([ 
      { column: 'position' },
      { column: 'created_at' }
    ]);
};

export default {
  selectReview,
  selectAll,
};
