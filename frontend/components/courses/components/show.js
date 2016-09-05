import React from 'react';
import { Link } from 'react-router'

const Show = React.createClass({
  propTypes: {
    course: React.PropTypes.object.isRequired
  },

  render() {
    return(
      <div className={"columns small-2" + (this.props.last ? " end" : "")} >
        <Link to={"/courses/" + this.props.course.id}>
          <h5 className="text-center">{this.props.course.title}</h5>
          <img src={this.props.course.imageUrl}/>
        </Link>
      </div>
    );
  }
});

export { Show };