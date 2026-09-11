// globally setting up quill text editor
import '~/services/quill/registerBlots';
import '~/services/quill/registerModules';

import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);

import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';

// For the tooltip
import 'tippy.js/dist/tippy.css';

// common css
import './index.scss';

import store from './store';
import router from './router';
import ErrorBoundary from '~/components/ErrorBoundary';

import ReactModal from 'react-modal';

const rootElement = document.getElementById('root');

ReactModal.setAppElement(rootElement);

ReactDOM.render(
  <Provider store={store}>
    <ErrorBoundary>
      {router}
    </ErrorBoundary>
  </Provider>,
  rootElement
);


if (process.env.NODE_ENV === 'production') {
  document.addEventListener('DOMContentLoaded', () => {
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/webpacked-service-worker.js').then(registration => {
          console.log('SW registered: ', registration);
        }).catch(registrationError => {
          console.log('SW registration failed: ', registrationError);
        });
      });
    }
  });
}
