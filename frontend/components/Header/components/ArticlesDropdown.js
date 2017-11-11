import { Link } from 'react-router';

class ArticlesDropdown extends React.Component {
  render = () =>
    <div className="link articles standard-tooltip">
      <div className="toggler">
        blog <i className="fa fa-caret-down"/>
      </div>

      <div className="modal -standard-tooltip-list">
        <Link to="/articles/comparison">Memrise VS Quizlet VS Brainscape</Link>
        <Link to="/articles/welcome">FAQ</Link>
      </div>
    </div>
}

export { ArticlesDropdown };
