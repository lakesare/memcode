const FormLineLayout = (props, inputElement, className = '') =>
  <section className={`form-line -${props.name}`}>
    <label htmlFor={props.name}>{props.label}</label>

    <div className="input-and-validation-error">
      <div className={`standard-input ${className}`}>
        {inputElement}
      </div>

      {
        props.formValidation[props.name] &&
        <div className="validation-error">
          {props.formValidation[props.name]}
        </div>
      }
    </div>
  </section>;

FormLineLayout.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  formValidation: PropTypes.object.isRequired
};

export { FormLineLayout };
