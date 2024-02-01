import "../reservations/ReservationForm.css";
import { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { listTables, updateTable } from "../../utils/api";
import ErrorAlert from "../ErrorAlert";
import { today } from "../../utils/date-time";

export default function ReservationSeatForm() {
  const history = useHistory();
  const { reservation_id } = useParams();
  const [tables, setTables] = useState([]);
  const [error, setError] = useState(null);
  const [tableId, setTableId] = useState(0);

  useEffect(() => {
    const abortController = new AbortController();
    listTables(abortController.signal)
      .then((tableData) => setTables(tableData))
      .catch((err) => setError(err));
  }, []);

  //event handlers for form
  async function handleSubmit(event) {
    event.preventDefault();
    const controller = new AbortController();
    await updateTable(tableId, reservation_id, controller.signal)
      .then(() => history.push(`/dashboard?date=${today()}`))
      .catch((err) => setError(err));
    return controller.abort();
  }

  function handleCancel(event) {
    event.preventDefault();
    history.goBack();
  }

  function handleChange(event) {
    setTableId(event.target.value);
  }

  return (
    <div className="form-box">
      <h2>Seat Reservation</h2>
      <ErrorAlert error={error} />
      <form
        name="reservation-seat"
        className="form-group mx-3"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <label className="sr-only" htmlFor="table_id">
          Select Table
        </label>
        <div className="input-box">
          <select
            name="table_id"
            id="table_id"
            required={true}
            onChange={handleChange}
          >
            <option defaultValue>Select a Table</option>
            {tables.map((table) => {
              if (table.status === "Occupied") {
                return (
                  <option
                    value={table.table_id}
                    key={table.table_id}
                    className="occupied"
                  >
                    This table is currently occupied!
                  </option>
                );
              }
              return (
                <option value={table.table_id} key={table.table_id}>
                  {table.table_name} - {table.capacity}
                </option>
              );
            })}
          </select>
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
