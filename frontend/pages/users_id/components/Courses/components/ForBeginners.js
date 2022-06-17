import { Link } from 'react-router-dom';

class ForBeginners extends React.Component {
  render = () =>
    <section className="for-beginners">
      <div className="container">
        <article className="welcome">
          <h1 className="title">Welcome!</h1>
          <div className="description">
            <h2>You are not learning any courses yet.</h2>
            <p>
              You may look at the existing <Link to="/courses">courses</Link>, or <Link to="/courses/new">create your own course</Link>.
            </p>
          </div>
        </article>
      </div>
    </section>
}

export { ForBeginners };
