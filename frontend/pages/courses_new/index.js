import React from 'react';

import { Header } from '~/components/header';
import { NewCourse } from '~/components/courses';

class Page_courses_new extends React.Component {
  static propTypes = {
    apiCreateCourse: React.PropTypes.func.isRequired
  }

  render = () =>
    <section>
      <Header/>

      <div className="row">
        <div className="small-12 column">
          <h1>New course</h1>
          <NewCourse onSubmit={this.props.apiCreateCourse}/>
        </div>
      </div>
    </section>
}

import { connect } from 'react-redux';
import { apiCreateCourse } from '~/ducks/courses/actions';

const mapDispatchToProps = dispatch => ({
  apiCreateCourse: apiCreateCourse(dispatch)
});

const Page_courses_new = connect(() => ({}), mapDispatchToProps)(Page_courses_new);

export { Page_courses_new };
