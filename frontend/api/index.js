// Usage examples:
// api.get.CourseApi.getPublicCourses(
//   (spe) => this.setState({ spe }),
//   { groupId: 5 }
// );
// api.post.CourseApi.createCourse(
//   (spe) => this.setState({ spe }),
//   { name: 'Category Theory' }
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
// api.post.CourseApi.createCourse({ name: 'Category Theory' }})
const api = new Proxy({}, {
  get: (_0, methodType) => {
    if (methodType === "get") {
      return new Proxy({}, {
        get: (_1, controllerName) => {
          const controllerProxy = new Proxy({}, {
            get: (_2, methodName) => {
              return fetchFunctionCreator(controllerName, methodName, 'GET');
            }
          });
          return controllerProxy;
        }
      });
    } else if (methodType === "post") {
      return new Proxy({}, {
        get: (_1, controllerName) => {
          const controllerProxy = new Proxy({}, {
            get: (_2, methodName) => {
              return fetchFunctionCreator(controllerName, methodName, 'POST');
            }
          });
          return controllerProxy;
        }
      });
    } else {
      throw new Error(`API calls must use explicit method prefix: api.get.${methodType}... or api.post.${methodType}...`);
    }
  }
});

export default api;
