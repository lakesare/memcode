import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

import { CourseActions } from '~/components/CourseActions';
import { Tabs } from './components/Tabs';

import css from './index.css';

class Page extends React.Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.shape({
        id: PropTypes.string
      })
    }).isRequired
  }

  render = () =>
    <main className={css.main}>
      <Header dontLinkToLearnOrReview={this.props.match.params.id}/>

      <CourseActions courseId={this.props.match.params.id} ifCuilActivityButtonsAreDisplayed={false}/>
      <div className="container">
        <Tabs courseId={this.props.match.params.id}/>
      </div>

      <Footer/>
    </main>
}

export default Page;
