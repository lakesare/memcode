import React from 'react';

import { Header }  from '~/components/Header';
import { Loading } from '~/components/Loading';
import { CourseActions } from '~/components/CourseActions';
import { ProblemBeingSolved } from './components/ProblemBeingSolved';
import { WhatNext } from './components/WhatNext';

import css from './index.css';

// person pressed ENTER,
//   if there are answers in problem:
//     -> if person answered them all?
//       we accept problem and move to the next problem.
//     -> if person didnt answer some?
//       missing answers are inputted, get red and readonly.
//       person presses ENTER once again, we record their score and
//       move onto the next problem
//       WHATEVER I DONT CARE ACCEPT ANYWAY button

//   if there are no answers in problem:
//     -> we accept problem and move to the next problem
class Page_courses_id_review extends React.Component {
  static propTypes = {
    params: React.PropTypes.shape({
      id: React.PropTypes.string
    }).isRequired,
    getPage: React.PropTypes.func.isRequired,

    speGetPage: React.PropTypes.object.isRequired,
    currentProblem: React.PropTypes.object,
  }

  componentDidMount = () => {
    this.props.getPage(this.props.params.id);
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <Loading spe={this.props.speGetPage}>{() =>
        <div className="container">
          <CourseActions courseId={this.props.params.id} ifCuilActivityButtonsAreDisplayed={false}/>

          {
            this.props.currentProblem ?
              <ProblemBeingSolved
                key={this.props.currentProblem.id} // is needed, otherwise Editor will just stay the same
                problem={this.props.currentProblem}
              /> :
              <WhatNext/>
          }

        </div>
      }</Loading>
    </main>
}

import { deriveCurrentProblem } from './selectors';
const mapStateToProps = (state) => {
  const pageState = state.pages.Page_courses_id_review;
  return {
    currentProblem: deriveCurrentProblem(pageState),
    speGetPage: pageState.speGetPage,
  };
};
import { Page_courses_id_review_Actions } from './reducer';
const { getPage } = Page_courses_id_review_Actions;
const mapDispatchToProps = (dispatch) => ({
  getPage: (courseId) => dispatch(getPage(courseId))
});

import { connect } from 'react-redux';
Page_courses_id_review = connect(mapStateToProps, mapDispatchToProps)(Page_courses_id_review);

export { Page_courses_id_review };
