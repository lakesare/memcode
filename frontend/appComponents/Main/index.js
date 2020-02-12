import Header from '~/appComponents/Header';
import Footer from '~/appComponents/Footer';

import MyDuck from '~/ducks/MyDuck';

@connect(
  () => ({}),
  (dispatch) => ({
    apiGetCourses: () => MyDuck.actions.apiGetCourses(dispatch)
  })
)
class Main extends React.Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    dontLinkToLearnOrReview: PropTypes.string,

    apiGetCourses: PropTypes.func.isRequired,
  }

  componentDidMount = () => {
    this.props.apiGetCourses();

    // every 5 minutes
    setInterval(() => {
      this.props.apiGetCourses();
    }, 5 * 60 * 1000);

    // this.apiGetCategories();
  }

  render = () =>
    <main className={this.props.className}>
      <Header dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>

      {this.props.children}

      <Footer/>
    </main>
}

export default Main;
