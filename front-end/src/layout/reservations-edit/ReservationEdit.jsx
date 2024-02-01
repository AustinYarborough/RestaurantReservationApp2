import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import { readReservation } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import ReservationForm from "../reservations/ReservationForm";
import formatReservationTime from "../../utils/format-reservation-time";

export default function ReservationEdit() {
  const { reservation_id } = useParams();
  const [reservation, setReservation] = useState();
  const [error, setError] = useState(null);

  function loadReservation() {
    const controller = new AbortController();
    readReservation(reservation_id, controller.signal)
      .then((response) => {
        formatReservationTime(response);
        setReservation(response);
      })
      .catch((err) => setError(err));
    return () => controller.abort();
  }

  useEffect(loadReservation, [reservation_id]);

  return (
    <>
      <ErrorAlert error={error} />
      {reservation ? (
        <ReservationForm reservation={reservation} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );
}
