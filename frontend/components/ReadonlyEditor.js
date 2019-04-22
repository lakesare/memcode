class ReadonlyEditor extends React.Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render = () =>
    <div className={this.props.className}>
      <div className="quill">
        <div className="ql-container ql-snow">
          <div className="ql-editor" dangerouslySetInnerHTML={{ __html: this.props.html }}/>
        </div>
      </div>
    </div>
}

export { ReadonlyEditor };
export default ReadonlyEditor;
