import MyDuck from '~/ducks/MyDuck';
import SettingsDuck from '~/ducks/SettingsDuck';
import isPatreonUsername from '~/../services/isPatreonUsername';

import ThemeToggleButton from '~/appComponents/ThemeToggleButton';
import StandardTooltip from '~/components/StandardTooltip';
import css from './index.scss';

@connect(
  (state) => ({
    My: state.global.My,
    Settings: state.global.Settings,
    currentUser: state.global.Authentication.currentUser
  }),
  (dispatch) => ({
    MyActions: dispatch(MyDuck.getActions),
    SettingsActions: SettingsDuck.getActions(dispatch)
  })
)
class Subheader extends React.Component {
  static propTypes = {
    statusOfSolving: PropTypes.object.isRequired,
    amountOfProblems: PropTypes.number.isRequired,
    randomizeProblems: PropTypes.func.isRequired,
    switchQuestionAndAnswer: PropTypes.func.isRequired,

    ifReviewIsSimulated: PropTypes.bool.isRequired,
    ifReviewIsPersistent: PropTypes.bool.isRequired,
    ifReviewingFailedProblems: PropTypes.bool.isRequired,

    MyActions: PropTypes.object.isRequired,
    My: PropTypes.object.isRequired,
    Settings: PropTypes.object.isRequired,
    SettingsActions: PropTypes.object.isRequired,
    currentUser: PropTypes.object
  }

  state = {
    volume: localStorage.getItem('volume') || 'no'
  }

  updateVolume = () => {
    if (this.state.volume === 'yes') {
      localStorage.setItem('volume', 'no');
      this.setState({ volume: 'no' });
    } else {
      localStorage.setItem('volume', 'yes');
      this.setState({ volume: 'yes' });
    }
  }

  renderSimulatedReview = () =>
    <section className={`Subheader ${css.section} -simulated-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <em className="review-emphasis">Test drive</em> - results will not be recorded. Press <em className="review-emphasis">ENTER</em> to reveal answers.
          Use arrows <span style={{ color: 'rgb(242, 112, 110)' }}>◄</span> <span style={{ color: 'rgb(134, 244, 159)' }}>►</span> to rate yourself.
        </div>
        {/* <div className="instructions -mobile"> */}
        {/*   <em className="yellow-emphasis">Test drive</em> - results are not recorded. */}
        {/* </div> */}
        <div className="instructions -mobile"/>

        {this.renderAllButtons()}
      </div>
    </section>

  renderPersistentReview = () =>
    <section className={`Subheader ${css.section} -persistent-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <em className="review-emphasis">Review All</em> - repeat all flashcards, and record which flashcards were most difficult.
        </div>
        {/* <div className="instructions -mobile"> */}
        {/*   <em className="yellow-emphasis">Review All</em> - difficult ones are recorded. */}
        {/* </div> */}
        <div className="instructions -mobile"/>

        {this.renderAllButtons()}
      </div>
    </section>

  renderVolumeButton = () =>
    <button
      type="button"
      className={`volume-button ${this.state.volume === 'yes' ? '-yes' : '-no'}`}
      onClick={this.updateVolume}
    >
      <i className="material-icons -yes">volume_up</i>
      <i className="material-icons -no">volume_off</i>
    </button>

  renderInaccessibleElement = (element) =>
    <StandardTooltip
      tooltipEl={
        <div className="needs-patreon">
          Support Memcode on {' '}
          <a target="_blank" rel="noopener noreferrer" href="https://www.patreon.com/memcode">
            Patreon
          </a> <br/> to enable new elements!
        </div>
      }
      tooltipProps={{
        className: 'standard-tooltip -transparent',
        interactive: true,
        placement: 'bottom-end',
        trigger: 'click',
        distance: 11
        // arrow: false
      }}
      width="none"
    >
      <button type="button" className="button -white">{element}</button>
    </StandardTooltip>

  renderElement = (element, url, needsPatreon) =>
    !needsPatreon ||
    (
      this.props.currentUser &&
      isPatreonUsername(this.props.currentUser.username)
    ) ?
      <button
        type="button"
        className={`button -white ${url === this.props.Settings.backgroundImage ? '-active' : ''}`}
        onClick={() =>
          url === this.props.Settings.backgroundImage ?
            this.props.SettingsActions.updateSetting('backgroundImage', false) :
            this.props.SettingsActions.updateSetting('backgroundImage', url)
        }
      >
        {element}
      </button> :
      this.renderInaccessibleElement(element)

  renderBgImageButton = () =>
    <div>
      <StandardTooltip
        tooltipEl={
          <div className="elements">
            {this.renderElement('Earth', 'https://images.unsplash.com/photo-1530569673472-307dc017a82d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=988&q=80', true)}
            {this.renderElement('Water', 'https://maritimemag.com/wp-content/uploads/2020/10/5J3A5981.jpg', true)}
            {this.renderElement('Air', 'https://images.unsplash.com/photo-1476970980147-71209edbfa4f?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=1650&q=80', true)}
            {this.renderElement('Plasma', 'https://images.unsplash.com/photo-1461511669078-d46bf351cd6e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80')}
            {/* {this.renderElement('Halloween', 'https://www.simplebooth.com/blog/wp-content/uploads/2019/10/black-cat-halloween-photo-booth-backdrop.png')} */}
            {
              this.props.currentUser &&
              isPatreonUsername(this.props.currentUser.username) &&
              <input
                type="text"
                style={{ "width": 20, "paddingLeft": 3 }}
                placeholder="url"
                onChange={(e) => {
                  const url = e.target.value;
                  this.props.SettingsActions.updateSetting('backgroundImage', url);
                }}
              />
            }
            {this.renderElement('╳', false)}
          </div>
        }
        tooltipProps={{
          className: 'standard-tooltip -no-padding -dark bg-button-dropdown',
          interactive: true,
          placement: 'bottom-end',
          trigger: 'click',
          arrow: false
        }}
        width="none"
      >
        <button
          type="button"
          className={`bg-image-button ${this.props.Settings.backgroundImage ? '-on' : '-off'}`}
        >
          <i className="fa fa-picture-o"/>
        </button>
      </StandardTooltip>
    </div>

  renderAllButtons = () =>
    <div className="buttons">
      {this.renderBgImageButton()}

      {this.renderVolumeButton()}

      <ThemeToggleButton/>

      {
        false &&
        <button type="button" className="button -white switch-answer-and-definition-button" onClick={this.props.switchQuestionAndAnswer}>
          Term ⟷ definition
        </button>
      }

      {
        // if it's not the last problem we're reviewing - randomize
        this.props.amountOfProblems !== this.props.statusOfSolving.index + 1 &&
        <button type="button" className="button -white randomize-button" onClick={this.props.randomizeProblems}>
          Randomize
        </button>
      }
    </div>

  renderUsualReview = () =>
    <section className={`Subheader ${css.section} -usual-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <em className="review-emphasis">REVIEW</em> - we are repeating due flashcards.
          Press <em className="review-emphasis">ENTER</em> to reveal answers.
          Use arrows <span style={{ color: 'rgb(242, 112, 110)' }}>◄</span> <span style={{ color: 'rgb(134, 244, 159)' }}>►</span> to rate yourself.
        </div>

        {/* for flexbox to float randomize buttons to the right */}
        <div className="instructions -mobile"/>

        {this.renderAllButtons()}
      </div>
    </section>

  renderFailedFlashcardsReview = () =>
    <section className={`Subheader ${css.section} -failed-flashcards-review`}>
      <div className="container">
        <div className="instructions -desktop">
          <em className="red-emphasis">BY HEART</em> - we are repeating failed flashcards <em className="red-emphasis -darker">♥</em>. Results will not be recorded.
        </div>
        {/* <div className="instructions -mobile"> */}
        {/*   <em className="red-emphasis">BY HEART</em> - repeating failed flashcards <em className="red-emphasis -darker">♥</em> */}
        {/* </div> */}
        <div className="instructions -mobile"/>

        {this.renderAllButtons()}
      </div>
    </section>

  render = () => {
    if (!this.props.ifReviewIsSimulated && !this.props.ifReviewIsPersistent && !this.props.ifReviewingFailedProblems) {
      return this.renderUsualReview();
    } else if (this.props.ifReviewIsPersistent && !this.props.ifReviewingFailedProblems) {
      return this.renderPersistentReview();
    } else if (this.props.ifReviewIsSimulated && !this.props.ifReviewingFailedProblems) {
      return this.renderSimulatedReview();
    } else if (this.props.ifReviewingFailedProblems) {
      return this.renderFailedFlashcardsReview();
    }
  }
}

export default Subheader;
