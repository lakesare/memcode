const nOfHoursInDayToFloat = (nOfHoursInDay: string, nOfMinutesInDay: string) : number => {
  const h = parseInt(nOfHoursInDay) || 0;
  const min = parseInt(nOfMinutesInDay) || 0;
  return h + (min / 60)
}

export default nOfHoursInDayToFloat;