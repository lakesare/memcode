import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tippy';

import css from './index.scss';

class StandardTooltip extends React.Component {
  static propTypes = {
    tooltipEl: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    children: PropTypes.any,

    className: PropTypes.string,
    tooltipProps: PropTypes.object,
    width: PropTypes.number
  }

  static defaultProps = {
    children: null,
    className: '',
    tooltipProps: {},
    width: 200
  }

  render = () =>
    <Tooltip
      className={`${this.props.className} ${css.div} ${this.props.children ? '-with-children' : '-without-children'}`}
      html={
        <div style={{ fontSize: 12, maxWidth: this.props.width }}>{this.props.tooltipEl}</div>
      }
      position="top"
      trigger="mouseenter"
      arrow
      useContext
      // open
      {...this.props.tooltipProps}
    >
      {
        this.props.children ?
          this.props.children :
          <i className="material-icons">info</i>
      }
    </Tooltip>
}

export default StandardTooltip;
