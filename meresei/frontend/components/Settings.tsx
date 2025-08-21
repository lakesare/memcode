import React from 'react';
import {
  TextField, Checkbox, FormHelperText,
  Accordion, AccordionDetails, AccordionSummary, InputAdornment
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';
import { FormState } from '../TYPES';

const formatTimezone = (_n: number) => {
  const n = parseInt(_n.toString());
  if (n > 0) {
    return `+${n}`;
  } else if (n === 0) {
    return "0";
  } else {
    return `–${-n}`
  }
}
interface SettingsProps {
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  userTimezone: number;
}

const Settings: React.FC<SettingsProps> = ({ formState, setFormState, userTimezone }) => {

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return <section className="settings">
    <Accordion defaultExpanded className="your-biology">
      <AccordionSummary expandIcon={<ExpandMore/>}>
        Your Biology
      </AccordionSummary>
      <AccordionDetails>
        <div className="form-wrapper">
          <section className="one">
            <label>
              <div className="text">Your non-24 is how many hours:</div>
              <TextField 
                size="small" 
                name="nOfHoursInDay" 
                type="number" 
                placeholder="e.g., 25" 
                value={formState.nOfHoursInDay} 
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
              />
              <TextField 
                size="small" 
                name="nOfMinutesInDay" 
                type="number" 
                value={formState.nOfMinutesInDay} 
                onChange={handleChange}
                style={{ marginLeft: '10px' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">min</InputAdornment>,
                }}
              />
            </label>

            <label>
              <div className="text">How many hours a day you are awake:</div>
              <TextField 
                size="small" 
                name="nOfHoursAwake" 
                type="number" 
                placeholder="e.g., 16" 
                value={formState.nOfHoursAwake} 
                onChange={handleChange}
                InputProps={{
                  endAdornment: <InputAdornment position="end">h</InputAdornment>,
                }}
              />
            </label>
          </section>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion defaultExpanded className="current-schedule">
      <AccordionSummary expandIcon={<ExpandMore/>}>
        Current Schedule
      </AccordionSummary>
      <AccordionDetails>
        <div className="form-wrapper">
          <section className="one">
            <label>
              <div className="text">Current Waking Time:</div>
              <TextField size="small" id="wakingTime" name="wakingTime" type="text" placeholder="e.g., 23:20" value={formState.wakingTime} onChange={handleChange}/>
            </label>
          </section>
          <section className="two">
            <label>
              <div className="text">Padding After Waking Up:</div>
              <TextField size="small" id="paddingTop" name="paddingTop" type="number" placeholder="e.g., 3h" value={formState.paddingTop} onChange={handleChange} InputProps={{endAdornment: <InputAdornment position="end">h</InputAdornment>}}/>
            </label>
            <label>
              <div className="text">Padding Before Sleeping:</div>
              <TextField size="small" id="paddingBottom" name="paddingBottom" type="number" placeholder="e.g., 3h" value={formState.paddingBottom} onChange={handleChange} InputProps={{endAdornment: <InputAdornment position="end">h</InputAdornment>}}/>
            </label>
          </section>
        </div>
      </AccordionDetails>
    </Accordion>

    <Accordion defaultExpanded className="display-options">
      <AccordionSummary expandIcon={<ExpandMore/>}>
        Display options
      </AccordionSummary>
      <AccordionDetails>
        <div className="form-wrapper">
          <section className="one">
            <label>
              <div className="text">Hide morning hours up to:</div>
              <TextField size="small" name="hideMorningHours" type="number" placeholder="e.g., 7" value={formState.hideMorningHours} onChange={handleChange}/>
            </label>

            <label>
              <div className="text">Hide evening hours after:</div>
              <TextField size="small" name="hideEveningHours" type="number" placeholder="e.g., 21" value={formState.hideEveningHours} onChange={handleChange}/>
            </label>

            <label>
              <div className="text">Hide padding hours:</div>
              <div className="checkbox-wrapper">
                <Checkbox
                  checked={formState.hidePaddingHours}
                  onChange={handleChange}
                  name="hidePaddingHours"
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </label>

            <label>
              <div className="text">Color night hours:</div>
              <div className="checkbox-wrapper">
                <Checkbox
                  checked={formState.shouldColorNightHours}
                  onChange={handleChange}
                  name="shouldColorNightHours"
                  inputProps={{ 'aria-label': 'controlled' }}
                />
              </div>
            </label>
          </section>

          <section className="two">
            <label>
              <div className="text">Days to generate:</div>
              <TextField size="small" name="daysToGenerate" type="number" placeholder="e.g., 7" value={formState.daysToGenerate} onChange={handleChange}/>
            </label>

            <label>
              <div className="text">Display timezone:</div>
              <TextField size="small" name="displayTimezone" type="number" placeholder="e.g., -3" value={formState.displayTimezone || ""} onChange={handleChange}/>
            </label>

            {
              formState.displayTimezone &&
              <FormHelperText>
                  We determined your timezone is {formatTimezone(userTimezone)}.<br/>
                  Now we will display all events in timezone {formatTimezone(formState.displayTimezone)}.
              </FormHelperText>
            }
          </section>
        </div>
      </AccordionDetails>
    </Accordion>
  </section>
}

export default Settings;