import { Link } from 'react-router';

class ArticlesDropdown extends React.Component {
  render = () =>
    <div className="link articles-dropdown">
      <a className="toggler">
        articles <i className="fa fa-caret-down"/>
      </a>

      <div className="modal">
        <Link to="/articles/comparison">Memrise VS Quizlet VS Brainscape</Link>
        <Link to="/articles/welcome">FAQ</Link>
      </div>
    </div>
}

export { ArticlesDropdown };
