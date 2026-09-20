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
    dragHandleProps: PropTypes.object,
    isShiftPressed: PropTypes.bool,
    hoveredIndex: PropTypes.number,
    setHoveredIndex: PropTypes.func
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

    const getProblemAtDisplayIndex = (displayIndex) => {
      return problems[displayIndex];
    };

    if (event.shiftKey && this.props.lastClickedIndex !== null && this.props.lastClickedIndex !== undefined) {
      const startIndex = Math.min(this.props.lastClickedIndex, currentDisplayIndex);
      const endIndex = Math.max(this.props.lastClickedIndex, currentDisplayIndex);

      const rangeIds = [];
      for (let displayIndex = startIndex; displayIndex <= endIndex; displayIndex++) {
        const problemAtThisDisplayIndex = getProblemAtDisplayIndex(displayIndex);
        if (problemAtThisDisplayIndex) {
          rangeIds.push(problemAtThisDisplayIndex.id);
        }
      }

      const shouldSelectRange = !this.props.ifChecked;

      let newSelection;
      if (shouldSelectRange) {
        const allIds = [...this.props.idsOfCheckedProblems, ...rangeIds];
        newSelection = [...new Set(allIds)];
      } else {
        newSelection = this.props.idsOfCheckedProblems.filter(id => !rangeIds.includes(id));
      }

      this.props.updateIdsOfCheckedProblems(newSelection);
    } else {
      if (this.props.ifChecked) {
        this.props.updateIdsOfCheckedProblems(
          this.props.idsOfCheckedProblems.filter((id) => id !== this.props.id)
        );
      } else {
        this.props.updateIdsOfCheckedProblems([
          ...this.props.idsOfCheckedProblems,
          this.props.id
        ]);
      }
    }

    this.props.setLastClickedIndex(currentDisplayIndex);
  }

  render = () => {
    const checkboxNumber = this.props.flashcardOrder ?
      this.props.problems.length - this.props.index :
      this.props.index + 1;

    const ifRangeSelectIsAvailable = this.props.isShiftPressed && this.props.idsOfCheckedProblems.length > 0;
    const isAnchor = this.props.lastClickedIndex === this.props.index;
    let isInRange = false;

    if (ifRangeSelectIsAvailable &&
        this.props.hoveredIndex !== null &&
        this.props.lastClickedIndex !== null) {
      const startIndex = Math.min(this.props.lastClickedIndex, this.props.hoveredIndex);
      const endIndex = Math.max(this.props.lastClickedIndex, this.props.hoveredIndex);
      isInRange = this.props.index >= startIndex && this.props.index <= endIndex;
    }

    let className = "checkbox";
    if (isAnchor && ifRangeSelectIsAvailable) {
      className += " -shift-anchor";
    }
    if (isInRange && ifRangeSelectIsAvailable && this.props.hoveredIndex !== null) {
      className += " -shift-range";
    }

    return (
      <section
        className={className}
        onClick={this.handleClick}
        onMouseEnter={this.handleMouseEnter}
        onMouseLeave={this.handleMouseLeave}
        {...(this.props.dragHandleProps || {})}
        tabIndex={-1}
      >
        {checkboxNumber}
      </section>
    );
  }
}

export default Checkbox;
