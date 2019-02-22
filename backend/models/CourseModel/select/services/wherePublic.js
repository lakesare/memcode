const wherePublic = `
  course.if_public = true
    AND
  (
    SELECT COUNT(problem.id) FROM problem WHERE problem.course_id = course.id
  ) >= 2
`;

export default wherePublic;
