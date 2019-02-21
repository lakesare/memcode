// for googlebot and other browsers not to choke on draftjs
import 'es5-shim';
import 'es6-shim';
// `fetch` polyfill for safari
import 'whatwg-fetch';
// `URLSearchParams` polyfill for parsing query params
import 'url-search-params-polyfill';

// globally setting up quill text editor
import '~/services/quill/registerBlots';
import '~/services/quill/registerModules';

import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { GatewayProvider, GatewayDest } from 'react-gateway';

// common css
import './index.css';
// import './fonts/font-awesome/scss/font-awesome.scss';


// For the tooltip
import 'react-tippy/dist/tippy.css';


import store from './store';
import router from './router';

// class ModalTellingUserAboutOfflineMode extends React.Component {
//   state = {
//     ifModalIsOpen:
//       !window.navigator.onLine &&
//       !window.location.href.includes('/offline/')
//   }

//   // componentDidMount = () => {
//   //   window.addEventListener('offline', function(e) { console.log('offline'); });

//   //   window.addEventListener('online', function(e) { console.log('online'); });
//   // }

//   render = () => (
//     this.state.ifModalIsOpen ?
//     <div className="standard-modal">
//       <section>
//         <h1>You are offline.</h1>
//         <h2>But good news, you can still review all of your flashcards and have these results recorded!</h2>
//         <h2>Please go to the offline version: <Link to="/offline/courses">courses</Link></h2>
//         <h3>Don't reload the app though, or upload it via chrome.</h3>
//       </section>
//     </div> :
//     <div className="standard-modal">
//       <h1>You are online</h1>
//     </div>
//   )
// }

ReactDOM.render(
  <GatewayProvider>
    <Provider store={store}>
      <div>
        {router}
        <GatewayDest name="main"/>
      </div>
    </Provider>
  </GatewayProvider>,
  document.getElementById('root')
);

// console.log('change for webpack');
// document.addEventListener("DOMContentLoaded", () => {
//   if ('serviceWorker' in navigator) {
//     window.addEventListener('load', () => {
//       navigator.serviceWorker.register('/webpacked-service-worker.js').then(registration => {
//         console.log('SW registered: ', registration);
//       }).catch(registrationError => {
//         console.log('SW registration failed: ', registrationError);
//       });
//     });
//   }
// });
