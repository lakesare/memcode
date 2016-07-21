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
    const aa = this.props.problems.items.map((problem) => {
      return <Show key={problem.id} problem={problem}/>
    });


    return(
      <div>
        {aa}
      </div>
    );
  }


});

export { List };







