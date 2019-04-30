import api from '~/api';

import StarRating from '~/components/StarRating';

class CourseStarRating extends React.Component {
  static propTypes = {
    courseId: PropTypes.number.isRequired,
    ifCanRateCourse: PropTypes.bool.isRequired
  }

  state = {
    speGetRatings: {},
    rating: false
  }

  componentDidMount = () => {
    this.apiGetRatings();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.courseId !== this.props.courseId) {
      this.apiGetRatings();
    }
  }

  apiGetRatings = () =>
    api.CourseApi.getRatings(
      { courseId: this.props.courseId },
      (spe) => this.setState({ speGetRatings: spe })
    )
      .then(({ ownRating }) => {
        this.setState({ rating: ownRating });
      })

  apiUpdateRating = (rating) => {
    this.setState({ rating });
    this.apiRate(rating);
  }

  apiRate = (rating) =>
    api.CourseApi.rate(
      { courseId: this.props.courseId, rating },
      (spe) => spe.status === 'success' && this.setState({ speGetRatings: spe })
    )

  renderSuccess = ({ averageRating, ratings, ownRating }) =>
    <li className={`course-star-rating ${this.props.ifCanRateCourse ? '-can-rate-course' : ''}`}>
      <div className="stat">
        <span className="number">{ratings.length > 0 && averageRating}</span>
        <i className="fa fa-user-o"/>
        <span className="amount-of-voters">{ratings.length}</span>
      </div>

      <div className="icon">
        {
          this.props.ifCanRateCourse ?
            <StarRating
              rating={ownRating || false}
              updateRating={this.apiUpdateRating}
              readOnly={!this.props.ifCanRateCourse}
            /> :
            <div className="one-star">★</div>
        }
      </div>
    </li>

  render = () =>
    this.state.speGetRatings.status === 'success' &&
    this.renderSuccess(this.state.speGetRatings.payload)
}

export default CourseStarRating;
