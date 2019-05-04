class FormLineLayout extends React.Component {
  static propTypes = {
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    name: PropTypes.string.isRequired,
    formValidation: PropTypes.object.isRequired,
    children: PropTypes.element.isRequired
  }

  render = () =>
    <section className={`form-line -${this.props.name}`}>
      <label htmlFor={this.props.name}>{this.props.label}</label>

      <div className="input-and-validation-error">
        <div className="input">
          {this.props.children}
        </div>

        {
          this.props.formValidation[this.props.name] &&
          <div className="validation-error">
            {this.props.formValidation[this.props.name]}
          </div>
        }
      </div>
    </section>
}

export { FormLineLayout };
export default FormLineLayout;
