import React from 'react';
import { Show } from './show';

const List = React.createClass({
  propTypes: {
    problems: React.PropTypes.object.isRequired,
    course:   React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.fetchProblems();
  },

  render() {
    const aa = this.props.problems.items.map((problem, index) => {
      return <Show key={problem.id} problem={problem} index={index}/>
    });

    if (this.props.problems.status == 'success'){
      return(
        <div>
          <h1>
            {this.props.course.items.title}
          </h1>
          {aa}
        </div>
      )
    } else {
      return(<div></div>)
    }
  }
});

export { List };