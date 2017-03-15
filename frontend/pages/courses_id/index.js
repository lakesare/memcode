<a
  className="delete"
  onClick={this.apiDeleteCourse}
>
  <i className="fa fa-trash-o" />
</a>


apiDeleteCourse = () => {
  CourseApi.destroy(
    spe => this.setState({ speDeleteCourse: spe }),
    this.props.course.id
  );
}
