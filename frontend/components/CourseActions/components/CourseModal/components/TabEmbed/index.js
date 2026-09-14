class TabEmbed extends React.Component {
  static propTypes = {
    course: PropTypes.object.isRequired
  }

  render = () =>
    <div>
      <div className="standard-modal__description">Embed the flashcards from this course into an iframe (useful if you want to include your flashcards into some presentation, for example in genial.ly).</div>

      <p>
        {`<iframe src="https://www.memcode.com/courses/${this.props.course.id}/review/simulated?embed=true" scrolling="yes" style="width: 100%; height: 100%;"></iframe>`}
      </p>
    </div>
}

export default TabEmbed;
