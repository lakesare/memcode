const disableOnSpeRequest = (spe, { opacity = 0.1 } = {}) =>
  spe.status === 'request' ?
    { opacity, cursor: 'not-allowed', pointerEvents: 'none' } :
    {};

export default disableOnSpeRequest;
