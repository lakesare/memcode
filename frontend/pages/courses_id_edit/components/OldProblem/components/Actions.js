import { Loading } from '~/components/Loading';
import { FilteredCourseTitles } from './FilteredCourseTitles';

import * as ProblemApi from '~/api/Problem';
import * as CourseApi from '~/api/Course';

class Actions extends React.Component {
  static propTypes = {
    problemId: PropTypes.number.isRequired,
    removeOldProblem: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      speDestroyProblem: { status: 'success' },
      speCourses: {},
      ifModalIsShown: false,
      searchString: ''
    };
  }

  onRemove = (spe) => this.setState({ speDestroyProblem: spe })

  apiMoveProblemToCourse = (courseId) =>
    ProblemApi.moveToCourse(this.onRemove, this.props.problemId, courseId)
      .then(() => this.props.removeOldProblem(this.props.problemId))

  destroy = () =>
    ProblemApi.destroy(this.onRemove, this.props.problemId)
      .then(() => this.props.removeOldProblem(this.props.problemId))

  selectAllCreated = () =>
    CourseApi.selectAllCreated(
      (spe) => this.setState({ speCourses: spe })
    );

  toggleModal = () => {
    if (this.state.ifModalIsShown) {
      this.setState({ ifModalIsShown: false });
    } else {
      this.selectAllCreated();
      this.setState({ ifModalIsShown: true });
    }
  }

  updateSearchString = (event) =>
    this.setState({ searchString: event.target.value });

  render = () =>
    <Loading spe={this.state.speDestroyProblem}>{() =>
      <section className="actions">
        <div className="toggler" onClick={this.toggleModal}>
          <i className="fa fa-cog"/>
        </div>

        {
          this.state.ifModalIsShown &&
          <div className="modal">
            <div className="search-input-and-remove">
              <div className="search-input">
                <input
                  type="text"
                  className="search"
                  value={this.state.searchString}
                  onChange={this.updateSearchString}
                  placeholder="Move to..."
                />
                <i className="fa fa-exchange"/>
              </div>

              <a className="action -remove" onClick={this.destroy}>
                <i className="fa fa-trash-o"/>
              </a>
            </div>

            <Loading spe={this.state.speCourses}>{(array) =>
              <FilteredCourseTitles
                courses={array.map((a) => a.course)}
                searchString={this.state.searchString}
                apiMoveProblemToCourse={this.apiMoveProblemToCourse}
              />
            }</Loading>

          </div>
        }
      </section>
    }</Loading>
}

export { Actions };
