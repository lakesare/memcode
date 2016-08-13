import React from 'react';
import { connect } from 'react-redux';
import { Field, FieldArray, reduxForm } from 'redux-form';


import { Header } from '../components/header';
import css from './newCourse.scss';
import { NewProblem } from '../components/problems';

let NewCoursePage = React.createClass({

  showResults(values) {
    console.log(values);
    new Promise(resolve => {
      setTimeout(() => {  // simulate server latency
        window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`)
        resolve()
      }, 500)
    })
  },

  render() {
    return(
      <section className="row">
        <div className="small-11 small-centered column end">
          <Header/>
          <NewCourseForm onSubmit={this.showResults}/>
        </div>
      </section>
    )
  }
});

let NewCourseForm = React.createClass({
  render() {
    const { handleSubmit, pristine, reset, submitting } = this.props
    return(
      <div>
        <h1>New course</h1>

        <form onSubmit={handleSubmit}>
          <Field name="title" type="text" component='input' placeholder="Title"/>
          <FieldArray name="problems" component={NewProblem}/>

          <button className="button" type="submit" disabled={submitting}>Submit</button>
        </form>
      </div>
    )
  }
});

NewCourseForm = reduxForm({
  form: 'course',     // a unique identifier for this form
})(NewCourseForm);





const toApi = (string) => { // first thing is: ${'hi'}
  const string_from_api = "`" + string + "`";
  let a = eval(string_from_api);
  return a;
}
let content = "first thing is: ${'hi'}"
content = toApi(content);

// explanation: 'some context to a problem',
// type: 'ORDERED_MISSING_TEXT',
// content: [
//   {
//     precedingText: 'first answer is ',
//     answer: 'hi',
//     answered: null
//   },
//   {
//     precedingText: ', second answer is ',
//     answer: 'hello',
//     answered: null
//   }
// ]




export { NewCoursePage };