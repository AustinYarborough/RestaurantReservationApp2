import Reservation from "./Reservation";
import "./ReservationList.css";

export default function ReservationList({ reservations }) {
  return (
    <ul className="reservations-list">
      {reservations.map(({ ...rest }) => {
        return <Reservation key={rest.reservation_id} reservation={rest} />;
      })}
    </ul>
  );
}
