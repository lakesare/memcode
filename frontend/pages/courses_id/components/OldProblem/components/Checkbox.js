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
    // Sometimes not provided!
    dragHandleProps: PropTypes.object
  }

  uncheck = (event) => {
    event.currentTarget.focus();
    this.props.apiSave();

    this.props.updateIdsOfCheckedProblems(
      this.props.idsOfCheckedProblems.filter((id) => id !== this.props.id)
    );
  }

  check = (event) => {
    event.currentTarget.focus();
    this.props.apiSave();

    const idsOfCheckedProblems = this.props.idsOfCheckedProblems;
    const problems = this.props.problems;
    const idsOfProblemsToCheck = [];

    // ___if shift is pressed while we're clicking a checkbox:
    //    1. find the lowest (on a screen) index,
    //    2. BUT higher than this flashcard's index
    //    3. which is already checked
    if (event.shiftKey) {
      const currentIndex = this.props.index;

      // 1
      // 2 - checked
      // 3
      // 4 - we're checking currently, while pressing shift
      // 5
      let nextCheckedIndexGoingFromBottom = null;
      // starting from our own index - travel up the screen, looking for the very first checked problem
      for (let index = currentIndex - 1; index >= 0; index--) {
        const problem = problems[index];
        const thisProblemIsCheckedToo = idsOfCheckedProblems.includes(problem.id);
        if (thisProblemIsCheckedToo) {
          nextCheckedIndexGoingFromBottom = index;
          break;
        }
      }

      if (nextCheckedIndexGoingFromBottom) {
        // fill in exactly exclusive in-between (nextCheckedIndexGoingFromBottom...currentIndex)
        const indexesOfProblemsToCheck = getExclusiveIndexesInBetween(nextCheckedIndexGoingFromBottom, currentIndex);
        problems.map((problem, index) => {
          if (indexesOfProblemsToCheck.includes(index)) {
            idsOfProblemsToCheck.push(problem.id);
          }
        });
        idsOfProblemsToCheck.push(this.props.id);
      } else {
        idsOfProblemsToCheck.push(this.props.id);
      }
    // ___if shift is not pressed:
    //    1. just normally add the clicked problem
    } else {
      idsOfProblemsToCheck.push(this.props.id);
    }

    this.props.updateIdsOfCheckedProblems([
      ...this.props.idsOfCheckedProblems,
      ...idsOfProblemsToCheck
    ]);
  }

  render = () =>
    // we can't make it a button, because then drag won't work well
    <section
      className="checkbox"
      onClick={this.props.ifChecked ? this.uncheck : this.check}
      {...(this.props.dragHandleProps || {})}
      // disable checkbox for keyboard navigation, it's more easily done via the mouse anyway!
      tabIndex={-1}
    >
      {this.props.index + 1}
    </section>
}

export default Checkbox;
