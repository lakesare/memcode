import CourseCardSimple from '~/appComponents/CourseCardSimple';
import CourseCardLearnReview from '~/appComponents/CourseCardLearnReview';

import css from './index.scss';

class ListOfCourseCards extends React.Component {
  static propTypes = {
    courseDtos: PropTypes.array.isRequired,
    // every Dto can have a type, or we can provide a single type for all dtos 
    type: PropTypes.oneOf(['simple', 'learnReview']),
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  renderLayoutDivs = () =>
    // eslint-disable-next-line react/no-array-index-key
    [...Array(10)].map((_, i) => <div key={i} className="layout-div"/>)

  render = () =>
    <section className={`${this.props.className} ${css.section}`}>
      {this.props.courseDtos.map((courseDto) =>
        this.props.type === 'simple' || courseDto.type === 'simple' ?
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
