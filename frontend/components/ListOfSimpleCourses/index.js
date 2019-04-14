import SimpleCourseCard from '~/appComponents/SimpleCourseCard';

class ListOfSimpleCourses extends React.Component {
  static propTypes = {
    coursesData: PropTypes.array.isRequired,
  }

  renderLayoutDivs = () =>
    // eslint-disable-next-line react/no-array-index-key
    [...Array(10)].map((_, i) => <div key={i} className="layout-div"/>)

  render = () =>
    <section className="list-of-courses">
      {
        this.props.coursesData.map((courseDto) =>
          <SimpleCourseCard
            key={courseDto.course.id}
            courseDto={courseDto}
          />
        )
      }
      {this.renderLayoutDivs()}
    </section>
}

export { ListOfSimpleCourses };
