import React from 'react';
import PropTypes from 'prop-types';

import Tippy from '@tippyjs/react';

import css from './index.scss';

class StandardTooltip extends React.Component {
  static propTypes = {
    tooltipEl: PropTypes.oneOfType([PropTypes.element, PropTypes.string]).isRequired,
    children: PropTypes.any,

    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    tooltipProps: PropTypes.object,
  }

  static defaultProps = {
    children: null,
    tooltipProps: {},
    width: 200
  }

  render = () =>
    <Tippy
      content={<div style={{ fontSize: 12, maxWidth: this.props.width }}>{this.props.tooltipEl}</div>}
      className="standard-tooltip -bright"
      {...this.props.tooltipProps}
    >
      {
        this.props.children ?
          this.props.children :
          <button type="button" className={css.standardTooltipButton}>
            <i className="material-icons">info</i>
          </button>
      }
    </Tippy>
}

export default StandardTooltip;
