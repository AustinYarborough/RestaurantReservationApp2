import { useState } from "react";
import { listReservations, deleteReservation } from "../../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../ErrorAlert";

export default function Reservation({ reservation }) {
  const [currentReservation, setCurrentReservation] = useState(reservation);
  const [error, setError] = useState(null);
  const history = useHistory();

  async function handleCancel(event) {
    event.preventDefault();
    setError(null);
    if (
      window.confirm(
        "Do you want to cancel this reservation? This cannot be undone."
      )
    ) {
      await deleteAndLoadReservations();
      history.push("/");
    }
  }

  async function deleteAndLoadReservations() {
    const controller = new AbortController();
    try {
      const response = await deleteReservation(
        currentReservation.reservation_id,
        controller.signal
      );
      const reservationToSet = response.find(
        (reservation) =>
          reservation.reservationId === currentReservation.reservation_id
      );
      setCurrentReservation({ ...reservationToSet });
      listReservations();
      return reservationToSet;
    } catch (err) {
      setError(err);
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <li
        key={reservation.reservation_id}
        data-reservation-id-status={reservation.reservation_id}
        className="reservation"
      >
        ID: {reservation.reservation_id}
        <br />
        Status: {reservation.status}
        <br />
        First Name: {reservation.first_name}
        <br />
        Last Name: {reservation.last_name}
        <br />
        Mobile Number: {reservation.mobile_number}
        <br />
        Reservation Date: {reservation.reservation_date}
        <br />
        Reservation Time: {reservation.reservation_time}
        <br />
        Party Size: {reservation.people}
        <hr />
        <div className="button-box">
          {reservation.status === "booked" ? (
            <a
              href={`/reservations/${reservation.reservation_id}/edit`}
              className="button"
            >
              <span className="fa-solid fa-pencil" />
            </a>
          ) : (
            <></>
          )}
          {reservation.status === "booked" ? (
            <a
              href={`/reservations/${reservation.reservation_id}/seat`}
              className="seat-button"
            >
              Seat
            </a>
          ) : (
            <></>
          )}
          <button
            className="button"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleCancel}
            value={reservation.reservation_id}
          >
            Cancel
          </button>
        </div>
      </li>
    </>
  );
}
