import "./ReservationForm.css";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation, updateReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";

export default function ReservationForm({ reservation }) {
  const initialFormData = reservation
    ? reservation
    : {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: 0,
      };
  const [reservationData, setReservationData] = useState({
    ...initialFormData,
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  //event handlers for form
  function handleChange(event) {
    event.preventDefault();
    setReservationData({
      ...reservationData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const controller = new AbortController();
    if (reservation) {
      updateReservation(
        {
          ...reservationData,
          people: Number(reservationData.people),
        },
        controller.signal
      )
        .then(() =>
          history.push(`/dashboard?date=${reservationData.reservation_date}`)
        )
        .catch((err) => setError(err));
    } else {
      createReservation(reservationData, controller.signal)
        .then(() =>
          history.push(`/dashboard?date=${reservationData.reservation_date}`)
        )
        .catch((err) => setError(err))
        .finally(() => controller.abort());
    }
  }

  function handleCancel(event) {
    event.preventDefault();
    const controller = new AbortController();
    history.goBack();
    return () => controller.abort();
  }

  return (
    <div className="form-box">
      {reservation ? <h1>Edit Reservation</h1> : <h2>New Reservation</h2>}
      <ErrorAlert error={error} />
      <form
        name="reservation-create"
        className="form-group mx-3"
        onSubmit={handleSubmit}
      >
        <label className="sr-only" htmlFor="first_name">
          First Name
        </label>
        <div className="input-box">
          <input
            type="text"
            name="first_name"
            id="first_name"
            value={reservationData.first_name}
            required={true}
            onChange={handleChange}
            autoComplete="given-name"
          />
          <span>First Name</span>
        </div>
        <label className="sr-only" htmlFor="last_name">
          Last Name
        </label>
        <div className="input-box">
          <input
            type="text"
            name="last_name"
            id="last_name"
            value={reservationData.last_name}
            onChange={handleChange}
            required={true}
            autoComplete="family-name"
          />
          <span>Last Name</span>
        </div>
        <label className="sr-only" htmlFor="mobile_number">
          Mobile Number
        </label>
        <div className="input-box">
          <input
            type="text"
            name="mobile_number"
            id="mobile_number"
            value={reservationData.mobile_number}
            onChange={handleChange}
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            required={true}
            autoComplete="tel-national"
          />
          <span>Mobile Number</span>
        </div>
        <label className="sr-only" htmlFor="people">
          Party Size
        </label>
        <div className="input-box">
          <input
            type="number"
            id="people"
            name="people"
            value={reservationData.people}
            onChange={handleChange}
            required={true}
            autoComplete="off"
          />
          <span>Party Size</span>
        </div>
        <div className="input-box input-box-special">
          <label htmlFor="reservation_date">Reservation Date</label>
          <input
            type="date"
            name="reservation_date"
            id="reservation_date"
            value={reservationData.reservation_date}
            onChange={handleChange}
            pattern="\d{4}-\d{2}-\d{2}"
            required={true}
            autoComplete="off"
          />
        </div>
        <div className="input-box input-box-special">
          <label htmlFor="reservation_time">Reservation Time</label>
          <input
            type="time"
            name="reservation_time"
            id="reservation_time"
            value={reservationData.reservation_time}
            onChange={handleChange}
            pattern="[0-9]{2}:[0-9]{2}"
            required={true}
            autoComplete="off"
          />
        </div>
        <div className="button-container d-flex flex-row p-3">
          <button onClick={handleCancel} className="mx-2 btn py-3 px-4">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="mx-2 btn py-3 px-4"
            type="submit"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}
