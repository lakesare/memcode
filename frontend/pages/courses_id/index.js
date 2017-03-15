

import React from 'react';

import { Link } from 'react-router';
import { Header }      from '~/components/Header';
import { Loading } from '~/components/Loading';
import { Actions } from './components/Actions';

class Page_courses_id extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetCourse: {}
    };
  }

  componentDidMount = () => {
    CourseApi.show(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    );
  }


  render = () =>
    <main>
      <Header/>
      <div className="container">
        <Loading spe={this.state.speGetCourse}>{course =>
          
        }</Loading>
      </div>
    </main>
}

export { Page_courses_id };
