import { Link } from 'react-router-dom';
import CreateCourseButton from '~/components/CreateCourseButton';

class ForBeginners extends React.Component {
  render = () =>
    <section className="for-beginners">
      <div className="container">
        <article className="welcome">
          <h1 className="title">Welcome!</h1>
          <div className="description">
            <h2>You are not learning any courses yet.</h2>
            <p>
              You may look at the existing <Link to="/courses">courses</Link>, or <CreateCourseButton><button style={{background: 'none', border: 'none', color: 'inherit', textDecoration: 'underline', cursor: 'pointer', padding: 0, font: 'inherit'}}>create your own course</button></CreateCourseButton>.
            </p>
          </div>
        </article>
      </div>
    </section>
}

export { ForBeginners };
