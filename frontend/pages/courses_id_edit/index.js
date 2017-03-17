import React from 'react';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { OldProblem } from './components/OldProblem';
import { NewProblem } from './components/NewProblem';

import * as CourseApi from '~/api/Course';

import Immutable from 'immutable';

import css from './index.css';

class Page_courses_id_edit extends React.Component {
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
    CourseApi.show(
      spe => this.setState({ speGetCourse: spe }),
      this.props.params.id
    );
  }

  addNewProblem = (createdProblem) => {
    const spe = Immutable.fromJS(this.state.speGetCourse);
    const newSpe = spe.updateIn(['payload', 'problems'], problems => problems.push(createdProblem));

    this.setState({ speGetCourse: newSpe.toJS() });
  }

  updateOldProblem = (updatedProblem) => {
    const spe = Immutable.fromJS(this.state.speGetCourse);

    const index = spe.getIn(['payload', 'problems']).findIndex(
      (problem) => problem.get('id') === updatedProblem.id
    );
    const newSpe = spe.setIn(['payload', 'problems', index], updatedProblem);

    this.setState({ speGetCourse: newSpe.toJS() });
  }

  removeOldProblem = (problemId) => {
    const spe = Immutable.fromJS(this.state.speGetCourse);

    const index = spe.getIn(['payload', 'problems']).findIndex(
      (problem) => problem.get('id') === problemId
    );

    const newSpe = spe.updateIn(['payload', 'problems'], problems => problems.delete(index));

    this.setState({ speGetCourse: newSpe.toJS() });
  }

  renderListOfProblems = problems =>
    problems.map((problem) =>
      <OldProblem
        key={problem.id}
        problem={problem}
        updateOldProblem={this.updateOldProblem}
        removeOldProblem={this.removeOldProblem}
      />
    )

  render = () =>
    <main className={css.main}>
      <Header/>

      <Loading spe={this.state.speGetCourse}>{payload =>
        <div className="container">
          <h1>{payload.course.title}</h1>

          <section className="instructions row">
            <div className="col-2">ENTER</div>
            <div className="col-10">while some word is selected will make this word the one you'll have to recall when reviewing these memes.</div>

            <div className="col-2">CTRL+S</div>
            <div className="col-10">will save the new meme, it will also get saved automatically when you click from one meme to another.</div>

            <div className="col-2">CTRL+B</div>
            <div className="col-10">bold text</div>

            <div className="col-2">CTRL+K</div>
            <div className="col-10">code block</div>

            <div className="col-2">CTRL+ENTER</div>
            <div className="col-10">soft newline inside of the code block</div>
          </section>


          <section className="problems">
            <div className="thead row">
              <div className="col-6">Explanation</div>
              <div className="col-6">Content</div>
            </div>
            {this.renderListOfProblems(payload.problems)}
            <NewProblem courseId={this.props.params.id} addNewProblem={this.addNewProblem}/>
          </section>
        </div>
      }</Loading>
    </main>
}

export { Page_courses_id_edit };
