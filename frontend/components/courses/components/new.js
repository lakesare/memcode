import React from 'react';
import { Field, FieldArray, reduxForm } from 'redux-form';
import { NewProblem } from '../../problems';

let New = React.createClass({
  render() {
    return(
      <div>
        <form onSubmit={this.props.handleSubmit}>
          <Field name="course[title]" type="text" component='input' placeholder="Title"/>
          <FieldArray name="problems" component={NewProblem}/>

          <button className="button" type="submit" disabled={this.props.submitting}>Submit</button>
        </form>
      </div>
    )
  }
});

New = reduxForm({
  form: 'course', // a unique identifier for this form
})(New);

export { New };