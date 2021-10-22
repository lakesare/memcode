import { Link } from 'react-router-dom';
import StandardTooltip from '~/components/StandardTooltip';
import ThemeToggleButton from '~/appComponents/ThemeToggleButton';
import LearnReviewLinks from './components/LearnReviewLinks';
import NotificationsTogglerAndDropdown from './components/NotificationsTogglerAndDropdown';

class CurrentUser extends React.Component {
  static propTypes = {
    currentUser: PropTypes.object.isRequired,
    signOut: PropTypes.func.isRequired,
    dontLinkToLearnOrReview: PropTypes.number
  }

  state = {
    hideSearchBox: localStorage.getItem('hideSearchBox') === 'true' ? true : false,
    hideLinks: localStorage.getItem('hideLinks') === 'true' ? true : false,
    hideFooter: localStorage.getItem('hideFooter') === 'true' ? true : false,
    hideSocialButtons: localStorage.getItem('hideSocialButtons') === 'true' ? true : false
  }

  componentDidMount = () => {
    this.uiUpdateBody('hideSearchBox', this.state.hideSearchBox);
    this.uiUpdateBody('hideLinks', this.state.hideLinks);
    this.uiUpdateBody('hideFooter', this.state.hideFooter);
    this.uiUpdateBody('hideSocialButtons', this.state.hideSocialButtons);
  }

  uiUpdateBody = (what, value) => {
    const bodyEl = document.body;
    if (value) {
      bodyEl.classList.add('-' + what);
    } else {
      bodyEl.classList.remove('-' + what);
    }
  }

  toggleValue = (what) => {
    const newValue = !this.state[what];
    localStorage.setItem(what, newValue);
    this.setState({ [what]: newValue });
    this.uiUpdateBody(what, newValue);
  }

  renderDropdown = () =>
    <div>
      <div style={{ "textAlign": "right" }}>Signed in as {this.props.currentUser.username} | via {this.props.currentUser.oauthProvider}</div>
      <ul style={{ marginTop: 10 }} className="standard-tooltip-dropdown">
        <li>
          <Link to={`/users/${this.props.currentUser.id}`}>Profile</Link>
        </li>
        <li>
          <button
            type="button"
            onClick={this.props.signOut}
          >
            Sign Out
          </button>
        </li>
        <li>
          <button className="button -clear" onClick={() => this.toggleValue('hideSearchBox')} type="button">
            {
              this.state.hideSearchBox ?
                'Show search box' :
                'Hide search box'
            }
          </button>
        </li>
        <li>
          <button className="button -clear" onClick={() => this.toggleValue('hideLinks')} type="button">
            {
              this.state.hideLinks ?
                'Show Review links' :
                'Hide Review links'
            }
          </button>
        </li>
        <li>
          <button className="button -clear" onClick={() => this.toggleValue('hideFooter')} type="button">
            {
              this.state.hideFooter ?
                'Show Footer' :
                'Hide Footer'
            }
          </button>
        </li>
        <li>
          <button className="button -clear" onClick={() => this.toggleValue('hideSocialButtons')} type="button">
            {
              this.state.hideSocialButtons ?
                'Show Social Buttons' :
                'Hide Social Buttons'
            }
          </button>
        </li>
        <li style={{ borderTop: 'none', marginRight: -7 }}>
          <ThemeToggleButton/>
        </li>
      </ul>
    </div>

  renderAvatar = () =>
    <StandardTooltip
      tooltipEl={this.renderDropdown()}
      tooltipProps={{
        interactive: true,
        placement: 'bottom-end',
        trigger: 'click',
      }}
      width={170}
    >
      <button type="button" className="avatar">
        <img
          src={this.props.currentUser.avatarUrl}
          alt="Avatar of a current user"
        />
      </button>
    </StandardTooltip>

  render = () =>
    <section className="current-user">
      <NotificationsTogglerAndDropdown currentUser={this.props.currentUser}/>
      <LearnReviewLinks currentUser={this.props.currentUser} dontLinkToLearnOrReview={this.props.dontLinkToLearnOrReview}/>
      {this.renderAvatar()}
    </section>
}

export default CurrentUser;
