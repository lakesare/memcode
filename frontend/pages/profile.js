import React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/header';

let ProfilePage = React.createClass({
  render() {
    return(
      <main>
        <Header/>

        <div className="row">
          <div className="small-12 column">
            <h1>Profile</h1>
            { currentUser ? currentUser.username : 'logged out' }
          </div>
        </div>
      </main>
    )
  }
});

export { ProfilePage };
