import { Helmet } from 'react-helmet';

import Main from '~/appComponents/Main';
import Loading from '~/components/Loading';
import ListOfCourseCards from '~/appComponents/ListOfCourseCards';

import api from '~/api';

import css from './index.css';

class Page_courses_id extends React.Component {
  static propTypes = {
    match: PropTypes.object.isRequired,
  }

  state = {
    speGetPage: {}
  }

  componentDidMount = () => {
    this.apiGetPage();
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.apiGetPage();
    }
  }

  apiGetPage = () => {
    api.PageApi.getUserPage(
      (spe) => this.setState({ speGetPage: spe }),
      { userId: this.props.match.params.id }
    );
  }

  getDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  render = () =>
    <Main className={css.main}>
      <div className="space"/>

      <Loading spe={this.state.speGetPage}>{({ user, coursesCreated }) =>
        <div className="container">
          <div className="wrapper">
            <div className="user">
              <h1>Profile</h1>
              <div className="user-details">
                <img src={user.avatarUrl} alt="avatar"/>
                <div className="right">
                  <div className="username">{user.username}</div>

                  {
                    user.email &&
                    <div className="email">{user.email}</div>
                  }

                  <div className="created-at">
                    Joined {this.getDate(user.createdAt)}
                  </div>
                </div>
              </div>
            </div>

            <section className="created-courses">
              <h1>Created Courses</h1>
              <ListOfCourseCards
                className="list-of-courses"
                type="simple"
                courseDtos={coursesCreated}
              />
            </section>
          </div>
        </div>
      }</Loading>

      <Helmet>
        <title>User</title>
        <meta name="description" content="Create and memorize your personal flashcards."/>
      </Helmet>
    </Main>
}

export default Page_courses_id;
