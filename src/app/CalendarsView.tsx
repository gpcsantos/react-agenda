import Box from "@material-ui/core/Box";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Checkbox from "@material-ui/core/Checkbox";
import { ICalendar } from "./backend";
import React from "react";
import { ICalendarScreenAction } from "./calendarScreenReducer";

interface ICalendarsViewProps {
  calendars: ICalendar[];
  dispatch: React.Dispatch<ICalendarScreenAction>;
  calendarsSelected: boolean[];
}

export const CalendarsView = React.memo(function CalendarsView(
  props: ICalendarsViewProps
) {
  console.log("render CalendarsView");
  const { calendars, calendarsSelected } = props;

  return (
    <Box marginTop="64px">
      <h3>Agendas</h3>
      {calendars.map((calendar, i) => (
        <div key={calendar.id}>
          <FormControlLabel
            control={
              <Checkbox
                style={{ color: calendar.color }}
                checked={calendarsSelected[i]}
                onChange={() =>
                  props.dispatch({ type: "togglerCalendar", payload: i })
                }
              />
            }
            label={calendar.name}
          />
        </div>
      ))}
    </Box>
  );
});
