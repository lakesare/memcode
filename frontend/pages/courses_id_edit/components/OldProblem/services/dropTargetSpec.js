import reactDndIfItemMovedHalfTheWay from '~/services/reactDndIfItemMovedHalfTheWay';

const dropTargetSpec = {
  hover: (props, monitor, component) => {
    const dragIndex = monitor.getItem().index; // our component's index
    const hoverIndex = props.index; // what we're hovering over

    if (reactDndIfItemMovedHalfTheWay(monitor, component, dragIndex, hoverIndex)) {
      if (dragIndex !== hoverIndex) {
        // time to actually perform the action
        props.uiReorderOldProblem(dragIndex, hoverIndex);
        console.log(`Reordering problem from ${dragIndex} to ${hoverIndex}`);

        // without this line items will keep on running up and down
        monitor.getItem().index = hoverIndex;
      }
    }
  }
};

export default dropTargetSpec;
