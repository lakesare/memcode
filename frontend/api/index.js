// api.CourseApi.getPublicCourses(
//   (spe) => this.setState({ spe })
//   { groupId: 5 },
// );

import commonFetch from './commonFetch';
import hashToQueryString from './services/hashToQueryString';

const fetchFunctionCreator = (controllerName, methodName, method) =>
  (dispatch, body) => {
    if (method === "POST") {
      return commonFetch(dispatch || false,
        'POST', `/api/${controllerName}.${methodName}`,
        body
      );
    } else if (method === "GET") {
      return commonFetch(dispatch || false,
        'GET', `/api/${controllerName}.${methodName}?${hashToQueryString(body)}`
      );
    }
  };

// api.get.CourseApi.getPublicCourses({ groupId: 5 }) or
// api.CourseApi.createCourse({ name: 'Category Theory' }})
const api = new Proxy({}, {
  get: (_0, methodOrController) => {
    if (methodOrController === "get") {
      return new Proxy({}, {
        get: (_1, methodName) => {
          const methodProxy = new Proxy({}, {
            get: (_2, controllerName) => {
              return fetchFunctionCreator(methodName, controllerName, 'GET');
            }
          });
          return methodProxy;
        }
      });
    } else {
      const methodProxy = new Proxy({}, {
        get: (_3, methodName) => {
          return fetchFunctionCreator(methodOrController, methodName, 'POST');
        }
      });
      return methodProxy;
    }
  }
});

export default api;
