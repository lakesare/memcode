import React from 'react';

import { Helmet } from 'react-helmet';

import { stripTags } from '~/services/stripTags';

const getDescription = (title, description) => {
  const strippedDescription =
    (description && description.length > 0) ?
    `(${stripTags(description)})` : '';

  return `Learn ${title} ${strippedDescription}`;
};

class MetaTags extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired,
    description: React.PropTypes.string
  }

  static defaultProps = {
    description: null
  }

  render = () =>
    <Helmet>
      <title>{this.props.title}</title>
      <meta name="description" content={getDescription(this.props.title, this.props.description)}/> :
    </Helmet>
}

export { MetaTags };
