import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';

import { CourseActions } from '~/components/CourseActions';
import { Tabs } from './components/Tabs';
import { Instructions } from './components/Instructions';

import css from './index.css';

class Page_courses_id_learn extends React.Component {
  static propTypes = {
    params: PropTypes.shape({
      id: PropTypes.string
    }).isRequired
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <CourseActions courseId={this.props.params.id} ifCuilActivityButtonsAreDisplayed={false}/>
        <Instructions/>
        <Tabs courseId={this.props.params.id}/>
      </div>

      <Footer/>
    </main>
}

export { Page_courses_id_learn };
