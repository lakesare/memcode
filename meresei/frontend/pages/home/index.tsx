import React, { useState } from 'react';
import moment from "moment";
import 'moment-timezone';
import { FormState } from '../../TYPES';
import Settings from '../../components/Settings';
import Calendar from '../../components/Calendar';

const HomePage: React.FC = () => {
  const userTimezone : number = moment.tz(moment.tz.guess()).utcOffset() / 60;

  const [formState, setFormState] = useState<FormState>({
    nOfHoursAwake: '16',
    nOfHoursInDay: '25',
    nOfMinutesInDay: '00',

    wakingTime: '02:00',
    paddingTop: '0',
    paddingBottom: '0',
    daysToGenerate: '30',
    displayTimezone: undefined,
    hideMorningHours: "",
    hideEveningHours: "",
    hidePaddingHours: false,
    shouldColorNightHours: false
  });

  return (
    <div className="container">
      <Settings formState={formState} setFormState={setFormState} userTimezone={userTimezone}/>
      <Calendar formState={formState} userTimezone={userTimezone}/>
    </div>
  );
};

export default HomePage;