// contentArray: ["gestalt principle of  ", null, " : refers to the mind’s tendency to see complete figures or forms even if a picture is incomplete"]

// => '<div>gestalt principle of   <answer index=0></answer>  : refers to the mind’s tendency to see complete figures or forms even if a picture is incomplete</div>'
const contentObjectToString = (contentArray) => {
  const aa = [];
  let answerIndex = 0;
  contentArray.forEach((textPart) => {
    if (textPart === null) {
      aa.push(`<answer index=${answerIndex}></answer>`);
      answerIndex ++;
    } else {
      aa.push(textPart);
    }
  });

  return ('<div>' + aa.join(' ') + '</div>');
};

export { contentObjectToString };
