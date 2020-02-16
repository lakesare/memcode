import Header from '~/appComponents/Header';
import Footer from '~/appComponents/Footer';

import MyDuck from '~/ducks/MyDuck';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser,
    My: state.global.My
  }),
  (dispatch) => ({
    apiGetCourses: () => MyDuck.actions.apiGetCourses(dispatch),
    apiGetCategories: () => MyDuck.actions.apiGetCategories(dispatch)
  })
)
class Main extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    dontLinkToLearnOrReview: PropTypes.string,

    apiGetCourses: PropTypes.func.isRequired,
    apiGetCategories: PropTypes.func.isRequired,
    currentUser: PropTypes.object,
    My: PropTypes.object.isRequired
  }

  componentDidMount = () => {
    if (this.props.currentUser) {
      this.props.apiGetCourses();

      // every 5 minutes
      this.apiSyncInterval = setInterval(() => {
        this.props.apiGetCourses();
      }, 5 * 60 * 1000);
    }

    if (this.props.My.speCategories.status !== 'success') {
      this.props.apiGetCategories();
    }
  }

  componentWillUnmount() {
    this.apiSyncInterval && clearInterval(this.apiSyncInterval);
  }

  render = () =>
    <main className={this.props.className}>
      <Header dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>

      {this.props.children}

      <Footer/>
    </main>
}

export default Main;
