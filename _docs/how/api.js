___what to send to api?
  request.body sent to api should be under key, eg request.body['courseUserIsLearning']
  request.body must be camelCased

___what to expect from api?
  ___statuses
    200: "All good"
    401: "Unauthenticated" (no credenials)
    403: "Unauthorized" (doesnt have access)
    500: server error, will return .json({ error: errorString });
  ___response
    response will not be under key, if api return course, it will return { courseId: 2 } etc.
    however keys will be used if multiple entities are teturned, eg { course: {}, user: {} }.
