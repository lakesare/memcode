import orFalse from '~/services/orFalse';
import MyDuck from '~/ducks/MyDuck';

import ErrorBoundary from '~/components/ErrorBoundary';
import Header from '~/appComponents/Header';

import download from './image-1.jpg';

let alreadyFetched = false;

@connect(
  (state) => ({
    currentUser: state.global.Authentication.currentUser || false,
    My: state.global.My,
    Settings: state.global.Settings
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
    Settings: PropTypes.object.isRequired,
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

      // Lols this is not good, this erazes the state of the new flashcard from time to time.
      // this.apiSyncInterval = setInterval(() => {
      //   if (this.props.currentUser.username === 'lakesare') {
      //     console.log("force updating");
      //     this.setState({ key: new Date().getTime() });
      //   }
      // }, 60000);
    }

    if (this.props.My.speCategories.status !== 'success') {
      this.props.MyActions.apiGetCategories();
    }
  }

  componentWillUnmount() {
    // this.apiSyncInterval && clearInterval(this.apiSyncInterval);
  }

  // url = 'https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80'

  // https://images.unsplash.com/photo-1545614154-450a332ba71a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80

  render = () =>
    <main
      key={this.state.key}
      className={`${this.props.className}
        ${this.props.Settings.backgroundImage ? '-with-bg' : '-without-bg'} + ${this.props.Settings.backgroundImage && this.props.Settings.backgroundImage.includes('halloween') ? '-halloween' : ''}
        ${this.props.Settings.ifMonospace ? "-in-monospace" : "-in-normal-font"}
      `}
      style={this.props.Settings.backgroundImage ? {
        backgroundImage:
        (this.props.Settings.backgroundImage.includes('d46bf351cd6e') ?
          'linear-gradient(rgba(0, 0, 0, 0.44), rgba(0, 0, 0, 0.1)),' :
          'linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.3)),') +
          ` url("${this.props.Settings.backgroundImage}")`
      } : {}}
    >
      <ErrorBoundary>
        <Header dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>
      </ErrorBoundary>

      <ErrorBoundary>
        {this.props.children}
      </ErrorBoundary>
    </main>
}

export default Main;
