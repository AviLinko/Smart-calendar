import React, { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const CalendarPage = () => {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/get-events");
        const data = await response.json();
        if (data.status === "success") {
          setEvents(data.events);
        } else {
          setMessage("Error fetching events.");
        }
      } catch (error) {
        console.error("Error fetching events:", error);
        setMessage("Error fetching events.");
      } finally {
        setLoading(false); 
      }
    };

    fetchEvents();
  }, []);

  const handleDateChange = (newDate) => {
    setDate(newDate);
    const eventsOnSelectedDate = events.filter(event => {
      const eventDate = new Date(event.date);
      return eventDate.toDateString() === newDate.toDateString();
    });
    setEventsForSelectedDate(eventsOnSelectedDate);
  };

  const tileClassName = ({ date, view }) => {
    if (view === 'month') {
      const hasEvent = events.some(event => {
        const eventDate = new Date(event.date);
        return eventDate.toDateString() === date.toDateString();
      });
      return hasEvent ? 'event-date' : '';  
    }
    return '';
  };

  return (
    <div style={styles.container}>
      <h1>Calendar Page</h1>
      {loading ? (
        <div className="shimmer" />  
      ) : (
        <>
          {message && <p>{message}</p>}
          <Calendar
            onChange={handleDateChange}
            value={date}
            tileClassName={tileClassName}  
            style={styles.calendar}
          />
          <p style={styles.dateText}>
            <strong>Selected Date:</strong> {date.toDateString()}
          </p>

          <div style={styles.eventsContainer}>
            {eventsForSelectedDate.length > 0 ? (
              <ul>
                {eventsForSelectedDate.map((event) => (
                  <li key={event._id}>
                    <strong>{event.event_name}</strong> - {new Date(event.date).toLocaleTimeString('he-IL', { timeZone: 'UTC', hour: '2-digit', minute: '2-digit' })} <br />
                  </li>
                ))}
              </ul>
            ) : (
              <p>No events for this date.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    height: "100vh",
    padding: "20px",
  },
  calendar: {
    marginBottom: "20px",
  },
  dateText: {
    marginTop: "20px",
    fontSize: "16px",
  },
  eventsContainer: {
    marginTop: "20px",
    textAlign: "left",
  },
};

export default CalendarPage;
