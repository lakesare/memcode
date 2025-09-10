import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import MyDuck from '~/ducks/MyDuck';

import TogglerAndModal from '~/components/TogglerAndModal';
import Loading from '~/components/Loading';
import { TextInput } from '~/components/_standardForm';

import CourseModel from '~/models/CourseModel';
import api from '~/api';

@withRouter
@connect(
  () => ({}),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class CourseCreationModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.element.isRequired,
    history: PropTypes.object.isRequired,
    MyActions: PropTypes.object.isRequired,
  }

  state = {
    speSave: { status: 'success' },
    formState: {
      title: '',
      description: '',
      courseCategoryId: 1, // Other
      ifPublic: false
    },
    formValidation: {}
  }

  apiCreateCourse = (event) => {
    event.preventDefault();
    const formValidation = CourseModel.validateForm(this.state.formState);
    if (formValidation === true) {
      api.post.CourseApi.createCourse(
        spe => this.setState({ speSave: spe }),
        { course: this.state.formState }
      )
        .then((course) => {
          this.props.history.push(`/courses/${course.id}`);
          // Very important to refetch the courses, - otherwise the first problem will not be visibly 'to learn'.
          this.props.MyActions.apiGetCourses();
          // Close the modal after successful creation
          if (this.closeModal) {
            this.closeModal();
          }
        });
    } else {
      this.setState({ formValidation });
    }
  }

  inputProps = () => ({
    formState: this.state.formState,
    updateFormState: (formState) => this.setState({ formState }),
    formValidation: this.state.formValidation
  })

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) => {
      // Store closeModal reference for use in apiCreateCourse
      this.closeModal = closeModal;
      
      return (
        <div className="standard-modal standard-modal--sm">
          <div className="standard-modal__header">
            <h2 className="standard-modal__title">Create Course</h2>
            <div className="standard-modal__description">
              Create, study, share your own flashcards!<br/>
              You'll be able to import flashcards or make the course public after creation.
            </div>
          </div>
          
          <div className="standard-modal__main">

            <form className="standard-form -no-padding" onSubmit={this.apiCreateCourse}>
              <div className="form-insides">
                <TextInput {...this.inputProps()} label="Title" name="title" autoFocus/>
              </div>

              <button
                className="button -purple standard-submit-button -move-up-on-hover"
                type="submit"
                disabled={this.state.speSave.status === 'request'}
              >
                {this.state.speSave.status === 'request' ? 'Creating...' : 'Create'}
              </button>
              <Loading spe={this.state.speSave}/>
            </form>
          </div>
        </div>
      )
    }}</TogglerAndModal>
}

export default CourseCreationModal;
