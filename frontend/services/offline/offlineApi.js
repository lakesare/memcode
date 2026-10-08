import store from '~/store';
import OfflineDuck from '~/ducks/OfflineDuck';
import changeTypes from './changeTypes';

// [claude comment] the writes that also work offline, called like api.post - offlineApi.ProblemApi.update(dispatchSpe, body, { courseId }), where courseId says which course of the offline download the change belongs to
const getActions = () =>
  OfflineDuck.getActions(store.dispatch, store.getState);

const offlineApi = {};
Object.keys(changeTypes).forEach((name) => {
  const [controller, method] = name.split('.');
  offlineApi[controller] = {
    ...offlineApi[controller],
    [method]: (dispatchSpe, body, context) =>
      getActions().runChange(dispatchSpe, controller, method, body, context)
  };
});

offlineApi.runOnPageHide = (controller, method, body, context) =>
  getActions().runChangeOnPageHide(controller, method, body, context);

export default offlineApi;
