import api from '~/api';

import Loading from '~/components/Loading';
import StarRating from '~/components/StarRating';

class CourseStarRating extends React.Component {
  static propTypes = {
    courseId: PropTypes.string.isRequired,
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
      (spe) => this.setState({ speGetRatings: spe })
    )

  render = () =>
    <Loading enabledStatuses={['success']} spe={this.state.speGetRatings}>{({ averageRating, ratings, ownRating }) =>
      <li className="course-star-rating">
        {
          ratings.length > 0 &&
          <div className="stat">
            <span className="number">{averageRating}</span>
            <i className="fa fa-user-o"/>
            <span className="amount-of-voters">{ratings.length}</span>
          </div>
        }
        <div className="icon">
          <StarRating
            rating={ownRating || false}
            updateRating={this.apiUpdateRating}
            readOnly={!this.props.ifCanRateCourse}
          />
        </div>
      </li>
    }</Loading>
}

export default CourseStarRating;
