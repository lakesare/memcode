const getExclusiveIndexesInBetween = (int_1, int_2) => {
  const inBetweenIntegers = [];
  for (let integer = int_1 + 1; integer < int_2; integer++) {
    inBetweenIntegers.push(integer);
  }
  return inBetweenIntegers;
};

class Checkbox extends React.Component {
  static propTypes = {
    id: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    problems: PropTypes.array.isRequired,
    idsOfCheckedProblems: PropTypes.array.isRequired,
    updateIdsOfCheckedProblems: PropTypes.func.isRequired,
    apiSave: PropTypes.func.isRequired,
    ifChecked: PropTypes.bool.isRequired,
    flashcardOrder: PropTypes.bool.isRequired,
    lastClickedIndex: PropTypes.number,
    setLastClickedIndex: PropTypes.func.isRequired,
    // Sometimes not provided!
    dragHandleProps: PropTypes.object,
    // Shift-related props for visual feedback
    isShiftPressed: PropTypes.bool,
    hoveredIndex: PropTypes.number,
    setHoveredIndex: PropTypes.func,
    // Last click action tracking
    lastClickAction: PropTypes.string,
    setLastClickAction: PropTypes.func
  }

  handleMouseEnter = () => {
    if (this.props.setHoveredIndex) {
      this.props.setHoveredIndex(this.props.index);
    }
  }

  handleMouseLeave = () => {
    if (this.props.setHoveredIndex) {
      this.props.setHoveredIndex(null);
    }
  }

  handleClick = (event) => {
    event.currentTarget.focus();
    this.props.apiSave();

    const problems = this.props.problems;
    const currentDisplayIndex = this.props.index;

    // Helper to get problem at a given display index
    // The problems array is now correctly ordered for display, so display index = array index
    const getProblemAtDisplayIndex = (displayIndex) => {
      return problems[displayIndex];
    };

    if (event.shiftKey && this.props.lastClickedIndex !== null && this.props.lastClickedIndex !== undefined) {
      // Shift-click: toggle range between last clicked and current
      const startIndex = Math.min(this.props.lastClickedIndex, currentDisplayIndex);
      const endIndex = Math.max(this.props.lastClickedIndex, currentDisplayIndex);
      
      console.log('Shift-click debug:', {
        clickedCheckboxNumber: currentDisplayIndex + 1,
        lastClickedCheckboxNumber: this.props.lastClickedIndex + 1,
        currentDisplayIndex: currentDisplayIndex,
        lastClickedIndex: this.props.lastClickedIndex,
        startIndex: startIndex,
        endIndex: endIndex,
        flashcardOrder: this.props.flashcardOrder,
        problemsLength: problems.length
      });
      
      // Get all problem IDs in the range
      const rangeIds = [];
      for (let displayIndex = startIndex; displayIndex <= endIndex; displayIndex++) {
        const problemAtThisDisplayIndex = getProblemAtDisplayIndex(displayIndex);
        if (problemAtThisDisplayIndex) {
          console.log(`Display index ${displayIndex} -> checkbox ${displayIndex + 1}, problem ID: ${problemAtThisDisplayIndex.id}`);
          rangeIds.push(problemAtThisDisplayIndex.id);
        }
      }
      
      // Use the last click action to determine what to do with the range
      // If last click was 'unselect', unselect the range; if 'select', select the range
      const shouldSelectRange = this.props.lastClickAction === 'select';
      
      console.log('Range toggle logic:');
      console.log('  Range IDs:', rangeIds);
      console.log('  Last click action:', this.props.lastClickAction);
      console.log('  Should select range?', shouldSelectRange);
      console.log('  Existing checked IDs:', this.props.idsOfCheckedProblems);
      
      // Debug each item in range
      rangeIds.forEach(id => {
        const isSelected = this.props.idsOfCheckedProblems.includes(id);
        console.log(`  ID ${id}: ${isSelected ? 'SELECTED' : 'NOT selected'}`);
      });
      
      let newSelection;
      if (shouldSelectRange) {
        // Last click was 'select', so select the entire range
        const allIds = [...this.props.idsOfCheckedProblems, ...rangeIds];
        newSelection = [...new Set(allIds)];
        console.log('Selecting range (last action was select):', rangeIds);
      } else {
        // Last click was 'unselect', so unselect the entire range
        newSelection = this.props.idsOfCheckedProblems.filter(id => !rangeIds.includes(id));
        console.log('Unselecting range (last action was unselect):', rangeIds);
      }
      
      this.props.updateIdsOfCheckedProblems(newSelection);
    } else {
      // Normal click: toggle single item
      console.log('Normal click debug:', {
        clickedCheckboxNumber: currentDisplayIndex + 1,
        currentDisplayIndex: currentDisplayIndex,
        thisPropsId: this.props.id,
        isCurrentlyChecked: this.props.ifChecked
      });
      
      if (this.props.ifChecked) {
        // Uncheck this item
        this.props.updateIdsOfCheckedProblems(
          this.props.idsOfCheckedProblems.filter((id) => id !== this.props.id)
        );
        // Track that the last action was 'unselect'
        if (this.props.setLastClickAction) {
          this.props.setLastClickAction('unselect');
        }
      } else {
        // Check this item
        this.props.updateIdsOfCheckedProblems([
          ...this.props.idsOfCheckedProblems,
          this.props.id
        ]);
        // Track that the last action was 'select'
        if (this.props.setLastClickAction) {
          this.props.setLastClickAction('select');
        }
      }
    }

    // Update the last clicked index for future shift-clicks
    this.props.setLastClickedIndex(currentDisplayIndex);
  }

  render = () => {
    // Calculate the correct checkbox number to display
    const checkboxNumber = this.props.flashcardOrder ? 
      this.props.problems.length - this.props.index : 
      this.props.index + 1;
    
    // Visual feedback logic
    const isAnchor = this.props.lastClickedIndex === this.props.index;
    let isInRange = false;
    
    if (this.props.isShiftPressed && 
        this.props.hoveredIndex !== null && 
        this.props.lastClickedIndex !== null) {
      const startIndex = Math.min(this.props.lastClickedIndex, this.props.hoveredIndex);
      const endIndex = Math.max(this.props.lastClickedIndex, this.props.hoveredIndex);
      isInRange = this.props.index >= startIndex && this.props.index <= endIndex;
    }
    
    // Build className based on states
    let className = "checkbox";
    if (isAnchor && this.props.isShiftPressed) {
      className += " -shift-anchor";
    }
    if (isInRange && this.props.isShiftPressed && this.props.hoveredIndex !== null) {
      className += " -shift-range";
    }
    
    return (
      // we can't make it a button, because then drag won't work well
      <section
        className={className}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...(this.props.dragHandleProps || {})}
        // disable checkbox for keyboard navigation, it's more easily done via the mouse anyway!
        tabIndex={-1}
      >
        {checkboxNumber}
      </section>
    );
  }
}

export default Checkbox;
