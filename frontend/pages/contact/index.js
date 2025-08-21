import { commonFetch } from '~/api/commonFetch';

import { Helmet } from 'react-helmet';
import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import { TextInput, EditorTextarea } from '~/components/_standardForm';
import Footer from '~/appComponents/Footer';

import css from './index.scss';

@connect((state) => ({
  email:
    (
      state.global.Authentication.currentUser &&
      state.global.Authentication.currentUser.email
    ) || ''
}))
class Page_contact extends React.Component {
  static propTypes = {
    email: PropTypes.string
  };

  static defaultProps = {
    email: ''
  }

  state = {
    speSend: { status: 'success' },
    formState: {
      email: this.props.email,
      message: ''
    },
    formValidation: {},

    ifJustSent: false
  }

  apiSend = (e) => {
    e.preventDefault();
    if (this.validate()) {
      // says confirmation email is sent, but I receive nothing.
      commonFetch((spe) => this.setState({ speSend: spe }),
        // can't receive email from a webform advices to contact my web host (and it is google)
        // https://support.google.com/a/answer/55299?hl=en
        // disabled security in memcode's GSuite synthetic record
        //
        // gets successfully sent to lakesare@gmail.com, eugekrns@yandex.ru (here including confirmation email)
        'POST', 'https://formspree.io/f/mbjpkape',
        this.state.formState
      ).then(() => this.setState({ ifJustSent: true }));
    }
  }

  validate = () => {
    if (this.state.formState.message.length < 5) {
      this.setState({ formValidation: { message: 'Please enter your message' } });
      return false;
    } else {
      return true;
    }
  }

  inputProps = () => ({
    updateFormState: (state) => this.setState({ formState: state }),
    formState: this.state.formState,
    formValidation: this.state.formValidation
  })

  render = () =>
    <Main className={css.main}>
      <div className="space"/>

      <div className="container" style={{ paddingBottom: 70 }}>
        <div className="standard-title-and-description">
          <h2 className="title">Send Us a Message</h2>

          <article className="description">
            <p>
              Missing some functionality? Having some question? Seeing some bug? Having some ideas that would make your presence on Memcode more comfortable?
            </p>
            <p>Write me, I'll try to answer within the day.</p>
          </article>
        </div>

        <form className="standard-form -bordered" onSubmit={this.apiSend}>
          <div className="form-insides">
            <TextInput      {...this.inputProps()} label="Email:"   name="email" type="email"/>
            <EditorTextarea {...this.inputProps()} label="Message:" name="message"/>
          </div>

          <Loading spe={this.state.speSend}>
            <button type="submit" className="button -green -move-up-on-hover standard-submit-button">
              SEND
            </button>
          </Loading>

          {
            this.state.ifJustSent &&
            <div className="standard-success-message">
              Message was successfully sent!<br/> We will answer shortly.
            </div>
          }
        </form>
      </div>

      <Helmet>
        <title>Memcode | Contact</title>
      </Helmet>

      <Footer/>
    </Main>
}

export default Page_contact;
