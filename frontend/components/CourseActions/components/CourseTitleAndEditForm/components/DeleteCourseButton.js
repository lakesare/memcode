import { browserHistory } from 'react-router';
import onClickOutside from 'react-onclickoutside';

import * as CourseApi from '~/api/Course';
import { Loading } from '~/components/Loading';

@onClickOutside
class DeleteCourseButton extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired
  }

  state = {
    speDelete: { status: 'success' },
    ifAskingForConfirmation: false
  }

  handleClickOutside = () =>
    this.setState({ ifAskingForConfirmation: false })

  deleteCourse = () =>
    CourseApi.destroy(
      (spe) => this.setState({ speDelete: spe }),
      this.props.course.id
    )
      .then(() => browserHistory.push('profile/created'))

  uiAskForConfirmation = () =>
    this.setState({ ifAskingForConfirmation: true })

  render = () =>
    <div className="delete-course-and-confirm-button">
      {
        this.state.ifAskingForConfirmation ?
          <Loading spe={this.state.speDelete}>
            <button type="button" className="button -confirm" onClick={this.deleteCourse}>
              <span className="are-you-sure">Are you sure you want to delete this course?</span>
            </button>
          </Loading> :
          <button type="button" className="button -delete" onClick={this.uiAskForConfirmation}>
            <span className="delete">Delete course</span>
          </button>
      }
    </div>
}

export { DeleteCourseButton };
