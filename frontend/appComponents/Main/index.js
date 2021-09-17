import orFalse from '~/services/orFalse';
import MyDuck from '~/ducks/MyDuck';

import ErrorBoundary from '~/components/ErrorBoundary';
import Header from '~/appComponents/Header';
import Footer from '~/appComponents/Footer';

import download from './image-1.jpg';

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

  state = {
    key: 'new'
  }

  componentDidMount = () => {
    if (this.props.currentUser) {
      // Can't make the component not rerender
      if (!alreadyFetched) {
        this.props.MyActions.apiGetCourses();
      }
      alreadyFetched = true;

      // every 5 minutes
      // this.apiSyncInterval = setInterval(() => {
      //   this.props.MyActions.apiGetCourses();
      // }, 5 * 60 * 1000);

      this.apiSyncInterval = setInterval(() => {
        if (this.props.currentUser.username === 'lakesare') {
          console.log("force updating");
          this.setState({ key: new Date().getTime() });
        }
      }, 60000);
    }

    if (this.props.My.speCategories.status !== 'success') {
      this.props.MyActions.apiGetCategories();
    }
  }

  componentWillUnmount() {
    this.apiSyncInterval && clearInterval(this.apiSyncInterval);
  }

  // url = 'https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80'

  render = () =>
    <main
      key={this.state.key}
      className={this.props.className + ` ${this.props.My.backgroundImage ? '-with-bg' : ''}`}
      style={this.props.My.backgroundImage ? { backgroundImage: `url("${this.props.My.backgroundImage}")` } : {}}
    >
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
