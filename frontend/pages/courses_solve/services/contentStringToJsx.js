import React from 'react';
import HtmlToReact from 'html-to-react';

import { Answer } from '../components/Answer';

const htmlToReactParser = new HtmlToReact.Parser(React);
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

// contentString: '<div>gestalt principle of   <answer index=0></answer>  : refers to the mind’s tendency to see complete figures or forms even if a picture is incomplete</div>'
const contentStringToJsx = (contentString, answers, onRightAnswerGiven) => {
  const processingInstructions = [
    { // procesing <answer></answer> tags
      shouldProcessNode: node => node.name === 'answer',
      processNode: (node) => {
        const answerIndex = node.attribs.index;
        return (
          <Answer
            key={answerIndex + 10000} // temp fix, there is some bug with keying some texts in html-to-react. it disappears if we get rid of either <answer> or all the other tag parsing.
            answer={answers[answerIndex]}
            onRightAnswerGiven={() => onRightAnswerGiven(answerIndex)}
          />
        );
      }
    },
    { // anything else
      shouldProcessNode: () => true,
      processNode: processNodeDefinitions.processDefaultNode
    }
  ];

  return htmlToReactParser.parseWithInstructions(contentString, (() => true), processingInstructions);
};

export { contentStringToJsx };
