import React from 'react';
import { connect } from 'react-redux';

import { Header } from '../components/header';
import { currentUser } from '../services/currentUser';

let ProfilePage = React.createClass({
  render() {
    console.log({ currentUser });
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