import React from 'react';
import PropTypes from 'prop-types';

// ___why not just pass this.props.tabs = { itinerary: <h1></h1> } as a prop here, and let it manage them itself, and keep state here instead of in its parent?
// because we have .title_and_buttons, which needs access to adjacent intab forms, which would force us to keep all of their interaction in a parent component (this could be avoided by using redux, but even then this setup is more customizable)
class TabNavigation extends React.Component {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    selectTab: PropTypes.func.isRequired,
    selectedTab: PropTypes.string.isRequired,
    disabledTabs: PropTypes.array
  }

  static defaultProps = {
    disabledTabs: []
  }

  selectTab = (name) => {
    if (this.props.selectedTab !== name) {
      this.props.selectTab(name);
    }
  }

  render = () =>
    <nav className="standard-tab-navigation">
      {
        this.props.tabs
          .filter(name => !this.props.disabledTabs.includes(name))
          .map(name =>
            <button
              key={name}
              type="button"
              className={this.props.selectedTab === name ? 'selected' : ''}
              onClick={() => this.selectTab(name)}
            >
              {name}
            </button>
          )
      }
    </nav>
}

export default TabNavigation;
