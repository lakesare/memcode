import React from 'react';
import { Show } from './show';

import { eachSlice } from '../../../services/eachSlice'

const List = React.createClass({
  propTypes: {
    courses: React.PropTypes.object.isRequired
  },

  componentDidMount() {
    this.props.fetchCourses();
  },

  list() {
    const courses = this.props.courses.items;
    const arrayOfCourseShowJsxs = courses.map((course, index) => {
      return <Show key={course.id} course={course} last={(index == courses.length - 1) ? true : false}/>
    });

    const arrayOfRows = eachSlice(arrayOfCourseShowJsxs, 12).map((twelveColumns, index) => {
      return <div className="row" key={index}>{twelveColumns}</div>
    })

    return arrayOfRows
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
        <div className="row">
          loading
        </div>
      )
    }
  }
});


export { List };