import { Loading } from '~/components/Loading';
import { Editor } from '~/components/Editor';

import css from './index.css';

class CourseEditForm extends React.Component {
  static propTypes = {
    save: PropTypes.func.isRequired,
    speSave: PropTypes.object.isRequired,
    initialValues: PropTypes.object,
    buttonText: PropTypes.string.isRequired
  }

  static defaultProps = {
    initialValues: {}
  }

  constructor(props) {
    super(props);

    const { title, ifPublic, description } = props.initialValues;
    this.state = {
      validationErrors: {},

      formValues: {
        title:       title || '',
        ifPublic:    (ifPublic === undefined) ? true : ifPublic,
        description: description || ''
      }
    };
  }

  updateFormValues = (hash) =>
    this.setState({
      formValues: {
        ...this.state.formValues,
        ...hash
      }
    })

  validateAndSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      this.props.save({
        title: this.state.formValues.title,
        description: this.state.formValues.description,
        ifPublic: this.state.formValues.ifPublic
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
    <form className={`${css.form} standard-form -bordered`}>
      {/* not real fieldset because it can't be flexbox */}
      <div className="fieldset">
        <div className="label">
          <label htmlFor="title">Title:</label>
        </div>
        <div className="input">
          <input type="text" onChange={(e) => this.updateFormValues({ title: e.target.value })} value={this.state.formValues.title}/>
        </div>
        {
          this.state.validationErrors.title &&
          <div className="error">
            {this.state.validationErrors.title}
          </div>
        }
      </div>

      <div className="fieldset">
        <div className="label">
          <label htmlFor="description">Description:</label>
        </div>
        <div className="input">
          <Editor
            editorState={this.state.formValues.description}
            updateEditorState={(newHtml) => this.updateFormValues({ description: newHtml })}
          />
        </div>
      </div>
      <div className="fieldset">
        <div className="label">
          <label>Is course listed in /courses:</label>
        </div>
        <div className="input">
          <div
            className={`ifPublic ${this.state.formValues.ifPublic ? '-true' : '-false'}`}
            onClick={() => this.updateFormValues({ ifPublic: !this.state.formValues.ifPublic })}
          >PUBLIC</div>
        </div>
      </div>

      <button
        className="button -black standard-submit-button"
        onClick={this.validateAndSubmit}
        disabled={this.props.speSave.status === 'request'}
        type="button"
      >{this.props.buttonText}</button>

      <Loading spe={this.props.speSave}/>
    </form>
}

export { CourseEditForm };
