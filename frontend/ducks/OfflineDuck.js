import _ from 'lodash';
import api from '~/api';
import speCreator from '~/services/speCreator';
import storage from '~/services/offline/storage';
import fallbacks from '~/services/offline/fallbacks';
import changeTypes from '~/services/offline/changeTypes';
import tempIds from '~/services/offline/tempIds';
import uploadDataUrlImages from '~/services/offline/uploadDataUrlImages';
import sendChanges from '~/services/offline/sendChanges';
import FailedFlashcardsDuck from '~/ducks/FailedFlashcardsDuck';

const namespace = 'global.offline';

const SET = `${namespace}.SET`;
// [claude comment] handled by MyDuck's reducer
const COURSE_CREATED = `${namespace}.COURSE_CREATED`;
const COURSE_UPDATED = `${namespace}.COURSE_UPDATED`;
const COURSES_UPDATED = `${namespace}.COURSES_UPDATED`;
const FLASHCARDS_MOVED = `${namespace}.FLASHCARDS_MOVED`;
const TEMP_IDS_REPLACED = `${namespace}.TEMP_IDS_REPLACED`;

const initialState = {
  // [claude comment] what the last download saved - null if nothing is downloaded
  meta:                 null,
  status:               'idle', // 'idle' | 'downloadingCourses' | 'downloadingImages'
  nOfCoursesToDownload: 0,
  nOfCoursesDownloaded: 0,
  nOfImagesDownloaded:  0,
  nOfImagesFailed:      0,
  nOfQueuedChanges:     0,
  notices:              [],
  error:                null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET:
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const runInParallel = (items, nOfWorkers, ifShouldStop, doItem) => {
  const itemsLeft = [...items];
  const work = async () => {
    while (itemsLeft.length > 0 && !ifShouldStop()) {
      await doItem(itemsLeft.shift());
    }
  };
  return Promise.all(Array.from({ length: nOfWorkers }, work));
};

const collectStrings = (value) => {
  if (typeof value === 'string') {
    return [value];
  } else if (value && typeof value === 'object') {
    return Object.values(value).flatMap(collectStrings);
  } else {
    return [];
  }
};

const srcToUrl = (src) => {
  try {
    return new URL(src.replaceAll('&amp;', '&')).href;
  } catch {
    return null;
  }
};

const getImageUrls = (problems) => {
  const urls = new Set();
  problems.forEach((problem) => {
    collectStrings(problem.content).forEach((html) => {
      for (const match of html.matchAll(/<img[^>]*?\ssrc="(https?:\/\/[^"]+)"/g)) {
        const url = srcToUrl(match[1]);
        if (url) urls.add(url);
      }
    });
  });
  return [...urls];
};

// [claude comment] Web Locks make tabs take turns, so two tabs never send the same queued change twice
const withQueueLock = (fn) =>
  navigator.locks ? navigator.locks.request('memcode-change-queue', fn) : fn();

let imagesRunId = 0;
let ifImagesPaused = false;
// [claude comment] turning offline mode off mid-download cancels the download by moving this on
let downloadRunId = 0;
let ifUpdatingCourses = false;

// [claude comment] tells the other open tabs which temporary ids got replaced
const channel = typeof BroadcastChannel === 'undefined' ? null : new BroadcastChannel('memcode-offline');

// [claude comment] a fresh react-router key, so pages that refetch on a new location (e.g. /review) load the course under its real id
const replaceTempIdsInUrl = (idMap) => {
  const pathname = window.location.pathname;
  const newPathname = tempIds.replaceTempIdsInString(pathname, idMap);
  if (newPathname !== pathname) {
    const state = { ...window.history.state, key: Math.random().toString(36).slice(2, 10) };
    window.history.replaceState(state, '', newPathname + window.location.search);
    window.dispatchEvent(new PopStateEvent('popstate', { state }));
  }
};

// [claude comment] queueIds whose runChange() is waiting to hear how sending went
const awaitedQueueIds = new Set();
const outcomes = new Map();

const getActions = (dispatch, getState) => {
  const set = (payload) => dispatch({ type: SET, payload });
  const getOffline = () => getState().global.Offline;

  const loadState = async () => {
    const meta = await fallbacks.getMeta();
    const nOfQueuedChanges = await storage.countQueuedChanges();
    const notices = await storage.getNotices();

    if (meta && getOffline().status !== 'downloadingImages') {
      const downloadedUrls = await storage.getDownloadedImageUrls(await storage.openImagesCache());
      const nOfImagesDownloaded = meta.imageUrls.filter((url) => downloadedUrls.has(url)).length;
      set({ meta, nOfQueuedChanges, notices, nOfImagesDownloaded, nOfImagesFailed: 0 });
    } else {
      set({ meta: meta ? meta : null, nOfQueuedChanges, notices });
    }
  };

  const downloadImages = async () => {
    imagesRunId += 1;
    ifImagesPaused = false;
    const runId = imagesRunId;
    const imageUrls = getOffline().meta.imageUrls;
    set({ status: 'downloadingImages', error: null });

    const cache = await storage.openImagesCache();
    const downloadedUrls = await storage.getDownloadedImageUrls(cache);
    const urlsToDownload = imageUrls.filter((url) => !downloadedUrls.has(url));

    let nOfImagesDownloaded = imageUrls.length - urlsToDownload.length;
    let nOfImagesFailed = 0;
    set({ nOfImagesDownloaded, nOfImagesFailed });

    await runInParallel(urlsToDownload, 4, () => ifImagesPaused || runId !== imagesRunId, async (url) => {
      const ifSaved = await storage.downloadImage(cache, url);
      if (ifSaved) {
        nOfImagesDownloaded += 1;
      } else {
        nOfImagesFailed += 1;
      }
      if (runId === imagesRunId) set({ nOfImagesDownloaded, nOfImagesFailed });
    });

    if (runId === imagesRunId) set({ status: 'idle' });
  };

  const pauseImages = () => {
    ifImagesPaused = true;
    set({ status: 'idle' });
  };

  // [claude comment] a flashcard saved twice in a row (e.g. on Escape and on the blur after it) would otherwise be reported twice
  const addNoticeOnce = async (notice) => {
    const notices = await storage.getNotices();
    const ifAlreadyThere = notices.some((one) =>
      one.kind === notice.kind && one.what === notice.what && one.courseId === notice.courseId && one.problemId === notice.problemId && one.error === notice.error
    );
    if (!ifAlreadyThere) await storage.addNotice(notice);
  };

  const replaceTempIdsInThisTab = async (idMap) => {
    // [claude comment] meta first - initializeSideEffects() keeps only the courses listed in meta when it saves getMyEverything
    const meta = await fallbacks.getMeta();
    set({ meta: meta ? meta : null });
    dispatch({ type: TEMP_IDS_REPLACED, payload: idMap });
    FailedFlashcardsDuck.getActions(dispatch, getState).replaceTempIds(idMap);
    replaceTempIdsInUrl(idMap);
  };

  const replaceTempIdsEverywhere = async (idMap, courseIds) => {
    await storage.replaceTempIdsInResponses(
      ['meta', 'getMyEverything', ...courseIds.flatMap((courseId) => [`getForCourseActions:${courseId}`, `getLearnPage:${courseId}`])],
      idMap
    );
    await replaceTempIdsInThisTab(idMap);
    if (channel) channel.postMessage({ idMap });
  };

  const sendQueuedChanges = () => withQueueLock(async () => {
    if (!getState().global.Authentication.currentUser) return;

    const assignedIdMap = {};
    const courseIdsWithAssignedIds = new Set();

    const send = async (change, body) => {
      const preparedBody = (body.problem && body.problem.content) ?
        { ...body, problem: await uploadDataUrlImages(body.problem) } :
        body;
      return api.post[change.controller][change.method](
        false,
        change.reviewedAt ? { ...preparedBody, reviewedMsAgo: Date.now() - change.reviewedAt } : preparedBody
      );
    };

    const onSent = async (change, { result, body, assignedIds, idMap }) => {
      if (!_.isEmpty(assignedIds)) {
        await storage.putIds(assignedIds);
        // [claude comment] a change sent the moment it was made never had its temporary ids shown anywhere
        if (!awaitedQueueIds.has(change.queueId)) {
          Object.assign(assignedIdMap, assignedIds);
          courseIdsWithAssignedIds.add(change.context.courseId);
          // [claude comment] the course flashcards were moved to
          if (body.courseId) courseIdsWithAssignedIds.add(body.courseId);
        }
      }

      await storage.deleteQueuedChange(change.queueId);
      if (result.ifOverwroteOtherEdit) {
        await addNoticeOnce({ kind: 'overwrote', courseId: tempIds.replaceTempIds(change.context.courseId, idMap), problemId: body.id, at: Date.now() });
      }
      if (awaitedQueueIds.has(change.queueId)) outcomes.set(change.queueId, { status: 'sent', result });
    };

    // [claude comment] the server refused the change (e.g. the flashcard got deleted meanwhile) - sending it again won't help
    const onRefused = async (change, { error, body, idMap }) => {
      const changeType = changeTypes[`${change.controller}.${change.method}`];
      await storage.deleteQueuedChange(change.queueId);
      if (awaitedQueueIds.has(change.queueId)) {
        outcomes.set(change.queueId, { status: 'refused', error });
      } else if (changeType.noticeWhenRefused) {
        await addNoticeOnce({
          kind:      'refused',
          what:      changeType.noticeWhenRefused,
          error:     String(error),
          courseId:  tempIds.replaceTempIds(change.context.courseId, idMap),
          problemId: body.id,
          at:        Date.now()
        });
      }
    };

    await sendChanges({
      changes: await storage.getQueuedChanges(),
      idMap:   await storage.getIdMap(),
      send, onSent, onRefused
    });

    if (!_.isEmpty(assignedIdMap)) {
      await replaceTempIdsEverywhere(assignedIdMap, [...courseIdsWithAssignedIds]);
    }
    set({ nOfQueuedChanges: await storage.countQueuedChanges(), notices: await storage.getNotices() });
  });

  const onCourseCreated = async (courseDto) => {
    const meta = await fallbacks.getMeta();
    const newMeta = { ...meta, courseIds: [...meta.courseIds, courseDto.course.id] };
    await storage.putResponse('meta', newMeta);
    await storage.updateResponse('getMyEverything', (dtos) => [...dtos, courseDto]);
    set({ meta: newMeta });
    dispatch({ type: COURSE_CREATED, payload: courseDto });
  };

  const onCourseUpdated = (payload) =>
    dispatch({ type: COURSE_UPDATED, payload });

  const onFlashcardsMoved = (payload) =>
    dispatch({ type: FLASHCARDS_MOVED, payload });

  // [claude comment] same signature as api.post[controller][method]() - the change is sent right away when the server is reachable, and queued and applied to the offline download when it isn't
  const runChange = async (dispatchSpe, controller, method, body, context = {}) => {
    const changeType = changeTypes[`${controller}.${method}`];
    const currentUser = getState().global.Authentication.currentUser;
    if (dispatchSpe) dispatchSpe(speCreator.request());

    let prepared;
    let queueId;
    try {
      prepared = await changeType.prepare(body, { ...context, currentUser });
      queueId = await storage.addQueuedChange({
        controller, method, body,
        context:    { courseId: prepared.courseId ? prepared.courseId : context.courseId },
        tempIds:    prepared.tempIds,
        reviewedAt: prepared.reviewedAt
      });
    } catch {
      // [claude comment] no IndexedDB (e.g. some private windows) - send the change the way it was sent before offline mode existed
      return api.post[controller][method](dispatchSpe, body);
    }

    awaitedQueueIds.add(queueId);
    await sendQueuedChanges().catch(() => {});
    awaitedQueueIds.delete(queueId);
    const outcome = outcomes.get(queueId);
    outcomes.delete(queueId);

    if (outcome && outcome.status === 'refused') {
      if (dispatchSpe) dispatchSpe(speCreator.failure(outcome.error));
      return Promise.reject(outcome.error);
    }

    // [claude comment] another tab may have sent this change already, so temporary ids get replaced by whatever is known by now
    const idMap = await storage.getIdMap().catch(() => ({}));
    const result = outcome ? outcome.result : tempIds.replaceTempIds(prepared.localResult, idMap);
    if (await fallbacks.getMeta().catch(() => undefined)) {
      await changeType.applyLocally(
        tempIds.replaceTempIds(body, idMap),
        result,
        { courseId: tempIds.replaceTempIds(context.courseId, idMap), currentUser, onCourseCreated, onCourseUpdated, onFlashcardsMoved }
      ).catch((error) => console.log(error));
    }

    set({ nOfQueuedChanges: await storage.countQueuedChanges().catch(() => 0) });
    if (dispatchSpe) dispatchSpe(speCreator.success(result));
    return result;
  };

  // [claude comment] closing the tab kills an ordinary fetch mid-flight - keepalive lets this one outlive the page, and the queued copy is there in case it never reaches the server (sending it again later changes nothing)
  const runChangeOnPageHide = (controller, method, body, context = {}) => {
    if (getOffline().nOfQueuedChanges === 0) {
      api.post[controller][method](false, body, { keepalive: true }).catch(() => {});
    }
    storage.addQueuedChange({ controller, method, body, context }).catch(() => {});
  };

  const dismissNotice = async (noticeId) => {
    await storage.deleteNotice(noticeId);
    set({ notices: await storage.getNotices() });
  };

  // [claude comment] a course the server refuses (e.g. made private since) is left out, losing the connection throws
  const fetchCourses = async (courseIds, onCourseFetched = () => {}) => {
    const responses = {};
    const fetchedCourseIds = [];
    await runInParallel(courseIds, 4, () => false, async (courseId) => {
      try {
        responses[`getForCourseActions:${courseId}`] = await api.get.PageApi.getForCourseActions(false, { courseId });
        responses[`getLearnPage:${courseId}`]        = await api.get.PageApi.getLearnPage(false, { courseId });
        fetchedCourseIds.push(courseId);
      } catch (error) {
        if (error instanceof TypeError) throw error;
      }
      onCourseFetched();
    });

    const nOfFlashcardsPerCourse = {};
    fetchedCourseIds.forEach((courseId) => {
      nOfFlashcardsPerCourse[courseId] = responses[`getLearnPage:${courseId}`].problems.length;
    });
    const problems = fetchedCourseIds.flatMap((courseId) => responses[`getLearnPage:${courseId}`].problems);

    return { responses, fetchedCourseIds, nOfFlashcardsPerCourse, imageUrls: getImageUrls(problems) };
  };

  const toVersionByCourseId = (versions) =>
    _.fromPairs(versions.map(({ courseId, version }) => [courseId, version]));

  const download = async (ifWithImages) => {
    const currentUser = getState().global.Authentication.currentUser;
    downloadRunId += 1;
    const runId = downloadRunId;
    imagesRunId += 1;
    set({ status: 'downloadingCourses', nOfCoursesToDownload: 0, nOfCoursesDownloaded: 0, error: null });

    try {
      // [claude comment] changes made offline reach the server first, so the download already contains them
      await sendQueuedChanges();

      // [claude comment] versions before the courses - a change made while they download makes the version differ, so updateChangedCourses() picks it up
      const versions = await api.get.CourseApi.getMyCourseVersions(false, {});
      const myEverything = await api.get.CourseApi.getMyEverything(false, {});
      const getAllCategories = await api.get.CourseCategoryApi.getAll(false, {});
      const getUserPage = await api.get.PageApi.getUserPage(false, { userId: currentUser.id });
      set({ nOfCoursesToDownload: myEverything.length });

      const { responses, fetchedCourseIds, nOfFlashcardsPerCourse, imageUrls } = await fetchCourses(
        myEverything.map((dto) => dto.course.id),
        () => set({ nOfCoursesDownloaded: getOffline().nOfCoursesDownloaded + 1 })
      );

      const meta = {
        userId:         currentUser.id,
        downloadedAt:   new Date().toISOString(),
        lastSyncedAt:   new Date().toISOString(),
        ifWithImages,
        courseIds:      fetchedCourseIds,
        courseVersions: toVersionByCourseId(versions),
        nOfFlashcardsPerCourse,
        nOfFlashcards:  _.sum(Object.values(nOfFlashcardsPerCourse)),
        imageUrls:      ifWithImages ? imageUrls : []
      };

      if (runId !== downloadRunId) return;
      await storage.replaceAllResponses({
        ...responses,
        getMyEverything: myEverything.filter((dto) => fetchedCourseIds.includes(dto.course.id)),
        getAllCategories,
        getUserPage,
        meta
      });
      set({ meta, status: 'idle', nOfImagesDownloaded: 0, nOfImagesFailed: 0 });

      if (ifWithImages) downloadImages();
    } catch (error) {
      if (runId !== downloadRunId) return;
      set({
        status: 'idle',
        error: error instanceof TypeError ?
          "Download failed - can't reach Memcode." :
          `Download failed - ${error}`
      });
    }
  };

  const turnOff = async () => {
    downloadRunId += 1;
    imagesRunId += 1;
    await storage.deleteDownload();
    set({ meta: null, status: 'idle', nOfImagesDownloaded: 0, nOfImagesFailed: 0, error: null });
  };

  const setIfWithImages = async (ifWithImages) => {
    const meta = getOffline().meta;
    if (ifWithImages) {
      const learnPages = await Promise.all(meta.courseIds.map((courseId) => storage.getResponse(`getLearnPage:${courseId}`)));
      const problems = learnPages.filter(Boolean).flatMap((learnPage) => learnPage.problems);
      const newMeta = { ...meta, ifWithImages: true, imageUrls: getImageUrls(problems) };
      await storage.putResponse('meta', newMeta);
      set({ meta: newMeta });
      downloadImages();
    } else {
      imagesRunId += 1;
      await storage.deleteImages();
      const newMeta = { ...meta, ifWithImages: false, imageUrls: [] };
      await storage.putResponse('meta', newMeta);
      set({ meta: newMeta, status: 'idle', nOfImagesDownloaded: 0, nOfImagesFailed: 0 });
    }
  };

  // [claude comment] what changed on other devices or by coauthors since the download - only the courses whose version differs get downloaded again
  const updateChangedCourses = async () => {
    const meta = getOffline().meta;
    if (!meta || getOffline().status === 'downloadingCourses' || ifUpdatingCourses) return;
    ifUpdatingCourses = true;
    const runId = downloadRunId;

    try {
      await sendQueuedChanges();
      // [claude comment] the server's copy of a course would overwrite a change still waiting to be sent
      if ((await storage.countQueuedChanges()) > 0) return;

      const versions = await api.get.CourseApi.getMyCourseVersions(false, {});
      const changedVersions = versions.filter(({ courseId, version }) => meta.courseVersions[courseId] !== version);
      const changedCourseIds = changedVersions.map(({ courseId }) => courseId);
      const removedCourseIds = meta.courseIds.filter((courseId) => !versions.some((one) => one.courseId === courseId));
      if (changedCourseIds.length === 0 && removedCourseIds.length === 0) {
        if (runId !== downloadRunId) return;
        const syncedMeta = { ...getOffline().meta, lastSyncedAt: new Date().toISOString() };
        await storage.putResponse('meta', syncedMeta);
        set({ meta: syncedMeta });
        return;
      }

      const changedDtos = changedCourseIds.length > 0 ?
        await api.post.CourseApi.getMyEverything(false, { courseIds: changedCourseIds }) :
        [];
      const { responses, fetchedCourseIds, nOfFlashcardsPerCourse, imageUrls } = await fetchCourses(changedCourseIds);
      const fetchedDtos = changedDtos.filter((dto) => fetchedCourseIds.includes(dto.course.id));
      if (runId !== downloadRunId) return;

      // [claude comment] the latest meta - e.g. a course created while this ran is in it
      const latestMeta = getOffline().meta;
      const ifKept = (courseId) => !removedCourseIds.includes(courseId) && !fetchedCourseIds.includes(courseId);
      const newNOfFlashcardsPerCourse = { ..._.omit(latestMeta.nOfFlashcardsPerCourse, removedCourseIds), ...nOfFlashcardsPerCourse };
      const newMeta = {
        ...latestMeta,
        lastSyncedAt:           new Date().toISOString(),
        courseIds:              [...latestMeta.courseIds.filter(ifKept), ...fetchedCourseIds],
        courseVersions:         { ..._.omit(latestMeta.courseVersions, removedCourseIds), ...toVersionByCourseId(changedVersions) },
        nOfFlashcardsPerCourse: newNOfFlashcardsPerCourse,
        nOfFlashcards:          _.sum(Object.values(newNOfFlashcardsPerCourse)),
        imageUrls:              latestMeta.ifWithImages ? _.union(latestMeta.imageUrls, imageUrls) : []
      };

      await storage.putResponses(responses);
      await storage.deleteResponses(removedCourseIds.flatMap((courseId) => [`getForCourseActions:${courseId}`, `getLearnPage:${courseId}`]));
      await storage.updateResponse('getMyEverything', (dtos) => [...dtos.filter((dto) => ifKept(dto.course.id)), ...fetchedDtos]);
      // [claude comment] meta last - if this gets interrupted, the old versions in meta make the next check download these courses again
      await storage.putResponse('meta', newMeta);
      set({ meta: newMeta });
      dispatch({ type: COURSES_UPDATED, payload: { courseDtos: fetchedDtos, removedCourseIds } });

      if (newMeta.imageUrls.length > latestMeta.imageUrls.length && getOffline().status === 'idle') {
        downloadImages();
      }
    } catch (error) {
      console.log(error);
    } finally {
      ifUpdatingCourses = false;
    }
  };

  return {
    loadState, download, turnOff, setIfWithImages, updateChangedCourses, downloadImages, pauseImages,
    sendQueuedChanges, runChange, runChangeOnPageHide, dismissNotice,
    replaceTempIdsInThisTab
  };
};

// [claude comment] keeps the downloaded schedule in step with My.courses, so flashcards reviewed or learned since the download aren't served as due again offline
const initializeSideEffects = (store) => {
  const actions = getActions(store.dispatch, store.getState);
  let lastCourses = store.getState().global.My.courses;

  store.subscribe(() => {
    const My = store.getState().global.My;
    const meta = store.getState().global.Offline.meta;
    if (My.courses !== lastCourses) {
      lastCourses = My.courses;
      if (meta && My.coursesAlreadyFetched) {
        storage.putResponse(
          'getMyEverything',
          My.courses.filter((dto) => meta.courseIds.includes(dto.course.id))
        ).catch(() => {});
      }
    }
  });

  window.addEventListener('online', () => actions.updateChangedCourses());
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') actions.updateChangedCourses();
  });
  setInterval(() => {
    if (document.visibilityState === 'visible') actions.updateChangedCourses();
  }, 5 * 60 * 1000);
  if (channel) {
    channel.onmessage = (event) => {
      actions.replaceTempIdsInThisTab(event.data.idMap)
        .then(() => actions.loadState())
        .catch(() => {});
    };
  }

  // [claude comment] a page reloaded on a course created offline, which another tab has synced since
  storage.getIdMap()
    .then(replaceTempIdsInUrl)
    .then(() => actions.loadState())
    .then(() => actions.sendQueuedChanges())
    .then(() => actions.updateChangedCourses())
    .catch(() => {});
};

const actionTypes = { COURSE_CREATED, COURSE_UPDATED, COURSES_UPDATED, FLASHCARDS_MOVED, TEMP_IDS_REPLACED };

export default { reducer, getActions, initializeSideEffects, actionTypes };
