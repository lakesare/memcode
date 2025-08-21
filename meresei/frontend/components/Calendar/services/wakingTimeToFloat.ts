const wakingTimeToFloat = (wakingTime: string) : number => {
  const wakingTimeSplit = wakingTime.split(":");
  const h = parseInt(wakingTimeSplit[0]);
  const min = parseInt(wakingTimeSplit[1]);
  if (h && min && h <= 24 && min <= 60) {
    return h + min / 60;
  } else if (h && h <= 24) {
    return h;
  } else {
    return 0;
  }
}

export default wakingTimeToFloat;