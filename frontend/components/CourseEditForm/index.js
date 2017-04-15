import React from 'react';

import { Loading } from '~/components/Loading';
import css from './index.css';

class CourseEditForm extends React.Component {
  static propTypes = {
    save: React.PropTypes.func.isRequired,
    speSave: React.PropTypes.object.isRequired,
    initialValues: React.PropTypes.object,
    buttonText: React.PropTypes.string.isRequired
  }

  static defaultProps = {
    initialValues: {}
  }

  constructor(props) {
    super(props);

    this.state = {
      validationErrors: {},
      formValues: {
        title: props.initialValues.title || ''
      }
    };
  }

  updateFormValues = (event, inputTitle) => {
    this.setState({
      formValues: {
        ...this.state.formValues,
        [inputTitle]: event.target.value
      }
    });
  }

  validateAndSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      this.props.save({
        title: this.state.formValues.title
      });
    }
  }

  validate = () => {
    if (this.state.formValues.title.length < 2) {
      this.setState({ validationErrors: { title: 'Title must be longer than 2 letters' } });
      return false;
    } else {
      return true;
    }
  }

  render = () =>
    <form className={css.form}>
      {/* not real fieldset because it can't be flexbox */}
      <div className="fieldset">
        <div className="label">
          <label htmlFor="title">Title:</label>
        </div>
        <div className="input">
          <input type="text" onChange={(e) => this.updateFormValues(e, 'title')} value={this.state.formValues.title}/>
        </div>
        {
          this.state.validationErrors.title &&
          <div className="error">
            {this.state.validationErrors.title}
          </div>
        }
      </div>

      <button
        className="button -black"
        onClick={this.validateAndSubmit}
        disabled={this.props.speSave.status === 'request'}
      >
        {this.props.buttonText}
      </button>
      <Loading spe={this.props.speSave}/>
    </form>
}

export { CourseEditForm };
