import React from 'react';

import { Header } from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { ListOfProblems } from './components/ListOfProblems';

import { commonFetch } from '~/api/commonFetch';

import css from './index.css';

class Page_courses_id_learn extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = { speGetPage: {} };
  }

  componentDidMount = () => {
    commonFetch(
      (spe) => this.setState({ speGetPage: spe }),
      'GET', `/api/pages/courses/${this.props.params.id}/learn`
    );
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <Loading spe={this.state.speGetPage}>{({ problems, courseUserIsLearning }) =>
        <div className="container">
          <CourseActions courseId={this.props.params.id} ifCuilActivityButtonsAreDisplayed={false}/>
          <ListOfProblems problems={problems} courseUserIsLearningId={courseUserIsLearning.id}/>
        </div>
      }</Loading>
    </main>
}

export { Page_courses_id_learn };
