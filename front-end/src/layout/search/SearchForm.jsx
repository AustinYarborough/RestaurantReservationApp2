import { useState } from "react";
import { listReservations } from "../../utils/api";
import ReservationList from "../reservations/ReservationList";
import { useHistory } from "react-router-dom";
import "../reservations/ReservationForm.css";

export default function SearchForm({ reservationList }) {
  const [mobile_number, setMobile_number] = useState(null);
  const [reservations, setReservations] = useState(null);
  const [error, setError] = useState(null);
  const history = useHistory();
  const errorMessage = `No reservations found`;

  function handleSubmit(event) {
    console.log("searching:", mobile_number);
    setError(null);
    event.preventDefault();
    listReservations({ mobile_number })
      .then((response) => {
        if (!response.length) {
          setError(errorMessage);
        }
        setReservations(response);
        history.push("/search");
      })
      .catch((err) => setError(err));
  }

  function handleChange(event) {
    setMobile_number(event.target.value);
  }

  return (
    <>
      {error && error.length ? (
        <span className="alert alert-danger">Error: {error}</span>
      ) : (
        <></>
      )}
      <form onSubmit={handleSubmit} className="form-box" autoComplete="off">
        <h2>Search Reservations</h2>
        <label className="sr-only" htmlFor="mobile_number">
          Mobile Number
        </label>
        <div className="input-box">
          <input
            name="mobile_number"
            type="text"
            pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
            onChange={handleChange}
            id="mobile_number"
            required={true}
          />
          <span>Mobile Number</span>
        </div>
        <div className="button-container d-flex flex-row p-3">
          <button
            onClick={handleSubmit}
            type="submit"
            className="mx-2 btn py-3 px-4"
          >
            <i className="fa-solid fa-magnifying-glass" />
            Search
          </button>
        </div>
        {reservations && reservations.length ? (
          <ReservationList reservations={reservations} />
        ) : null}
      </form>
    </>
  );
}
