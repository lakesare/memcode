// to problem model?
const calculateScore = (given, wanted) => {
  if (given === wanted) {
    return 5;
  } else { // given < wanted
    return (given / wanted) * 5; // 0..5
  }
};


export default calculateScore;
