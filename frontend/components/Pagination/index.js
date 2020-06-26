import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import css from './index.css';

class Pagination extends React.Component {
  static propTypes = {
    amountOfPages: PropTypes.number.isRequired,
    currentPage: PropTypes.number.isRequired,

    getUrlForNewPageNumber: PropTypes.func.isRequired,
    className: PropTypes.string
  }

  static defaultProps = {
    className: ''
  }

  pagesToDisplay = (currentPage, amountOfPages) =>
    [
      1,
      currentPage - 2,
      currentPage - 1,

      currentPage,

      currentPage + 1,
      currentPage + 2,
      amountOfPages
    ]
      // filter out negatives and exceeding max page amount
      .filter((pageN) =>
        pageN <= amountOfPages &&
        pageN >= 1
      )
      // uniq
      .filter((pageN, index, array) => array.indexOf(pageN) === index)

  renderPage = (pageN) =>
    <li key={pageN} className={pageN === this.props.currentPage ? 'page-n -current' : 'page-n'}>
      {
        pageN === this.props.currentPage ?
          pageN :
          <Link to={this.props.getUrlForNewPageNumber(pageN)}>
            {pageN}
          </Link>
      }
    </li>

  render = () => {
    const currentPage = this.props.currentPage;

    const pageLinks = [];
    let prevN = 0;

    // [1,   10, 11, 12,   100]
    this.pagesToDisplay(currentPage, this.props.amountOfPages).forEach((pageN) => {
      const ifPageIsConsecutive = prevN + 1 === pageN;
      if (!ifPageIsConsecutive) {
        pageLinks.push(<li className="epsilon" key={`epsilon before-${pageN}`}>...</li>);
      }
      pageLinks.push(this.renderPage(pageN));
      prevN = pageN;
    });

    return <ul className={`pagination ${css.ul} ${this.props.className}`}>
      {pageLinks}
    </ul>;
  }
}

export default Pagination;
