import orFalse from '~/services/orFalse';
import api from '~/api';
import CourseCategoryModel from '~/models/CourseCategoryModel';
import CourseCategoryGroupModel from '~/models/CourseCategoryGroupModel';

import Select from '~/components/Select';

class CourseCategorySelect extends React.Component {
  static propTypes = {
    inputId: PropTypes.string.isRequired,
    courseCategoryId: orFalse(PropTypes.number).isRequired,
    updateCourseCategoryId: PropTypes.func.isRequired
  }

  state = {
    speGetCategories: {}
  }

  componentDidMount = () =>
    this.apiGetCategories()

  apiGetCategories = () =>
    api.get.CourseCategoryApi.getAll(
      (spe) => this.setState({ speGetCategories: spe })
    )

  deriveOptions = () => {
    if (this.state.speGetCategories.status !== 'success') return [];

    const { courseCategoryGroups, courseCategories } = this.state.speGetCategories.payload;
    return CourseCategoryGroupModel.sort(courseCategoryGroups, courseCategories).map((group) => ({
      label: group.name,
      options: CourseCategoryModel.deriveAndSortCategoriesPerGroup(courseCategories, group).map((category) => ({
        value: category.id,
        label: category.name
      }))
    }));
  }

  render = () => {
    const options = this.deriveOptions();
    const ifValueIsInOptions = options.some((group) =>
      group.options.some((option) => option.value === this.props.courseCategoryId)
    );

    return <Select
      withGroups
      inputId={this.props.inputId}
      options={options}
      value={ifValueIsInOptions ? this.props.courseCategoryId : null}
      updateValue={this.props.updateCourseCategoryId}
      isLoading={this.state.speGetCategories.status === 'request'}
    />;
  }
}

export default CourseCategorySelect;
