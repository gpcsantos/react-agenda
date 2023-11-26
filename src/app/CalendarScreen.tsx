import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { useCallback, useEffect, useMemo, useReducer } from "react";
import {
  getEvenstEndPoint,
  IEvent,
  ICalendar,
  getCalendarsEndPoint,
} from "./backend";
import { useParams } from "react-router";
import { CalendarsView } from "./CalendarsView";
import { CalendarHeader } from "./CalendarHeader";
import { Calendar, ICalendarCell, IEventWithCalendar } from "./Calendar";
import { EventFormDialog } from "./EventFormDialog";
import { getToday } from "./dateFunctions";
import { reducer } from "./calendarScreenReducer";

export default function CalendarScreen() {
  const { month } = useParams<{ month: string }>();

  const [state, dispatch] = useReducer(reducer, {
    calendars: [],
    calendarsSelected: [],
    events: [],
    editingEvent: null,
  });

  const { events, calendars, calendarsSelected, editingEvent } = state;

  const weeks = useMemo(() => {
    return generateCalendar(
      month + "-01",
      events,
      calendars,
      calendarsSelected
    );
  }, [month, events, calendars, calendarsSelected]);

  const firstDate = weeks[0][0].date;
  const lasttDate = weeks[weeks.length - 1][6].date;

  useEffect(() => {
    Promise.all([
      getCalendarsEndPoint(),
      getEvenstEndPoint(firstDate, lasttDate),
    ]).then(([calendars, events]) => {
      dispatch({ type: "load", payload: { events, calendars } });
    });
  }, [firstDate, lasttDate]);

  function refreshEvents() {
    getEvenstEndPoint(firstDate, lasttDate).then((events) => {
      dispatch({ type: "load", payload: { events } });
    });
  }

  const closeDialog = useCallback(() => {
    dispatch({ type: "closeDialog" });
  }, []);

  return (
    <Box display="flex" height="100%" alignItems="strech">
      <Box
        borderRight="1px solid rgb(224, 224, 224)"
        width="15em"
        padding="8px 16px"
      >
        <Box display="flex" flexDirection="column" alignItems="center">
          <h2>Agenda React</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => dispatch({ type: "new", payload: getToday() })}
          >
            Novo Evento
          </Button>
        </Box>

        <CalendarsView
          calendars={calendars}
          dispatch={dispatch}
          calendarsSelected={calendarsSelected}
        />
      </Box>

      <Box flex="1" display="flex" flexDirection="column">
        <CalendarHeader month={month} />

        <Calendar weeks={weeks} dispatch={dispatch} />

        <EventFormDialog
          event={editingEvent}
          calendars={calendars}
          onSave={() => {
            closeDialog();
            refreshEvents();
          }}
          onCancel={closeDialog}
        />
      </Box>
    </Box>
  );
}

function generateCalendar(
  date: string,
  allEvents: IEvent[],
  calendars: ICalendar[],
  calendarsSelected: boolean[]
): ICalendarCell[][] {
  console.log("generateCalendar");
  const weeks: ICalendarCell[][] = [];
  const jsDate = new Date(date + "T12:00:00"); // construtor de datas  no formato ISO->(2021-06-17T10:00:00)
  const currentMonth = jsDate.getMonth();

  const currentDay = new Date(jsDate.valueOf()); // valueOF, tempo em milissegundos desde o marco 0
  currentDay.setDate(1); // primeiro dia do mês
  const dayOfWeek = currentDay.getDay(); // retorna o dia da semana 0 domingo - 6 sábado
  currentDay.setDate(1 - dayOfWeek);

  do {
    const week: ICalendarCell[] = [];
    for (let i = 0; i < 7; i++) {
      const monthString = (currentDay.getMonth() + 1)
        .toString()
        .padStart(2, "0");
      const dayStr = currentDay.getDate().toString().padStart(2, "0");
      const isoDate = `${currentDay.getFullYear()}-${monthString}-${dayStr}`;

      const events: IEventWithCalendar[] = [];
      for (const event of allEvents) {
        if (event.date === isoDate) {
          const calIndex = calendars.findIndex(
            (cal) => cal.id === event.calendarId
          );
          if (calendarsSelected[calIndex]) {
            events.push({ ...event, calendar: calendars[calIndex] });
          }
        }
      }

      week.push({
        date: isoDate,
        dayOfMonth: currentDay.getDate(),
        events,
      });
      currentDay.setDate(currentDay.getDate() + 1);
    }
    weeks.push(week);
  } while (currentDay.getMonth() === currentMonth);

  return weeks;
}
