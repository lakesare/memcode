import React from 'react';

import { Header } from '../components/header';

import { reduxForm } from 'redux-form'
export const fields = [ 'firstName', 'lastName', 'email', 'sex', 'favoriteColor', 'employed', 'notes' ]

const NewCoursePage = React.createClass({
  render() {
    const {
      fields: { firstName },
      handleSubmit,
      resetForm,
      submitting
    } = this.props;

    return(
      <section className="row">
        <div className="small-11 small-centered column end">
          <Header/>
          <h1>New course</h1>

          <form onSubmit={handleSubmit}>
            <label>First Name</label>
            <input type="text" placeholder="First Name" {...firstName}/>
          </form>

          <button type="submit" disabled={submitting}>
            Submit
          </button>


        </div>
      </section>
    )
  }
});


export { NewCoursePage };