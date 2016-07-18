import React from 'react';
import { Show } from './show';


const List = React.createClass({
  propTypes: {
    courses: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.fetchCourses();
  },

  list() {
    const aa = this.props.courses.items.map((course) => {
      return <Show key={course.id} course={course}/>
    });
    return(aa);
  },



  render() {
    if (this.props.courses.status === 'success'){
      return(
        <div className="row">
          {this.list()}
        </div>
      )
    } else {
      return(
        <div>
          loading
        </div>
      )
    }
  }
});

export { List };