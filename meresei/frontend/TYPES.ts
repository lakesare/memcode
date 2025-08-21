interface FormState {
  nOfHoursAwake: string;
  nOfHoursInDay: string;
  nOfMinutesInDay: string;
  wakingTime: string;
  paddingTop: string;
  paddingBottom: string;
  daysToGenerate: string;
  displayTimezone: number | undefined;
  hideMorningHours: string;
  hideEveningHours: string;
  hidePaddingHours: boolean;
  shouldColorNightHours: boolean;
}

interface Event {
  dateSlotId: number;
  timeSlotId: number;
  type: string;
  text?: string;
  isPartial?: string
}

interface DateSlot {
  moment: moment.Moment;
  id: number;
}

interface TimeSlot {
  id: number;
}

interface Cell {
  timeSlotId: number;
  dateSlotId: number;
}

export type { FormState, Event, DateSlot, TimeSlot, Cell };