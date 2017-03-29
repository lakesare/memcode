import React from 'react';

import { Header } from '~/components/Header';
import { Loading } from '~/components/Loading';
import { Link } from 'react-router';
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

      <Loading spe={this.state.speGetPage}>{({ problems, course, courseUserIsLearning }) =>
        <div className="container">
          <section className="actions">
            <h1>{course.title}</h1>
            <Link className="view" to={`/courses/${course.id}`}>
              <i className="fa fa-eye"/>
            </Link>
          </section>

          <ListOfProblems problems={problems} courseUserIsLearningId={courseUserIsLearning.id}/>
        </div>
      }</Loading>
    </main>
}

export { Page_courses_id_learn };
