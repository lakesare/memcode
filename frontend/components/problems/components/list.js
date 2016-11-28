import React from 'react';
import { Link } from 'react-router';

import { Show } from './show';

const List = React.createClass({
  propTypes: {
    problems: React.PropTypes.object.isRequired,
    course:   React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.fetchCourseWithProblems();
  },


  render() {
    const listOfProblems = this.props.problems.items.map((problem, index) => {
      return [
        <Show key={problem.id} problem={problem} index={index}/>,
        <hr/>
      ]
    });

    if (this.props.problems.status == 'success'){
      return(
        <div>
          <h1>
            {this.props.course.items.title}
            <Link to={`/courses/${this.props.course.items.id}/edit`} className='button float-right'>edit</Link>
          </h1>
          {listOfProblems}
        </div>
      )
    } else {
      return(<div></div>)
    }
  }
});

export { List };