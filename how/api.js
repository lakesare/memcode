___routes not facing client (=> all api), needs to be in camelCase
  router.post('/:id/updateProblemScore')

___what to send to api?
  request.body sent to api should be under key, eg request.body['courseUserIsLearning']
  request.body must be camelCased

___what to expect from api?
  ___statuses
    200: "All good"
    403: "Unauthenticated"
    401: "Unauthorized"
    500: server error, will return .json({ error: error.message });
  ___response
    response will not be under key, if api return course, it will return { courseId: 2 } etc. 
