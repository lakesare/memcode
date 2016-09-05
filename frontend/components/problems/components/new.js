import React from 'react';
import { Field } from 'redux-form';

import { newContent } from './newContent'

const New = React.createClass({
  render() {
    const fields = this.props.fields
    return(
      <div>
        {
          fields.map((problem, index) =>
            <div key={index}>
              <button
                className="button"
                type="button"
                title="Remove problem"
                onClick={() => fields.remove(index)}
              >Remove problem</button>

              <div className="columns small-1">{index + 1}</div>

              <Field
                name={`${problem}.content`}
                type="text"
                component={newContent}
                placeholder="content"
              />
              <Field
                name={`${problem}.explanation`}
                type="text"
                component="textarea"
                placeholder="explanation"
              />
            </div>
          )
        }
        <button type="button" onClick={() => fields.push({})}>+</button>
      </div>
    )
  }
})

export { New };