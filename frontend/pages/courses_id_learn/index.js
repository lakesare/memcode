import Main from '~/appComponents/Main';

import CourseActions from '~/components/CourseActions';
import Tabs from './components/Tabs';

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
    <Main className={css.main} dontLinkToLearnOrReview={this.props.match.params.id}>
      <CourseActions courseId={this.props.match.params.id}/>

      <Tabs courseId={this.props.match.params.id}/>
    </Main>
}

export default Page;
