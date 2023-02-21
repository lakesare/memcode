import api from '~/api';

import TogglerAndModal from '~/components/TogglerAndModal';
import { TextInput } from '~/components/_standardForm';

import disableOnSpeRequest from '~/services/disableOnSpeRequest';

class CreateGroupModal extends React.Component {
  static propTypes = {
    toggler: PropTypes.object.isRequired,
    uiCreateStudentGroup: PropTypes.func.isRequired,
  }

  state = {
    formState: {
      title: ''
    },
    formValidation: {},
    speCreateGroup: {}
  }

  apiCreateGroup = (e, closeModal) => {
    e.preventDefault();
    if (this.validate()) {
      api.StudentGroupApi.create(
        (spe) => this.setState({ speCreateGroup: spe }),
        {
          title: this.state.formState.title
        }
      ).then((group) => {
        this.props.uiCreateStudentGroup(group);
        closeModal();
      });
    }
  }

  validate = () => {
    if (this.state.formState.title.length === 0) {
      this.setState({ formValidation: { title: 'Please enter a title.' } });
      return false;
    } else {
      return true;
    }
  }

  render = () =>
    <TogglerAndModal toggler={this.props.toggler}>{(closeModal) =>
      <section className={"standard-modal standard-modal--sm"}>
        <div className="standard-modal__header">
          <h2 className="standard-modal__title">Create a new group</h2>
        </div>

        <div className="standard-modal__main">
          <form className="standard-form -no-padding" onSubmit={(e) => this.apiCreateGroup(e, closeModal)}>
            <div className="form-insides">
              <TextInput formState={this.state.formState} updateFormState={(formState) => this.setState({ formState })} formValidation={this.state.formValidation} name="title" label="title" autoFocus/>
            </div>

            <button
              className="button -purple standard-submit-button -move-up-on-hover"
              type="submit"
              style={disableOnSpeRequest(this.state.speCreateGroup, { opacity: 0.6 })}
            >Create</button>
            {/* <Loading spe={this.state.speSave}/> */}
          </form>
        </div>
      </section>
    }</TogglerAndModal>
}

export default CreateGroupModal;
