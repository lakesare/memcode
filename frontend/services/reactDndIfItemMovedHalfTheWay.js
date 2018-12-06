// code is largely taken from: http://react-dnd.github.io/react-dnd/examples-sortable-simple.html
import { findDOMNode } from 'react-dom';

// Only perform the move when the mouse has crossed half of the items height
// When dragging downwards, only move when the cursor is below 50%
// When dragging upwards, only move when the cursor is above 50%
const reactDndIfItemMovedHalfTheWay = (monitor, component, dragIndex, hoverIndex) => {
  // Determine rectangle on screen
  const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
  // Get vertical middle
  const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
  // Determine mouse position
  const clientOffset = monitor.getClientOffset();
  // Get pixels to the top
  const hoverClientY = clientOffset.y - hoverBoundingRect.top;

  if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
    // Dragging downwards
    return false;
  } else if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
    // Dragging upwards
    return false;
  } else {
    return true;
  }
};

export default reactDndIfItemMovedHalfTheWay;
