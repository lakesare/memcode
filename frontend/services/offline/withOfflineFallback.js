import speCreator from '~/services/speCreator';

// [claude comment] fetch() rejects with a TypeError only when the request never reached the server - then the page gets the payload rebuilt from the offline download instead of the failure; ifOnlyOffline is for things created offline, which the server doesn't know yet
const withOfflineFallback = (dispatch, apiCall, getOfflinePayload, { ifOnlyOffline = false } = {}) => {
  let speFailure = null;

  if (ifOnlyOffline) {
    dispatch(speCreator.request());
    return getOfflinePayload()
      .catch(() => undefined)
      .then((offlinePayload) => {
        if (offlinePayload) {
          dispatch(speCreator.success(offlinePayload));
          return offlinePayload;
        } else {
          dispatch(speCreator.failure("This page isn't in the offline download."));
          return Promise.reject(new Error('Not in the offline download'));
        }
      });
  }

  return apiCall((spe) => {
    if (spe.status === 'failure') {
      speFailure = spe;
    } else {
      dispatch(spe);
    }
  })
    .catch(async (error) => {
      const offlinePayload = error instanceof TypeError ?
        await getOfflinePayload().catch(() => undefined) :
        undefined;

      if (offlinePayload) {
        dispatch(speCreator.success(offlinePayload));
        return offlinePayload;
      } else {
        if (speFailure) dispatch(speFailure);
        return Promise.reject(error);
      }
    });
};

export default withOfflineFallback;
