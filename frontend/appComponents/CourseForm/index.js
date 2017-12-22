import { TextInput, EditorTextarea, Select } from '~/components/_standardForm';
import CourseCategoryFormLine from './components/CourseCategoryFormLine';
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

  render = () => {
    const inputProps = {
      updateFormState: this.props.updateFormState,
      formState: this.props.formState,
      formValidation: this.props.formValidation
    };
    return <section className={`${this.props.className} ${css['course-form']}`}>
      <TextInput      {...inputProps} label="* Title:"            name="title"/>
      <EditorTextarea {...inputProps} label="Description:"       name="description"/>
      <CourseCategoryFormLine {...inputProps} label="Category:"  name="courseCategoryId"/>
      <Select         {...inputProps} label="Public or private:" name="ifPublic" possibleValues={{ true: 'Public', false: "Private" }}/>
    </section>;
  }
}

export { CourseForm, validate };
