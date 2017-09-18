import { expect } from 'chai';
import { mount, shallow } from 'enzyme';
import React from 'react';


class Hi extends React.Component {
  constructor(props) { super(props); }
  render() { return (<div className="Hi"/>); }
}

describe('<Hi />', () => {
	it('allows us to set props', () => {
	  const wrapper = mount(<Hi bar="baz" />);
	  expect(wrapper.props().bar).to.equal('baz');
	});
});

