import Header from '~/appComponents/Header';
import Footer from '~/appComponents/Footer';

class Main extends React.Component {
  static propTypes = {
    className: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    dontLinkToLearnOrReview: PropTypes.number
  }

  render = () =>
    <main className={this.props.className}>
      <Header dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>

      {this.props.children}

      <Footer/>
    </main>
}

export default Main;
