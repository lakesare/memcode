import { connect } from 'react-redux';
import { commonFetch } from '~/api/commonFetch';

import { Helmet } from 'react-helmet';
import { Header } from '~/components/Header';
import { Footer } from '~/components/Footer';
import { Loading } from '~/components/Loading';

import css from './index.css';

@connect((state) => ({
  email:
    state.global.Authentication.currentUser &&
    state.global.Authentication.currentUser.email
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
    formValues: {
      email: this.props.email,
      message: ''
    },
    validationErrors: {},

    ifJustSent: false
  }

  updateFormValues = (event, inputTitle) =>
    this.setState({
      formValues: {
        ...this.state.formValues,
        [inputTitle]: event.target.value
      }
    })

  validateAndSubmit = (e) => {
    e.preventDefault();
    if (this.validate()) {
      commonFetch((spe) => this.setState({ speSend: spe }),
        'POST', '//formspree.io/lakesare@gmail.com',
        this.state.formValues
      ).then(() => this.setState({ ifJustSent: true }));
    }
  }

  validate = () => {
    if (this.state.formValues.message.length < 5) {
      this.setState({ validationErrors: { message: 'Please enter your message' } });
      return false;
    } else {
      return true;
    }
  }

  render = () =>
    <main className={css.main}>
      <Header/>
      <div className="container">
        <div className="space"/>

        <h2>Send us a message</h2>
        <form className="standard-form -bordered">
          <div className="fieldset">
            <div className="label">
              <label htmlFor="email">Email:</label>
            </div>
            <div className="input">
              <input type="text" onChange={(e) => this.updateFormValues(e, 'email')} value={this.state.formValues.email}/>
            </div>
          </div>

          <div className="fieldset">
            <div className="label">
              <label htmlFor="message">Message:</label>
            </div>
            <div className="input">
              <textarea type="text" onChange={(e) => this.updateFormValues(e, 'message')} value={this.state.formValues.message}/>
            </div>
            {
              this.state.validationErrors.message &&
              <div className="error">
                {this.state.validationErrors.message}
              </div>
            }
          </div>

          <Loading spe={this.state.speSend}>
            <button type="button" className="button -black -fade-out-on-hover" onClick={this.validateAndSubmit}>
              SEND
            </button>
          </Loading>

          {
            this.state.ifJustSent &&
            <div className="just-sent">
              <h3>Message successfully sent! We will answer shortly.</h3>
              <div className="space"/>
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
