import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import CourseCreationModal from '~/components/CourseCreationModal';
import TogglerAndModal from '~/components/TogglerAndModal';
import SignInButtons from '~/appComponents/SignInButtons';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser
  })
)
class CreateCourseButton extends React.Component {
  static propTypes = {
    currentUser: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
    children: PropTypes.node.isRequired,
  }

  render = () => {
    if (this.props.currentUser) {
      // User is authenticated, show course creation modal
      return (
        <CourseCreationModal toggler={this.props.children} />
      );
    } else {
      // User is not authenticated, show sign-in modal
      return (
        <TogglerAndModal toggler={this.props.children}>{() =>
          <div className="standard-modal standard-modal--sm">
            <div className="standard-modal__header">
              <h2 className="standard-modal__title">Sign In</h2>
            </div>
            <div className="standard-modal__main">
              <SignInButtons text="Sign in with"/>
            </div>
          </div>
        }</TogglerAndModal>
      );
    }
  }
}

export default CreateCourseButton;
