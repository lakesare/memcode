course:
   amount of mems
   title
  'view'   => /courses/:id/show

/courses

/profile/courses_learned_by_me
they see a list of courses sorted by the amount of due problems.
course with due problems has buttons:
  'review'     => /courses/:id/review (it's 'solve' now)
  'learn mode' => /courses/:id/show in the learn mode
  amount of due mems

/profile/courses_created_by_me
course has buttons:
  'edit'   => /courses/:id/edit


/courses/:id/show
  'delete' (if owner) => just deletes it
  'edit'   (if owner) => /courses/:id/edit
  'review'     (if learner) => /courses/:id/review
  'learn mode' (if learner) => switch to learn mode
  'add to learned courses'/'remove from learned courses'/'resume learning this course' button

learned mode resumes from the last learnt mem


crappyken.com
merimory.com
memcode.com

