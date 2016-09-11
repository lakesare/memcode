import { db } from '../../db/init.js';

const deleteProblem = (id) => {
  return(
    db.none('delete from problems where id=${id}', { id })
      .then(() => { return { data: true }
    }).catch((error) => { return { error } 
    })
  )
}

export { deleteProblem };