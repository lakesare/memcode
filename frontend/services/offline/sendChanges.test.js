import test from 'node:test';
import assert from 'node:assert/strict';

import sendChanges from './sendChanges.js';
import changeTypes from './changeTypes.js';
import storage from './storage.js';

// [claude comment] mirrors what the real endpoints do with ids: they come from one counter, and a change referring to an id the server doesn't have (e.g. a temporary id that never got replaced) is refused
const createFakeServer = () => {
  let lastId = 1000;
  const nextId = () => { lastId += 1; return lastId; };
  const db = {
    courses:  [{ id: 1, title: 'Source' }, { id: 10, title: 'Target' }],
    cuils:    [{ id: 2, courseId: 1 }, { id: 11, courseId: 10 }],
    problems: [{ id: 3, courseId: 1, position: 1, content: { content: 'existing' } }],
    puils:    [],
    reviews:  []
  };

  const find = (table, id) => {
    const row = db[table].find((one) => one.id === id);
    if (!row) throw `No such row in ${table}: ${id}`;
    return row;
  };
  const cuilOfCourse = (courseId) => db.cuils.find((cuil) => cuil.courseId === courseId);

  const endpoints = {
    'CourseApi.createCourse': ({ course }) => {
      const createdCourse = { id: nextId(), title: course.title };
      const cuil = { id: nextId(), courseId: createdCourse.id };
      db.courses.push(createdCourse);
      db.cuils.push(cuil);
      return { ...createdCourse, courseUserIsLearningId: cuil.id };
    },
    'CourseApi.updateCourse': ({ courseId, course }) => {
      const updatedCourse = find('courses', courseId);
      updatedCourse.title = course.title;
      return { course: updatedCourse, courseCategory: { id: 1, name: 'Other' } };
    },
    'ProblemApi.create': ({ problem }) => {
      find('courses', problem.courseId);
      const createdProblem = {
        id: nextId(),
        courseId: problem.courseId,
        content: problem.content,
        position: db.problems.filter((one) => one.courseId === problem.courseId).length + 1
      };
      db.problems.push(createdProblem);
      return createdProblem;
    },
    'ProblemApi.update': ({ id, problem }) => {
      find('problems', id).content = problem.content;
      return { ifOverwroteOtherEdit: false };
    },
    'ProblemApi.reorder': (positions) => {
      positions.forEach(({ id, position }) => { find('problems', id).position = position; });
      return {};
    },
    'ProblemApi.moveToCourseMany': ({ problemIds, courseId }) => {
      find('courses', courseId);
      const movedProblems = problemIds.map((id) => find('problems', id)).sort((a, b) => a.position - b.position);
      const newIdsByOldId = {};
      const newPuilIdsByOldId = {};
      movedProblems.forEach((problem) => {
        const copy = { ...problem, id: nextId(), courseId };
        newIdsByOldId[problem.id] = copy.id;
        db.problems.push(copy);
        db.puils.filter((puil) => puil.problemId === problem.id).forEach((puil) => {
          const puilCopy = { ...puil, id: nextId(), problemId: copy.id, courseUserIsLearningId: cuilOfCourse(courseId).id };
          newPuilIdsByOldId[puil.id] = puilCopy.id;
          db.puils.push(puilCopy);
        });
      });
      db.problems = db.problems.filter((one) => !problemIds.includes(one.id));
      db.puils = db.puils.filter((one) => !problemIds.includes(one.problemId));
      return { newIdsByOldId, newPuilIdsByOldId };
    },
    'ProblemUserIsLearningApi.learnProblem': ({ problemId }) => {
      const problem = find('problems', problemId);
      const puil = { id: nextId(), problemId, courseUserIsLearningId: cuilOfCourse(problem.courseId).id, ifIgnored: false };
      db.puils.push(puil);
      return puil;
    },
    'ProblemUserIsLearningApi.unlearnUnignoreProblem': ({ id }) => {
      find('puils', id);
      db.puils = db.puils.filter((one) => one.id !== id);
      return {};
    },
    'ProblemUserIsLearningApi.reviewProblem': ({ id, problemId, performanceRating }) => {
      const puil = db.puils.find((one) => one.problemId === problemId && one.courseUserIsLearningId === id);
      if (!puil) throw `No learning record for flashcard ${problemId} in ${id}`;
      db.reviews.push({ problemId, performanceRating });
      return {};
    }
  };

  return {
    db,
    send: async (change, body) =>
      endpoints[`${change.controller}.${change.method}`](structuredClone(body))
  };
};

// [claude comment] a browser with the courses downloaded, making changes offline the way OfflineDuck.runChange() does: same prepare() and applyLocally(), with the download kept in memory instead of IndexedDB
const createOfflineDevice = () => {
  const responses = new Map([
    ['getAllCategories', { courseCategories: [{ id: 1, name: 'Other' }] }],
    ['getForCourseActions:1', { course: { id: 1 }, amountOfProblems: 1 }],
    ['getLearnPage:1', {
      courseUserIsLearning: { id: 2 },
      problems: [{ id: 3, courseId: 1, position: 1, content: { content: 'existing' } }],
      problemUserIsLearnings: []
    }],
    ['getForCourseActions:10', { course: { id: 10 }, amountOfProblems: 0 }],
    ['getLearnPage:10', { courseUserIsLearning: { id: 11 }, problems: [], problemUserIsLearnings: [] }]
  ]);
  storage.getResponse = async (key) => responses.get(key);
  storage.putResponse = async (key, value) => { responses.set(key, value); };
  storage.updateResponse = async (key, update) => {
    if (responses.has(key)) responses.set(key, update(responses.get(key)));
  };

  const queue = [];
  let lastQueueId = 0;

  const run = async (name, body, context = {}) => {
    const [controller, method] = name.split('.');
    const prepared = await changeTypes[name].prepare(body, { ...context, currentUser: { id: 1 } });
    lastQueueId += 1;
    queue.push({
      queueId: lastQueueId,
      controller, method, body,
      context: { courseId: prepared.courseId ? prepared.courseId : context.courseId },
      tempIds: prepared.tempIds,
      reviewedAt: prepared.reviewedAt
    });
    await changeTypes[name].applyLocally(body, prepared.localResult, {
      ...context,
      currentUser: { id: 1 },
      onCourseCreated: async () => {},
      onCourseUpdated: () => {},
      onFlashcardsMoved: () => {}
    });
    return prepared.localResult;
  };

  return { queue, run, getLearnPage: (courseId) => responses.get(`getLearnPage:${courseId}`) };
};

// [claude comment] what OfflineDuck.sendQueuedChanges() does once the server is reachable, minus IndexedDB
const sync = async (device, send, idMap = {}) => {
  const sent = [];
  const refused = [];
  const removeFromQueue = (change) => device.queue.splice(device.queue.indexOf(change), 1);

  const { idMap: newIdMap, ifStopped } = await sendChanges({
    changes: [...device.queue],
    idMap,
    send,
    onSent: async (change) => { sent.push(change); removeFromQueue(change); },
    onRefused: async (change, { error }) => { refused.push({ change, error }); removeFromQueue(change); }
  });
  return { sent, refused, idMap: newIdMap, ifStopped };
};

const flashcard = (content, courseId) =>
  ({ problem: { type: 'separateAnswer', content: { content }, courseId } });

test('a course created offline reaches the server with its flashcards, their edits, learning and reviews', async () => {
  const server = createFakeServer();
  const device = createOfflineDevice();

  const course = await device.run('CourseApi.createCourse', { course: { title: 'New', description: '', courseCategoryId: 1, ifPublic: false } });
  const created = await device.run('ProblemApi.create', flashcard('question', course.id));
  await device.run('ProblemApi.update', { id: created.id, problem: { type: 'separateAnswer', content: { content: 'question, edited' } } }, { courseId: course.id });
  const puil = await device.run('ProblemUserIsLearningApi.learnProblem', { problemId: created.id }, { courseId: course.id });
  await device.run('ProblemUserIsLearningApi.reviewProblem', { id: puil.courseUserIsLearningId, problemId: created.id, performanceRating: 5 }, { courseId: course.id });

  const { refused } = await sync(device, server.send);

  assert.deepEqual(refused, []);
  const serverCourse = server.db.courses.find((one) => one.title === 'New');
  const serverProblem = server.db.problems.find((one) => one.courseId === serverCourse.id);
  assert.equal(serverProblem.content.content, 'question, edited');
  assert.equal(server.db.puils.filter((one) => one.problemId === serverProblem.id).length, 1);
  assert.deepEqual(server.db.reviews, [{ problemId: serverProblem.id, performanceRating: 5 }]);
});

test('a flashcard created and learned offline can be moved, then edited, reviewed and unlearned in the course it was moved to', async () => {
  const server = createFakeServer();
  const device = createOfflineDevice();

  const created = await device.run('ProblemApi.create', flashcard('to move', 1));
  const puil = await device.run('ProblemUserIsLearningApi.learnProblem', { problemId: created.id }, { courseId: 1 });
  const { newIdsByOldId, newPuilIdsByOldId } = await device.run('ProblemApi.moveToCourseMany', { problemIds: [created.id], courseId: 10 }, { courseId: 1 });
  const movedId = newIdsByOldId[created.id];
  await device.run('ProblemApi.update', { id: movedId, problem: { type: 'separateAnswer', content: { content: 'moved, edited' } } }, { courseId: 10 });
  await device.run('ProblemUserIsLearningApi.reviewProblem', { id: 11, problemId: movedId, performanceRating: 3 }, { courseId: 10 });
  await device.run('ProblemUserIsLearningApi.unlearnUnignoreProblem', { id: newPuilIdsByOldId[puil.id] }, { courseId: 10 });

  assert.deepEqual(device.getLearnPage(1).problems.map((one) => one.id), [3]);
  assert.deepEqual(device.getLearnPage(10).problems.map((one) => one.id), [movedId]);
  assert.deepEqual(device.getLearnPage(10).problemUserIsLearnings, []);

  const { refused } = await sync(device, server.send);

  assert.deepEqual(refused, []);
  const serverProblem = server.db.problems.find((one) => one.courseId === 10);
  assert.equal(serverProblem.content.content, 'moved, edited');
  assert.equal(server.db.problems.filter((one) => one.courseId === 1).length, 1);
  assert.deepEqual(server.db.reviews, [{ problemId: serverProblem.id, performanceRating: 3 }]);
  assert.deepEqual(server.db.puils, []);
});

test('a change the server refuses takes the changes that depend on it along, and leaves the others alone', async () => {
  const server = createFakeServer();
  const device = createOfflineDevice();
  // [claude comment] the course got deleted on another device while this one was offline
  server.db.courses = server.db.courses.filter((one) => one.id !== 10);

  const created = await device.run('ProblemApi.create', flashcard('in a deleted course', 10));
  await device.run('ProblemApi.update', { id: created.id, problem: { type: 'separateAnswer', content: { content: 'edited' } } }, { courseId: 10 });
  await device.run('ProblemApi.update', { id: 3, problem: { type: 'separateAnswer', content: { content: 'existing, edited' } } }, { courseId: 1 });

  const { sent, refused } = await sync(device, server.send);

  assert.deepEqual(refused.map(({ change }) => change.method), ['create', 'update']);
  assert.deepEqual(sent.map((change) => change.body.id), [3]);
  assert.equal(server.db.problems.length, 1);
  assert.equal(server.db.problems[0].content.content, 'existing, edited');
});

test('losing the connection midway keeps the rest queued, and the next sync uses the ids assigned before', async () => {
  const server = createFakeServer();
  const device = createOfflineDevice();

  const course = await device.run('CourseApi.createCourse', { course: { title: 'New', description: '', courseCategoryId: 1, ifPublic: false } });
  const created = await device.run('ProblemApi.create', flashcard('question', course.id));
  await device.run('ProblemUserIsLearningApi.learnProblem', { problemId: created.id }, { courseId: course.id });

  let nOfRequests = 0;
  const sendThenLoseConnection = (change, body) => {
    nOfRequests += 1;
    if (nOfRequests > 1) throw new TypeError('Failed to fetch');
    return server.send(change, body);
  };
  const firstSync = await sync(device, sendThenLoseConnection);

  assert.equal(firstSync.ifStopped, true);
  assert.equal(firstSync.sent.length, 1);
  assert.equal(device.queue.length, 2);

  const secondSync = await sync(device, server.send, firstSync.idMap);

  assert.equal(secondSync.ifStopped, false);
  assert.deepEqual(secondSync.refused, []);
  const serverCourse = server.db.courses.find((one) => one.title === 'New');
  const serverProblem = server.db.problems.find((one) => one.courseId === serverCourse.id);
  assert.equal(server.db.puils.filter((one) => one.problemId === serverProblem.id).length, 1);
});

test('reordering and renaming work on a course and flashcards created offline', async () => {
  const server = createFakeServer();
  const device = createOfflineDevice();

  const course = await device.run('CourseApi.createCourse', { course: { title: 'New', description: '', courseCategoryId: 1, ifPublic: false } });
  const first = await device.run('ProblemApi.create', flashcard('first', course.id));
  const second = await device.run('ProblemApi.create', flashcard('second', course.id));
  await device.run('ProblemApi.reorder', [{ id: second.id, position: 1 }, { id: first.id, position: 2 }], { courseId: course.id });
  await device.run('CourseApi.updateCourse', { courseId: course.id, course: { title: 'Renamed', description: '', courseCategoryId: 1, ifPublic: 'false' } }, { courseId: course.id });

  assert.deepEqual(device.getLearnPage(course.id).problems.map((one) => one.content.content), ['second', 'first']);

  const { refused } = await sync(device, server.send);

  assert.deepEqual(refused, []);
  const serverCourse = server.db.courses.find((one) => one.title === 'Renamed');
  const serverProblems = server.db.problems
    .filter((one) => one.courseId === serverCourse.id)
    .sort((a, b) => a.position - b.position);
  assert.deepEqual(serverProblems.map((one) => one.content.content), ['second', 'first']);
});
