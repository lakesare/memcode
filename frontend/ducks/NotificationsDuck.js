const namespace = 'global.notifications';

const SPE_NOTIFICATIONS_AND_STATS = `${namespace}.SPE_NOTIFICATIONS_AND_STATS`;

const initialState = {
  speNotificationsAndStats: {},
  didSeeNotifications: true
};

const NotificationsReducer = (state = initialState, action) => {
  switch (action.type) {
    case SPE_NOTIFICATIONS_AND_STATS:
      const didSeeNotifications = action.spe.status === 'success' && action.spe.payload && action.spe.payload.stats
        ? action.spe.payload.stats.didSeeNotifications
        : state.didSeeNotifications;
      
      return { 
        ...state, 
        speNotificationsAndStats: action.spe,
        didSeeNotifications 
      };
    
    case `${namespace}.SET_DID_SEE_NOTIFICATIONS`:
      return { ...state, didSeeNotifications: action.payload };
    
    case `${namespace}.MARK_ALL_AS_READ`:
      if (state.speNotificationsAndStats.status === 'success') {
        return {
          ...state,
          speNotificationsAndStats: {
            ...state.speNotificationsAndStats,
            payload: {
              ...state.speNotificationsAndStats.payload,
              notifications: state.speNotificationsAndStats.payload.notifications.map(notification => ({
                ...notification,
                ifRead: true
              })),
              stats: {
                ...state.speNotificationsAndStats.payload.stats,
                amountOfUnreadNotifications: 0
              }
            }
          }
        };
      }
      return state;
    
    case `${namespace}.UPDATE_NOTIFICATION`:
      if (state.speNotificationsAndStats.status === 'success') {
        const oldNotification = state.speNotificationsAndStats.payload.notifications.find(n => n.id === action.payload.id);
        const wasRead = oldNotification && oldNotification.ifRead;
        const isNowRead = action.payload.ifRead;
        
        let unreadChange = 0;
        if (!wasRead && isNowRead) unreadChange = -1;
        if (wasRead && !isNowRead) unreadChange = 1;
        
        return {
          ...state,
          speNotificationsAndStats: {
            ...state.speNotificationsAndStats,
            payload: {
              ...state.speNotificationsAndStats.payload,
              notifications: state.speNotificationsAndStats.payload.notifications.map(notification => 
                notification.id === action.payload.id ? action.payload : notification
              ),
              stats: {
                ...state.speNotificationsAndStats.payload.stats,
                amountOfUnreadNotifications: state.speNotificationsAndStats.payload.stats.amountOfUnreadNotifications + unreadChange
              }
            }
          }
        };
      }
      return state;
    
    default:
      return state;
  }
};

import api from '~/api';

const getActions = (dispatch, getState) => ({
  apiGetNotificationsAndStats: (userId, limit = 15, offset = 0) => {
    api.NotificationApi.getNotificationsAndStatsForUser(
      (spe) => {
        dispatch({ type: SPE_NOTIFICATIONS_AND_STATS, spe });
      },
      { userId, limit, offset }
    );
  },
  
  apiGetNotificationsAndStatsSilent: (userId, limit = 15, offset = 0) => {
    const currentState = getState().global.Notifications.speNotificationsAndStats;
    const hasExistingData = currentState.status === 'success';
    
    // If we don't have existing data, show loading state
    if (!hasExistingData) {
      dispatch({ type: SPE_NOTIFICATIONS_AND_STATS, spe: { status: 'request' } });
    }
    
    api.NotificationApi.getNotificationsAndStatsForUser(
      (spe) => {
        // Only dispatch if we got a successful response or if we don't have existing data
        if (spe.status === 'success' || !hasExistingData) {
          dispatch({ type: SPE_NOTIFICATIONS_AND_STATS, spe });
        }
      },
      { userId, limit, offset }
    );
  },
  
  apiLoadMoreNotifications: (userId, offset) => {
    return api.NotificationApi.getNotificationsAndStatsForUser(
      (spe) => {
        if (spe.status === 'success') {
          const currentState = getState().global.Notifications.speNotificationsAndStats;
          if (currentState.status === 'success') {
            dispatch({
              type: SPE_NOTIFICATIONS_AND_STATS,
              spe: {
                status: 'success',
                payload: {
                  notifications: [...currentState.payload.notifications, ...spe.payload.notifications],
                  stats: spe.payload.stats
                }
              }
            });
          }
        }
        return spe;
      },
      { userId, limit: 10, offset }
    );
  },
  
  apiMarkNotificationsAsSeen: (userId) => {
    api.NotificationApi.markNotificationsAsSeen(
      (spe) => {
        if (spe.status === 'success') {
          dispatch({ type: `${namespace}.SET_DID_SEE_NOTIFICATIONS`, payload: true });
        }
      },
      { userId }
    );
  },
  
  markAllAsRead: () => {
    dispatch({ type: `${namespace}.MARK_ALL_AS_READ` });
  },
  
  updateNotification: (notification) => {
    dispatch({ type: `${namespace}.UPDATE_NOTIFICATION`, payload: notification });
  },
  
  setDidSeeNotifications: (didSee) => {
    dispatch({ type: `${namespace}.SET_DID_SEE_NOTIFICATIONS`, payload: didSee });
  },
  
  apiMarkAsReadOrUnread: (notificationId, ifRead) => {
    api.NotificationApi.markAsReadOrUnread(null, {
      id: notificationId,
      ifRead
    });
  },
  
  apiMarkAllNotificationsAsRead: (userId) => {
    api.NotificationApi.markAllNotificationsAsRead(null, { userId });
  }
});

const selectors = {};

export default { reducer: NotificationsReducer, getActions, selectors };
