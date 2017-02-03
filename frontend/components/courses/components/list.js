import React from 'react';
import { Show } from './show';

class List extends React.Component {
  static propTypes = {
    courses: React.PropTypes.array.isRequired
  }

  renderList = () =>
    this.props.courses.map(course =>
      <Show key={course.id} course={course}/>
    )

  render = () =>
    <section className="list-of-courses">
      {this.renderList()}
    </section>
}

export { List };
