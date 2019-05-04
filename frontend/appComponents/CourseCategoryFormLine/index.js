import { FormLineLayout } from '~/components/_standardForm';
import CourseCategorySelect from './components/CourseCategorySelect';

class CourseCategoryFormLine extends React.Component {
  static propTypes = {
    label: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    updateFormState: PropTypes.func.isRequired,
    formState: PropTypes.object.isRequired,
    formValidation: PropTypes.object.isRequired
  }

  updateFormState = (value) =>
    this.props.updateFormState({
      ...this.props.formState,
      [this.props.name]: value
    })

  render = () =>
    <FormLineLayout
      label={this.props.label}
      name={this.props.name}
      formValidation={this.props.formValidation}
    >
      <CourseCategorySelect
        courseCategoryId={this.props.formState[this.props.name] || false}
        updateCourseCategoryId={this.updateFormState}
      />
    </FormLineLayout>
}

export default CourseCategoryFormLine;
