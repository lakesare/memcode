import React from 'react';
import { Show } from './show';

const List = React.createClass({
  propTypes: {
    problems: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.fetchProblems();
  },

  render() {
    const aa = this.props.problems.items.map((problem, index) => {
      return <Show key={problem.id} problem={problem} index={index}/>
    });

    return(
      <div>
        {aa}
      </div>
    );
  }
});

export { List };