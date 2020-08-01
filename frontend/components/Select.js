import React, { Component } from 'react';
import PropTypes from 'prop-types';

import ReactSelect from 'react-select';

// A purposefully minimal wrapper around react-select that:
// - allows us to array for options,
// - and doesn't require us to pass an excessive { label, value } for value.
// This component should be limited to this functionality, imagine it's our react-select.
class Select extends Component {
  static propTypes = {
    options: PropTypes.oneOfType([
      // Either what react-select accepts by default
      PropTypes.arrayOf(PropTypes.shape({
        value: PropTypes.any.isRequired,
        label: PropTypes.string.isRequired,
      })),
      // Or a handy ['Apple', 'Orange'] shortcut
      PropTypes.arrayOf(PropTypes.string),
      // Or withGroups structure
      PropTypes.arrayOf(PropTypes.shape({
        label: PropTypes.string.isRequired,
        options: PropTypes.arrayOf(PropTypes.shape({
          value: PropTypes.any.isRequired,
          label: PropTypes.string.isRequired,
        })),
      })),
    ]).isRequired,

    value: PropTypes.any,
    updateValue: PropTypes.func.isRequired,

    withGroups: PropTypes.bool,
  }

  static defaultProps = {
    withGroups: false,
  }

  render = () => {
    let options;
    let value;

    // Todo refactor + see if we ever pass arrays for options
    if (this.props.withGroups) {
      options = this.props.options;

      let actualOptions = [];
      this.props.options.forEach((label_options) => {
        actualOptions = actualOptions.concat(label_options.options);
      });

      // Let's make our <Select> only accept a .value, .label doesn't need to be passed every time!
      value = this.props.value ?
        {
          value: this.props.value,
          // todo lakesare, check if it works with arrays, do we even use arrays somewhere
          label: actualOptions.find((option) => option.value === this.props.value).label,
        } :
        null;
    } else {
      // Let's make our <Select> accept an array of strings too!
      options = this.props.options[0] && this.props.options[0].value ?
        this.props.options :
        this.props.options.map((option) => ({ value: option, label: option }));

      // Let's make our <Select> only accept a .value, .label doesn't need to be passed every time!
      value = this.props.value ?
        {
          value: this.props.value,
          // todo lakesare, check if it works with arrays, do we even use arrays somewhere
          label: options.find((option) => option.value === this.props.value).label,
        } :
        null;
    }

    // <Select updateValue={}/> should also just return the value without the label.
    const onChange = (valueLabel) => {
      this.props.updateValue(valueLabel.value);
    };

    return (
      <ReactSelect
        {...this.props}
        // menuIsOpen
        className="react-select"
        classNamePrefix="react-select"
        value={value}
        onChange={onChange}
        options={options}
      />
    );
  }
}

export default Select;
