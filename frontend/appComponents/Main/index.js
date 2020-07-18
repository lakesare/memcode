import orFalse from '~/services/orFalse';
import MyDuck from '~/ducks/MyDuck';

import ErrorBoundary from '~/components/ErrorBoundary';
import Header from '~/appComponents/Header';
import Footer from '~/appComponents/Footer';

let alreadyFetched = false;

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false,
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
    dontLinkToLearnOrReview: PropTypes.number,

    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    currentUser: orFalse(PropTypes.object).isRequired
  }

  componentDidMount = () => {
    if (this.props.currentUser) {
      // Can't make the component not rerender
      if (!alreadyFetched) {
        this.props.MyActions.apiGetCourses();
      }
      alreadyFetched = true;

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
      <ErrorBoundary>
        <Header dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>
      </ErrorBoundary>

      <ErrorBoundary>
        {this.props.children}
      </ErrorBoundary>

      <Footer/>
    </main>
}

export default Main;
