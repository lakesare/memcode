// api.CourseApi.getPublicCourses(
//   { groupId: 5 },
//   (spe) => this.setState({ spe })
// );

import commonFetch from './commonFetch';

const fetchFunctionCreator = (controllerName, methodName) =>
  (body, dispatch) =>
    commonFetch(dispatch || false,
      'POST', '/api',
      {
        controllerName,
        methodName,
        payload: body
      }
    );

const api = new Proxy({}, {
  get: (obj, property_1) => {
    const controllerName = property_1;

    const methodProxy = new Proxy({}, {
      get: (obj, property_2) => {
        const methodName = property_2;
        console.log({controllerName, methodName});
        return fetchFunctionCreator(controllerName, methodName)
      }
    });

    return methodProxy;
  }
});

// api.CourseApi.getPublicCourses({ groupId: 5 })

export default api;
