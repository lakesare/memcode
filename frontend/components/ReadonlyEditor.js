class ReadonlyEditor extends React.Component {
  static propTypes = {
    html: PropTypes.string.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  render = () =>
    <div className={`quill -readOnly ${this.props.className}`}>
      <div className="ql-container ql-snow">
        <div className="ql-editor" dangerouslySetInnerHTML={{ __html: this.props.html }}/>
      </div>
    </div>
}

export { ReadonlyEditor };
export default ReadonlyEditor;
