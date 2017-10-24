import { commonFetch } from '~/api/commonFetch';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';
import { TextInput, EditorTextarea } from '~/components/_standardForm';


import css from './index.css';

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
    if (this.validate() === true) {
      commonFetch((spe) => this.setState({ speSend: spe }),
        'POST', '//formspree.io/lakesare@gmail.com',
        this.state.formState
      ).then(() => this.setState({ ifJustSent: true }));
    }
  }

  validate = () => {
    if (this.state.formState.message.length < 5) {
      this.setState({ formValidation: { message: 'Please enter your message' } });
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
    <main className={css.main}>
      <Header/>
      <div className="container">
        <div className="space"/>

        <h2>Send us a message</h2>

        <form className="standard-form -bordered" onSubmit={this.apiSend}>
          <TextInput {...this.inputProps()} type="email" label="Email:" name="email"/>
          <EditorTextarea {...this.inputProps()} label="Message:" name="message"/>

          <Loading spe={this.state.speSend}>
            <button type="submit" className="button -black -fade-out-on-hover standard-submit-button">
              SEND
            </button>
          </Loading>

          {
            this.state.ifJustSent &&
            <div className="just-sent">
              <h3>Message was successfully sent! We will answer shortly.</h3>
            </div>
          }
        </form>

      </div>
      <Footer/>

      <Helmet>
        <title>Memcode | Contact</title>
      </Helmet>
    </main>
}

export { Page_contact };
