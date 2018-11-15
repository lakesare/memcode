import { Quill } from 'react-quill';

const Inline = Quill.import('blots/inline');
class Answer extends Inline {
  static blotName = 'answer';
  static className = 'answer';
  static tagName = 'mark';
}

export default Answer;
