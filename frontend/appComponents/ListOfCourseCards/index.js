import CourseCardSimple from '~/appComponents/CourseCardSimple';
import CourseCardLearnReview from '~/appComponents/CourseCardLearnReview';

import css from './index.css';

class ListOfCourseCards extends React.Component {
  static propTypes = {
    courseDtos: PropTypes.array.isRequired,
    type: PropTypes.oneOf(['simple', 'learnReview']).isRequired,
    className: PropTypes.string.isRequired
  }

  renderLayoutDivs = () =>
    // eslint-disable-next-line react/no-array-index-key
    [...Array(10)].map((_, i) => <div key={i} className="layout-div"/>)

  render = () =>
    <section className={`${this.props.className} ${css.section}`}>
      {this.props.courseDtos.map((courseDto) =>
        this.props.type === 'simple' ?
          <CourseCardSimple
            key={courseDto.course.id}
            courseDto={courseDto}
          /> :
          <CourseCardLearnReview
            key={courseDto.course.id}
            courseDto={courseDto}
          />
      )}
      {this.renderLayoutDivs()}
    </section>
}

export default ListOfCourseCards;
