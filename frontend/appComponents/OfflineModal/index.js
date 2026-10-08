import dayjs from 'dayjs';
import { Link } from 'react-router';
import TogglerAndModal from '~/components/TogglerAndModal';
import ProgressBar from '~/components/ProgressBar';
import OfflineDuck from '~/ducks/OfflineDuck';
import pluralize from '~/services/pluralize';

import css from './index.scss';

class OfflineModal extends React.Component {
  static propTypes = {
    toggler:        PropTypes.element.isRequired,
    Offline:        PropTypes.object.isRequired,
    OfflineActions: PropTypes.object.isRequired,
    My:             PropTypes.object.isRequired
  }

  state = {
    ifWithImages: true
  }

  componentWillUnmount = () => {
    clearInterval(this.tickInterval);
  }

  // [claude comment] re-renders every few seconds while open, so "Last synced a minute ago" stays true
  onOpen = () => {
    this.props.OfflineActions.loadState();
    this.tickInterval = setInterval(() => this.forceUpdate(), 5000);
  }

  onClose = () => {
    clearInterval(this.tickInterval);
  }

  // [claude comment] on while the first download runs too, before anything is saved
  ifOn = () =>
    Boolean(this.props.Offline.meta) || this.props.Offline.status === 'downloadingCourses'

  ifWithImages = () =>
    this.props.Offline.meta ? this.props.Offline.meta.ifWithImages : this.state.ifWithImages

  toggleOn = () => {
    if (this.ifOn()) {
      this.props.OfflineActions.turnOff();
    } else {
      this.props.OfflineActions.download(this.state.ifWithImages);
    }
  }

  toggleImages = (event) => {
    if (this.props.Offline.meta) {
      this.props.OfflineActions.setIfWithImages(event.target.checked);
    } else {
      this.setState({ ifWithImages: event.target.checked });
    }
  }

  ifShowImagesProgress = () => {
    const { meta, status, nOfImagesDownloaded } = this.props.Offline;
    return meta &&
      meta.imageUrls.length > 0 &&
      status !== 'downloadingCourses' &&
      (status === 'downloadingImages' || nOfImagesDownloaded < meta.imageUrls.length);
  }

  renderWhatIsOffline = () => {
    const meta = this.props.Offline.meta;
    const courses = `${meta.courseIds.length} ${pluralize(meta.courseIds.length, 'course', 'courses')}`;
    const flashcards = `${meta.nOfFlashcards} ${pluralize(meta.nOfFlashcards, 'flashcard', 'flashcards')}`;
    return <div className="what-is-offline">
      {
        meta.ifWithImages ?
          `${courses}, ${flashcards} and ${meta.imageUrls.length} ${pluralize(meta.imageUrls.length, 'image', 'images')} are available offline.` :
          `${courses} and ${flashcards} are available offline.`
      }
      {
        this.props.Offline.status !== 'downloadingImages' &&
        <div className="last-synced">Last synced {dayjs(meta.lastSyncedAt).fromNow()}</div>
      }
    </div>;
  }

  renderCoursesProgress = () => {
    const { nOfCoursesDownloaded, nOfCoursesToDownload } = this.props.Offline;
    return <div className="progress">
      <div className="progress-label">Downloading courses... {nOfCoursesDownloaded} / {nOfCoursesToDownload}</div>
      <ProgressBar currentAmount={nOfCoursesDownloaded} maxAmount={Math.max(nOfCoursesToDownload, 1)}/>
    </div>;
  }

  renderImagesProgress = () => {
    const { meta, status, nOfImagesDownloaded, nOfImagesFailed } = this.props.Offline;
    const nOfImages = meta.imageUrls.length;
    return <div className="progress">
      <div className="progress-label">
        <span>
          Images: {nOfImagesDownloaded} / {nOfImages}
          {nOfImagesFailed > 0 && <span className="failed"> ({nOfImagesFailed} failed)</span>}
        </span>
        {
          status === 'downloadingImages' ?
            <button type="button" className="button -white pause-button" onClick={this.props.OfflineActions.pauseImages}>Pause</button> :
            <button type="button" className="button -white pause-button" onClick={this.props.OfflineActions.downloadImages}>Resume</button>
        }
      </div>
      <ProgressBar currentAmount={nOfImagesDownloaded + nOfImagesFailed} maxAmount={nOfImages}/>
    </div>;
  }

  renderCourseLink = (courseId, closeModal) => {
    const courseDto = this.props.My.courses.find((dto) => dto.course.id === courseId);
    if (courseDto) {
      return <Link to={`/courses/${courseId}`} onClick={closeModal}>{courseDto.course.title}</Link>;
    } else {
      return 'a course';
    }
  }

  renderNotice = (notice, closeModal) => {
    switch (notice.kind) {
      case 'overwrote':
        return <>Your edit of a flashcard in {this.renderCourseLink(notice.courseId, closeModal)} replaced a newer version that was saved elsewhere.</>;
      case 'refused':
        return <>Couldn't save {notice.what} in {this.renderCourseLink(notice.courseId, closeModal)}: {notice.error}</>;
    }
  }

  renderNotices = (closeModal) =>
    <div className="notices">
      {this.props.Offline.notices.map((notice) =>
        <div key={notice.noticeId} className="notice">
          <div className="text">{this.renderNotice(notice, closeModal)}</div>
          <button
            type="button"
            className="dismiss-button"
            aria-label="Dismiss"
            onClick={() => this.props.OfflineActions.dismissNotice(notice.noticeId)}
          >×</button>
        </div>
      )}
    </div>

  render = () =>
    <TogglerAndModal toggler={this.props.toggler} afterOpen={this.onOpen} afterClose={this.onClose}>{(closeModal) =>
      <section className={`standard-modal standard-modal--sm ${css.local}`}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Offline</h2>
          <div className="standard-modal__description">
            Keeps the courses you are learning on this device, so that you can review and edit them without internet.
          </div>
        </div>

        <div className="standard-modal__main">
          <label className="offline-switch">
            <input type="checkbox" role="switch" checked={this.ifOn()} onChange={this.toggleOn}/>
            Keep my courses available offline
          </label>

          <label className="include-images">
            <input
              type="checkbox"
              checked={this.ifWithImages()}
              disabled={this.props.Offline.status === 'downloadingCourses'}
              onChange={this.toggleImages}
            />
            Include images
          </label>

          {this.props.Offline.meta && this.renderWhatIsOffline()}

          {this.props.Offline.status === 'downloadingCourses' && this.renderCoursesProgress()}
          {this.ifShowImagesProgress() && this.renderImagesProgress()}

          {
            this.props.Offline.nOfQueuedChanges > 0 &&
            <div className="queued-changes">
              {this.props.Offline.nOfQueuedChanges} {pluralize(this.props.Offline.nOfQueuedChanges, 'change is', 'changes are')} waiting to be sent.
            </div>
          }

          {this.props.Offline.notices.length > 0 && this.renderNotices(closeModal)}

          {
            this.props.Offline.error &&
            <div className="error">{this.props.Offline.error}</div>
          }
        </div>
      </section>
    }</TogglerAndModal>
}

export default connect(
  (state) => ({
    Offline: state.global.Offline,
    My: state.global.My
  }),
  (dispatch) => ({
    OfflineActions: dispatch(OfflineDuck.getActions)
  })
)(OfflineModal);
