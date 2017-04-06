// spe objects creator

const request = () => ({
  status: 'request',
  payload: null,
  error: null
});

const success = payload => ({
  status: 'success',
  payload,
  error: null
});

const failure = errorString => ({
  status: 'failure',
  payload: null,
  error: errorString
});

export { request, success, failure };
