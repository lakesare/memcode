import React, { useState, useMemo } from 'react';
import { FormState, Event, DateSlot, TimeSlot, Cell } from '../../TYPES';
import moment from "moment";
import Td from './components/Td';
import wakingTimeToFloat from './services/wakingTimeToFloat';
import nOfHoursInDayToFloat from './services/nOfHoursInDayToFloat';

interface CalendarProps {
  formState: FormState;
  userTimezone: number;
}

const Calendar: React.FC<CalendarProps> = ({ formState, userTimezone }) => {
  const [hoveredCell, setHoveredCell] = useState<Cell | null>(null);
  const [clickedCells, setClickedCells] = useState<Cell[]>([]);

  const shallIDisplayThisRow = (rowIndex: number) : boolean => {
    let display = true;
    if (formState.hideMorningHours && rowIndex < parseInt(formState.hideMorningHours)) {
      display = false;
    }
    if (formState.hideEveningHours && rowIndex > parseInt(formState.hideEveningHours)) {
      display = false;
    }
    return display;
  }

  const dateSlots: DateSlot[] = Array.from({ length: parseInt(formState.daysToGenerate) }, (_, i) => ({
    moment: moment().add(i, 'days'),
    id: i
  }));
  const timeSlots: TimeSlot[] = Array.from({ length: 24 }, (_, i) => ({
    id: i
  }));

  const startHourFloat = wakingTimeToFloat(formState.wakingTime);

  const nOfHoursInDayFloat = nOfHoursInDayToFloat(formState.nOfHoursInDay, formState.nOfMinutesInDay)

  const nOfHoursAwake = parseInt(formState.nOfHoursAwake);
  const paddingTop = parseInt(formState.paddingTop);
  const paddingBottom = parseInt(formState.paddingBottom);
  const daysToGenerate = parseInt(formState.daysToGenerate)

  const timezoneDiff = formState.displayTimezone ? userTimezone - formState.displayTimezone : 0;

  const events = useMemo(() => {
    const eventsArray: Event[] = [];
    let cursor = startHourFloat - timezoneDiff;

    while (cursor <= daysToGenerate * 24) {
      let needToAddPartialHour = Math.abs(Math.ceil(cursor) - cursor) > 0.1;
      if (needToAddPartialHour) {
        eventsArray.push({
          dateSlotId: Math.trunc(Math.floor(cursor) / 24),
          timeSlotId: Math.floor(cursor % 24),
          type: paddingTop > 0 ? "paddingTop" : "awake",
          isPartial: "top",
          text: (cursor % 24).toString()
        });
      }
      for (let i = 0; i < paddingTop; i++) {
        eventsArray.push({
          dateSlotId: Math.trunc(Math.ceil(cursor) / 24),
          timeSlotId: Math.ceil(cursor) % 24,
          type: "paddingTop",
        });
        cursor += 1;
      }

      for (let i = 0; i < nOfHoursAwake - paddingTop - paddingBottom; i++) {
        eventsArray.push({
          dateSlotId: Math.trunc(Math.ceil(cursor) / 24),
          timeSlotId: Math.ceil(cursor) % 24,
          type: "awake",
          text: (cursor % 24).toString()
        });
        cursor += 1;
      }

      for (let i = 0; i < paddingBottom; i++) {
        eventsArray.push({
          dateSlotId: Math.trunc(Math.ceil(cursor) / 24),
          timeSlotId: Math.ceil(cursor) % 24,
          type: "paddingBottom",
        });
        cursor += 1;
      }
      let needToAddPartialHourBottom = Math.abs(Math.ceil(cursor) - cursor) > 0.1;
      console.log({cursor, needToAddPartialHourBottom, eventsArray});
      if (needToAddPartialHourBottom && eventsArray[eventsArray.length - 1]) {
        eventsArray[eventsArray.length - 1].isPartial = "bottom";
      }
      cursor += nOfHoursInDayFloat - nOfHoursAwake;
    }

    return eventsArray;
  }, [formState]);

  const timezonedClickedCells = clickedCells.map((clickedCell) => {
    const cursor = clickedCell.dateSlotId * 24 + clickedCell.timeSlotId;
    const timezonedCursor = cursor - timezoneDiff;
    return {
      dateSlotId: Math.trunc(timezonedCursor / 24),
      timeSlotId: timezonedCursor % 24
    }
  })

  const onCellClick = (clickedCell: Cell) => {
    setClickedCells((prevClicked: Cell[]) => {
      const cursor = clickedCell.dateSlotId * 24 + clickedCell.timeSlotId;
      const timezonedCursor = cursor + timezoneDiff;
      const newDateSlotId = Math.trunc(timezonedCursor / 24);
      const newTimeSlotId = timezonedCursor % 24;
      const clickedIndex = prevClicked.findIndex((cell) => cell.timeSlotId === newTimeSlotId && cell.dateSlotId === newDateSlotId);
      if (clickedIndex > -1) {
        return [...prevClicked.slice(0, clickedIndex), ...prevClicked.slice(clickedIndex + 1)];
      } else {
        return [...prevClicked, { timeSlotId: newTimeSlotId, dateSlotId: newDateSlotId }];
      }
    });
  }

  return <section className="calendar">
    <table>
      <thead>
        <tr>
          <th className="empty-corner"></th>
          {dateSlots.map((dateSlot) =>
            <th key={dateSlot.id} className={"date " + (hoveredCell?.dateSlotId === dateSlot.id + 1 ? 'hovered' : '')}>
              <div className={`weekday -${dateSlot.moment.format('ddd')}`}>
                {dateSlot.moment.format('ddd')}
              </div>
              <div className="date">
                {dateSlot.moment.format('MMM D')}
              </div>
            </th>
          )}
        </tr>
      </thead>
      <tbody>
        {timeSlots.map((timeSlot) => (
          shallIDisplayThisRow(timeSlot.id) &&
          <tr key={timeSlot.id}>
            <th
              className={`
                time-slot
                ${formState.shouldColorNightHours && (timeSlot.id >= 0 && timeSlot.id <= 6) ? 'deep-night' : ''}
                ${hoveredCell?.timeSlotId === timeSlot.id ? 'hovered' : ''}
              `}
            >
              {`${timeSlot.id < 10 ? '0' : ''}${timeSlot.id}:00`}
            </th>

            {dateSlots.map((dateSlot) =>
              <Td
                key={`${timeSlot.id}-${dateSlot.id}`}
                hoveredCell={hoveredCell}
                setHoveredCell={setHoveredCell}
                clickedCells={timezonedClickedCells}
                onCellClick={onCellClick}
                timeSlot={timeSlot}
                dateSlot={dateSlot}
                formState={formState}
                events={events}
              />
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </section>
}

export default Calendar;