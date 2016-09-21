import React from 'react';
import { Link } from 'react-router'
import { connect } from 'react-redux';

import css from './show.scss';

let Show = React.createClass({
  propTypes: {
    course: React.PropTypes.object.isRequired,
    last:   React.PropTypes.bool.isRequired
  },

  deletionClasses() {
    const deletion = this.props.course.delete;
    let classes = [];

    if (deletion) {
      switch (deletion.status) {
        case 'fetching':
          classes.push(css.is_deleting + " ");
          break;
        case 'success':
          classes.push('hide ')
          break;
      }
    }
    
    return classes.join('')
  },

  render() {
    return(
      <div className={"columns small-2 " + (this.props.last ? "end " : "") + this.deletionClasses() + css.course}>


        <div className="button alert" onClick={this.props.deleteCourse}>delete</div>
        <Link className="button" to={"/courses/" + this.props.course.id + "/edit"}>Edit</Link>


        <Link to={"/courses/" + this.props.course.id} className={css.link}>
          <h5 className="text-center">{this.props.course.title}</h5>
        </Link>
      </div>
    );
  }
});


const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deleteCourse: () => {
      const courseId = ownProps.course.id;
      dispatch({ type: 'DELETING_COURSE', status: 'fetching', courseId });
      fetch(`/api/courses/${courseId}`, {
        method: "DELETE"
      }).then(() => {
        dispatch({ type: 'DELETING_COURSE', status: 'success', courseId });
      }).catch(() => {
        dispatch({ type: 'DELETING_COURSE', status: 'failure' });
      })
    },
  }
}

Show = connect(
  () => ({}),
  mapDispatchToProps
)(Show)

export { Show };