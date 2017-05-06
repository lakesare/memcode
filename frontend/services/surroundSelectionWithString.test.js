import React from 'react';
import ReactDOM from 'react-dom';
import { shallow, mount } from 'enzyme';

import { surroundSelectionWithString } from './surroundSelectionWithString';


const Textarea = <textarea defaultValue="hello hi"></textarea>;

describe('surroundSelectionWithString', () => {

  describe('no text selected', () => {
    it('cursor in the middle', () => {
      const wrapper = mount(Textarea);
      const domTextarea = ReactDOM.findDOMNode(wrapper.instance());

      domTextarea.selectionStart = 5;
      surroundSelectionWithString(domTextarea, '<answer>', '</answer>');

      expect(domTextarea.value).to.equal('hello<answer></answer> hi');
      expect(domTextarea.selectionStart).to.equal(13)
    });

    it('cursor in the beginning', () => {
      const wrapper = mount(Textarea);
      const domTextarea = ReactDOM.findDOMNode(wrapper.instance());

      domTextarea.selectionStart = 0;
      surroundSelectionWithString(domTextarea, '<answer>', '</answer>');

      expect(domTextarea.value).to.equal('<answer></answer>hello hi');
      expect(domTextarea.selectionStart).to.equal(8)
    });
  });

  describe('some text selected', () => {
    it('selection in the middle', () => {
      const wrapper = mount(Textarea);
      const domTextarea = ReactDOM.findDOMNode(wrapper.instance());

      domTextarea.selectionStart = 5;
      domTextarea.selectionEnd = 7;
      surroundSelectionWithString(domTextarea, '<answer>', '</answer>');

      expect(domTextarea.value).to.equal('hello<answer> h</answer>i');
      expect(domTextarea.selectionStart).to.equal(13)
    });
  });


});