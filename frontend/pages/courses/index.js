import { Helmet } from 'react-helmet';

import { commonFetch } from '~/api/commonFetch';

import { Header } from '~/components/Header';
import { Loading } from '~/components/Loading';
import { Course } from './components/Course';

import listOfCoursesCss from '~/components/ListOfCourses/index.css';
import css from './index.css';

class Page_courses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      speGetCourses: {}
    };
  }

  componentDidMount = () => {
    commonFetch(
      spe => this.setState({ speGetCourses: spe }),
      'GET', '/api/pages/courses'
    );
  }

  renderLayoutDivs = () =>
    // eslint-disable-next-line react/no-array-index-key
    [...Array(10)].map((_, i) => <div key={i} className="layout-div"/>)

  render = () =>
    <main className={css.main}>
      <Header/>
      <div className="container">
        <div className="space"/>
        <Loading spe={this.state.speGetCourses}>{courses =>
          <section className={listOfCoursesCss['list-of-courses']}>
            {
              courses.map(({ course, amountOfProblems }) =>
                <Course key={course.id} course={course} amountOfProblems={amountOfProblems}/>
              )
            }
            {this.renderLayoutDivs()}
          </section>
        }</Loading>
      </div>

      <Helmet>
        <title>Memcode | All courses</title>
        <meta name="description" content="Learn existing courses on programming, maths and physics, or create your own."/> :
      </Helmet>
    </main>
}

export { Page_courses };
