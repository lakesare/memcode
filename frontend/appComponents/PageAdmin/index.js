import Header from '~/components/Header';
import Footer from '~/components/Footer';
import NavigationAdmin from '~/appComponents/NavigationAdmin';

import css from './index.css';

class PageAdmin extends React.Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.element.isRequired
  }

  render = () =>
    <main className={css.main}>
      <Header/>

      <div className="container">
        <NavigationAdmin/>

        <section className="actual-main">
          <h1 className="standard-admin-title">{this.props.title}</h1>

          {this.props.children}
        </section>
      </div>

      <Footer/>
    </main>
}

export default PageAdmin;
