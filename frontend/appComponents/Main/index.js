import Header from '~/appComponents/Header';
import Footer from '~/appComponents/Footer';

import MyDuck from '~/ducks/MyDuck';

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser,
    My: state.global.My
  }),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions)
  })
)
class Main extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    dontLinkToLearnOrReview: PropTypes.string,

    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    currentUser: PropTypes.object
  }

  componentDidMount = () => {
    if (this.props.currentUser) {
      this.props.MyActions.apiGetCourses();

      // every 5 minutes
      this.apiSyncInterval = setInterval(() => {
        this.props.MyActions.apiGetCourses();
      }, 5 * 60 * 1000);
    }

    if (this.props.My.speCategories.status !== 'success') {
      this.props.MyActions.apiGetCategories();
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
