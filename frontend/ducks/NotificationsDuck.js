import SpeImmutable from '~/services/SpeImmutable';

const namespace = 'global.Notifications';

const SET_SPE_GET_NOTIFICATIONS = `${namespace}.SET_SPE_GET_NOTIFICATIONS`;
const SET_SPE_LOAD_MORE_NOTIFICATIONS = `${namespace}.SET_SPE_LOAD_MORE_NOTIFICATIONS`;

const initialState = {
  speNotifications: {},
  speLoadMoreNotifications: {},
  amountOfAllNotifications: 0,
  // should be stored in the local storage before we implement global state via the reducer
  amountOfUnreadNotifications: localStorage.getItem('amountOfUnreadNotifications') || 0,
};
const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_SPE_GET_NOTIFICATIONS: {
      const spe = action.payload;
      return { ...state, speGetNotifications: spe };
    }
    case SET_SPE_LOAD_MORE_NOTIFICATIONS: {
      const spe = action.payload;
      if (spe.status === 'success') {
        return {
          ...state,
          speGetNotifications: {
            ...state.speGetNotifications,
            payload: [
              ...state.speGetNotifications.payload,
              ...spe.payload
            ]
          }
        };
      } else {
        return { ...state, speLoadMoreNotifications: action.payload };
      }
    }
    default:
      return state;
  }
};

import api from '~/api';

const getActions = (dispatch, getState) => ({
  apiGetMostRecentNotifications() {
    api.NotificationApi.getNotificationsForUser(
      (spe) => dispatch({ type: SET_SPE_GET_NOTIFICATIONS, payload: spe }),
      {
        userId: getState().global.Authentication.currentUser,
        limit: 15
      }
    );
  },
  apiLoadMoreNotifications() {
    api.NotificationApi.getNotificationsForUser(
      (spe) => dispatch({ type: SET_SPE_LOAD_MORE_NOTIFICATIONS, payload: spe }),
      {
        userId: getState().global.Authentication.currentUser,
        limit: 15,
        offset: getState().global.Notifications.speGetNotifications.payload.length
      }
    );
  },

  apiMarkAsReadOrUnread(notification, ifRead) {
    const updatedNotification = { ...notification, ifRead };
    const speGetNotifications = SpeImmutable.update(this.state.speGetNotifications, updatedNotification);

    const amountOfUnreadNotifications = this.state.amountOfUnreadNotifications + (ifRead ? -1 : 1);

    this.setState({ speGetNotifications, amountOfUnreadNotifications });
    localStorage.setItem('amountOfUnreadNotifications', amountOfUnreadNotifications);
    return api.NotificationApi.markAsReadOrUnread(null, {
      id: notification.id,
      ifRead
    });
  },

  apiMarkAllNotificationsAsRead() {
    this.setState({
      speGetNotifications: {
        ...this.state.speGetNotifications,
        payload: this.state.speGetNotifications.payload.map((notification) => ({
          ...notification,
          ifRead: true
        }))
      },
      amountOfUnreadNotifications: 0
    });
    localStorage.setItem('amountOfUnreadNotifications', 0);
    return api.NotificationApi.markAllNotificationsAsRead(null, { userId: this.props.currentUser.id });
  }


});


export default { reducer, getActions };
