import { expect } from 'chai';
import { IdsOfProblemsToLearnAndReviewPerCourseActions as actions, IdsOfProblemsToLearnAndReviewPerCourseReducer as reducer } from './index';

const createDispatch = (initialState) =>
  (action) => reducer(initialState, action);

const standardState = {
  4: {
    toReview: [14, 733],
    toLearn: [20]
  },
  80: {
    toReview: [1, 2],
    toLearn: []
  },
  83: {
    toReview: [],
    toLearn: [43, 543]
  },
  85: {
    toReview: [],
    toLearn: []
  }
};

describe('IdsOfProblemsToLearnAndReviewPerCourseReducer', () => {
  describe('deleteProblem', () => {
    it('removes from .toReview', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.deleteProblem(dispatch, 14);

      expect(finalState).to.deep.equal({ ...standardState, 4: { toReview: [733], toLearn: [20] } });
    });

    it('removes from .toReview (when course id is in the middle)', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.deleteProblem(dispatch, 1);

      expect(finalState).to.deep.equal({ ...standardState, 80: { toReview: [2], toLearn: [] } });
    });

    it('removes from .toLearn', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.deleteProblem(dispatch, 20);

      expect(finalState).to.deep.equal({ ...standardState, 4: { toReview: [14, 733], toLearn: [] } });
    });

    it('if we are not learning or reviewing this problem - do nothing', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.deleteProblem(dispatch, 111111);

      expect(finalState).to.deep.equal(standardState);
    });
  });

  describe('createProblem', () => {
    it('adds to .toLearn', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.createProblem(dispatch, 83, 1111);

      expect(finalState).to.deep.equal({ ...standardState, 83: { toReview: [], toLearn: [43, 543, 1111] } });
    });

    it('if we are not learning or reviewing this problem - do nothing', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.createProblem(dispatch, 111111, 5);

      expect(finalState).to.deep.equal(standardState);
    });
  });

  describe('stopLearningCourse', () => {
    it('removes this courseId all together (if integer id passed)', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.stopLearningCourse(dispatch, 4);
      expect(finalState.hasOwnProperty(4)).to.equal(false);
    });
    it('removes this courseId all together (if string id passed)', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.stopLearningCourse(dispatch, '4');
      expect(finalState.hasOwnProperty(4)).to.equal(false);
    });
  });

  describe('learnProblem', () => {
    it('removes from .toLearn, adds to .toReview', () => {
      const dispatch = createDispatch(standardState);
      const finalState = actions.learnProblem(dispatch, 20);

      expect(finalState).to.deep.equal({ ...standardState, 4: { toReview: [14, 733, 20], toLearn: [] } });
    });
  });
});
