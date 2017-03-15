import React from 'react';

import { Link } from 'react-router';
import { Loading } from '~/components/Loading';

class Actions extends React.Component {
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

  apiDeleteCourse = () => {
    CourseApi.destroy(
      spe => this.setState({ speDeleteCourse: spe }),
      this.props.course.id
    );
  }

  render = () =>
    <section class="actions">
      <a className="delete" onClick={this.apiDeleteCourse}>
        <i className="fa fa-trash-o"/>
      </a>

      edit

      learn mode

      add to learned courses

    </section>
}

export { Actions };
