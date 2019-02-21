import React from 'react';
import PropTypes from 'prop-types';

import { Tooltip } from 'react-tippy';

import css from './index.scss';

class StandardTooltip extends React.Component {
  static propTypes = {
    tooltipEl: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    children: PropTypes.any,

    className: PropTypes.string
  }

  static defaultProps = {
    children: null,
    className: ''
  }

  render = () =>
    <Tooltip
      className={`${this.props.className} ${css.div} ${this.props.children ? '-with-children' : '-without-children'}`}
      html={<div className={css.html}>{this.props.tooltipEl}</div>}
      position="top"
      trigger="mouseenter"
      arrow
    >
      {
        this.props.children ?
          this.props.children :
          <i className="fa fa-info-circle"/>
      }
    </Tooltip>
}

export default StandardTooltip;
