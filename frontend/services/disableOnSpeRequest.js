const disableOnSpeRequest = (spe) =>
  spe.status === 'request' ?
    { opacity: 0.1, cursor: 'not-allowed', pointerEvents: 'none' } :
    {};

export default disableOnSpeRequest;
