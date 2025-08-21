import React from 'react';
import { FormState, Event, DateSlot, TimeSlot, Cell } from '../../../TYPES';

interface TdProps {
  hoveredCell: Cell | null;
  setHoveredCell: React.Dispatch<React.SetStateAction<Cell | null>>;

  clickedCells: Cell[];
  onCellClick: (cell: Cell) => void;

  timeSlot: TimeSlot;
  dateSlot: DateSlot;

  formState: FormState;
  events: Event[];
}

const Td = ({ hoveredCell, setHoveredCell, clickedCells, onCellClick, timeSlot, dateSlot, formState, events }: TdProps) => {
  const renderEvent = (dateSlotId: number, timeSlotId: number) => {
    const event = events.find((e) => e.dateSlotId === dateSlotId && e.timeSlotId === timeSlotId);
    const shallIDisplayThisEvent = event && (event.type === "awake" || !formState.hidePaddingHours);
    const isClicked = clickedCells.find((cell) => cell.dateSlotId === dateSlotId && cell.timeSlotId === timeSlotId);
    if (shallIDisplayThisEvent) {
      if (event.type === "awake" && isClicked) {
        return null;
      } else if (isClicked) {
        return <div className="event -awake"/>;
      }
      return <div className={`event -${event.type} ${event.isPartial ? `-partial-${event.isPartial}` : ''}`}>
        {/* {event.text && parseFloat(event.text).toFixed(2)} */}
      </div>;
    } else {
      if (isClicked) {
        return <div className="event -awake"/>;
      }
      return null;
    }
  }

  return <td
    onMouseEnter={() => setHoveredCell({ timeSlotId: timeSlot.id, dateSlotId: dateSlot.id + 1 })} 
    onMouseLeave={() => setHoveredCell(null)}
    className={hoveredCell?.timeSlotId === timeSlot.id || hoveredCell?.dateSlotId === dateSlot.id + 1 ? 'hovered' : ''}
    onClick={() => onCellClick({ timeSlotId: timeSlot.id, dateSlotId: dateSlot.id })}
  >
    {renderEvent(dateSlot.id, timeSlot.id)}
  </td>
}

export default Td;