import React from 'react';
import { browserHistory } from 'react-router';

class Course extends React.Component {
  static propTypes = {
    course: React.PropTypes.object.isRequired,
    amountOfProblems: React.PropTypes.string.isRequired
  }

  // because <Link> will change layout some, don't want to adjust css
  onClick = () => {
    browserHistory.push(`/courses/${this.props.course.id}`);
  }

  render = () =>
    <div className="course" onClick={this.onClick}>
      <section className="actions">
        <a className="view">
          <i className="fa fa-eye"/>
        </a>
      </section>

      <section className="main">
        <h3 className="title">{this.props.course.title}</h3>
      </section>

      {/*
        this.props.course.description &&
        this.props.course.description.length > 0 &&
        <section className="description" dangerouslySetInnerHTML={{ __html: this.props.course.description }}/>
      */}

      <section className="total-amount-of-mems">
        {this.props.amountOfProblems} mems
      </section>
    </div>
}

export { Course };
