import React, { useEffect, useState } from "react";
import "./dashboard.css";
import { useLocation, useHistory } from "react-router-dom";
import { listReservations, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationList from "../layout/reservations/ReservationList";
import TableList from "../tables/TableList";
import { today, next, previous } from "../utils/date-time";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard() {
  const todayDate = today();
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [dateState, setDateState] = useState(today);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const date = queryParams.get("date");
  const history = useHistory();

  // eslint-disable-next-line
  useEffect(updateDate, [dateState]);

  //default date to today if no specific date is entered in query string
  function updateDate() {
    if (!date) {
      updateQueryParam(todayDate);
      setDateState(todayDate);
    }
  }

  function updateQueryParam(newDate) {
    history.push(`/dashboard?date=${newDate}`);
  }

  //load reservations whenever date query param changes
  useEffect(() => {
    const abortController = new AbortController();

    Promise.all([
      loadReservations(abortController.signal),
      loadTables(abortController.signal),
    ])
      .then(([reservationData, tableData]) => {
        setReservations(reservationData);
        setTables(tableData);
      })
      .catch((err) => setError(err));

    return () => abortController.abort();
    // eslint-disable-next-line
  }, [date]);

  function loadReservations(signal) {
    return listReservations({ date }, signal);
  }

  function loadTables(signal) {
    return listTables(signal);
  }

  //button handlers
  function handleNext(event) {
    event.preventDefault();
    setDateState((currentDate) => {
      const newDate = next(currentDate);
      updateQueryParam(newDate);
      return newDate;
    });
  }

  function handlePrevious(event) {
    event.preventDefault();
    setDateState((currentDate) => {
      const newDate = previous(currentDate);
      updateQueryParam(newDate);
      return newDate;
    });
  }

  function handleToday(event) {
    event.preventDefault();
    setDateState((currentDate) => {
      const newDate = today();
      updateQueryParam(newDate);
      return newDate;
    });
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <ErrorAlert error={error} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for {date}</h4>
      </div>
      <ReservationList reservations={reservations} />
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Tables</h4>
      </div>
      <TableList tables={tables} date={date} setTables={setTables} />
      <div className="dash-buttons">
        <button
          type="button"
          onClick={handlePrevious}
          className="fa fa-chevron-left"
        ></button>
        <button type="button" className="today-button" onClick={handleToday}>
          Today
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="fa fa-chevron-right"
        ></button>
      </div>
    </main>
  );
}

export default Dashboard;
