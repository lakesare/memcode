import { TextInput, EditorTextarea } from '~/components/_standardForm';
import { FormLineLayout } from '~/components/_standardForm/components/FormLineLayout';
import css from './index.css';

const validate = (formState) => {
  if (formState.title.length < 2) {
    return ({ title: 'Title must be longer than 2 letters' });
  } else {
    return true;
  }
};

class CourseForm extends React.Component {
  static propTypes = {
    formState: PropTypes.object.isRequired,
    updateFormState: PropTypes.func.isRequired,
    formValidation: PropTypes.object.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ""
  }

  togglerIfPublic = () =>
    this.props.updateFormState({
      ...this.props.formState,
      ifPublic: !this.props.formState.ifPublic
    })

  render = () => {
    const inputProps = {
      updateFormState: this.props.updateFormState,
      formState: this.props.formState,
      formValidation: this.props.formValidation
    };
    return <section className={`${this.props.className} ${css['course-form']}`}>
      <TextInput {...inputProps} label="Title:" name="title"/>
      <EditorTextarea {...inputProps} label="Description:" name="description"/>

      {FormLineLayout(
        {
          name: 'ifPublic',
          label: 'Public or private:',
          formValidation: this.props.formValidation
        },
        <div
          className={`ifPublic ${this.props.formState.ifPublic ? '-true' : '-false'}`}
          onClick={this.togglerIfPublic}
        >PUBLIC</div>,
        '-ifPublic'
      )}
    </section>;
  }
}

export { CourseForm, validate };
