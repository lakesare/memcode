import { FormLineLayout } from '~/components/_standardForm';
import CourseCategorySelect from './CourseCategorySelect';

// why is there value={this.props.formState[name] || ''} in all inputs?
// to avoid this issue: https://github.com/twisty/formsy-react-components/issues/66
// when the initial this.props.formState is {}
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
    FormLineLayout(
      this.props,
      <CourseCategorySelect
        courseCategoryId={this.props.formState[this.props.name] || false}
        updateCourseCategoryId={this.updateFormState}
      />
    )
}

export default CourseCategoryFormLine;
