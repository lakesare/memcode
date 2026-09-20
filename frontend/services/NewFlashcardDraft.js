// [claude comment] the new flashcard you typed but never saved, kept per course in localStorage so leaving the page doesn't lose it

const storageKey = 'newFlashcardPerCourse';

const readAll = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(storageKey));
    return (stored && typeof stored === 'object') ? stored : {};
  } catch {
    return {};
  }
};

const writeAll = (draftPerCourse) => {
  try {
    localStorage.setItem(storageKey, JSON.stringify(draftPerCourse));
  } catch {
    // a full or unavailable localStorage must never break typing
  }
};

const ifEmpty = (content) =>
  !content.content && !content.answer && !content.explanation;

const read = (courseId) => {
  const draft = readAll()[courseId];
  return draft ? draft : null;
};

const write = (courseId, type, content) => {
  const draftPerCourse = readAll();

  if (ifEmpty(content)) {
    delete draftPerCourse[courseId];
  } else {
    draftPerCourse[courseId] = { type, content };
  }

  writeAll(draftPerCourse);
};

const clear = (courseId) => {
  const draftPerCourse = readAll();
  delete draftPerCourse[courseId];
  writeAll(draftPerCourse);
};

export default { read, write, clear };
