import React from 'react';

import { Header }       from '~/components/header';
import { Loading } from '~/components/Loading';
import { ListOfProblems } from './components/ListOfProblems';

import { apiGetCourse } from '~/ducks/courses/actions';

import css from './index.css';

class Page_courses_solve extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    }).isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      speGetCourse: {}
    };
  }

  componentDidMount = () => {
    apiGetCourse(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    );
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <Loading spe={this.state.speGetCourse}>{payload =>
          <div>
            <h1>{payload.course.title}</h1>
            <ListOfProblems problems={payload.problems}/>
          </div>
        }</Loading>
      </div>
    </main>
}

export { Page_courses_solve };
