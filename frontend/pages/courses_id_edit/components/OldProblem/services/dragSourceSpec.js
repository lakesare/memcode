const dragSourceSpec = {
  beginDrag: (props) => ({
    index: props.index
  }),

  endDrag: (props) => {
    props.apiReorderProblems();
  }
};

export default dragSourceSpec;
