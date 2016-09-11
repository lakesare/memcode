import React from 'react';
import { browserHistory } from 'react-router';

import { Show } from './show';

const List = React.createClass({
  propTypes: {
    problems: React.PropTypes.object.isRequired,
    course:   React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.fetchProblems();
  },

  redirectToEditCoursePage() {
    browserHistory.push(`/courses/${this.props.course.id}/edit`);
  },

  render() {
    const listOfProblems = this.props.problems.items.map((problem, index) => {
      return <Show key={problem.id} problem={problem} index={index}/>
    });

    if (this.props.problems.status == 'success'){
      return(
        <div>
          <div className="button" onClick={this.redirectToEditCoursePage}>update</div>
          <h1>
            {this.props.course.items.title}
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