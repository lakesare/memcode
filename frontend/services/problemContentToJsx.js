import HtmlToReact from 'html-to-react';
import React from 'react';

import { AnswersShow } from '../components/answers';

const htmlToReactParser = new HtmlToReact.Parser(React);
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

const problemContentToJsx = (content, problemId) => {
  const contentString = problemContentTextToString(content.text);

  const processingInstructions = [
    {
      shouldProcessNode: (node) => {
        return node.name === 'answer';
      },
      processNode: (node, children) => {
        const answerIndex = node.attribs.index;
        return <AnswersShow
          key={answerIndex + 10000} // temp fix, there is some bug with keying some texts in html-to-react. it disappears if we get rid of either <answer> or all the other tag parsing.
          answer={content.answers[answerIndex]}
          answerIndex={parseInt(answerIndex)}
          problemId={problemId}
        />
      }
    },
    { 
      // Anything else
      shouldProcessNode: (node) => {
        return true;
      },
      processNode: processNodeDefinitions.processDefaultNode
    }
  ];

  return htmlToReactParser.parseWithInstructions(contentString, (() => true), processingInstructions);
};

const problemContentTextToString = (contentText) => {
  let aa = [];
  let answerIndex = 0;
  contentText.forEach((textPart) => {
    if (textPart === null) {
      aa.push(`<answer index=${answerIndex}></answer>`);
      answerIndex ++;
    } else {
      aa.push(textPart)
    }
  });

  return ('<div>' + aa.join(' ') + '</div>')
};


export { problemContentToJsx };