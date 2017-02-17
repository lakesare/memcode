import React from 'react';
import HtmlToReact from 'html-to-react';

const htmlToReactParser = new HtmlToReact.Parser(React);
const processNodeDefinitions = new HtmlToReact.ProcessNodeDefinitions(React);

// contentString: '<div>gestalt principle of   <answer index=0></answer>  : refers to the mind’s tendency to see complete figures or forms even if a picture is incomplete</div>'
const contentStringToJsx = (contentString, createAnswerComponent) => {
  const processingInstructions = [
    { // procesing <answer></answer> tags
      shouldProcessNode: node => node.name === 'answer',
      processNode: (node) => {
        const answerIndex = node.attribs.index;
        return createAnswerComponent(answerIndex);
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
