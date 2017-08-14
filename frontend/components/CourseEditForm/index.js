import { Loading } from '~/components/Loading';
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

  updateFormValues = (event, inputTitle) =>
    this.setState({
      formValues: {
        ...this.state.formValues,
        [inputTitle]: event.target.value
      }
    });

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

      <div className="fieldset">
        <div className="label">
          <label htmlFor="description">Description:</label>
        </div>
        <div className="input">
          <textarea
            onChange={(e) => this.updateFormValues(e, 'description')}
            value={this.state.formValues.description}
            placeholder="HTML is okay."
          />
        </div>
      </div>
      <div dangerouslySetInnerHTML={{ __html: this.state.formValues.description }} />
      <div className="fieldset">
        <div className="label">
          <label>Is course listed in /courses:</label>
        </div>
        <div className="input">
          <div
            className={`ifPublic ${this.state.formValues.ifPublic ? '-true' : '-false'}`}
            onClick={() => this.updateFormValues({ target: { value: !this.state.formValues.ifPublic } }, 'ifPublic')}
          >PUBLIC</div>
        </div>
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
