// api.CourseApi.getPublicCourses(
//   (spe) => this.setState({ spe })
//   { groupId: 5 },
// );

import commonFetch from './commonFetch';

const fetchFunctionCreator = (controllerName, methodName) =>
  (dispatch, body) =>
    commonFetch(dispatch || false,
      'POST', `/api/${controllerName}.${methodName}`,
      body
    );

const api = new Proxy({}, {
  get: (obj_1, property_1) => {
    const controllerName = property_1;

    const methodProxy = new Proxy({}, {
      get: (obj_2, property_2) => {
        const methodName = property_2;
        return fetchFunctionCreator(controllerName, methodName);
      }
    });

    return methodProxy;
  }
});

// api.CourseApi.getPublicCourses({ groupId: 5 })

export default api;
