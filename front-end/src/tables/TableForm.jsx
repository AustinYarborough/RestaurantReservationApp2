import "../layout/reservations/ReservationForm.css";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function TableForm({ reservation }) {
  const initialFormData = {
    table_name: "",
    capacity: "",
  };
  const [tableData, setTableData] = useState({
    ...initialFormData,
  });
  const [error, setError] = useState(null);
  const history = useHistory();

  //event handlers for form
  function handleChange(event) {
    event.preventDefault();
    setTableData({
      ...tableData,
      [event.target.name]: event.target.value,
    });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const controller = new AbortController();
    createTable(tableData, controller.signal)
      .then(() => history.push(`/dashboard`))
      .catch((err) => setError(err))
      .finally(() => controller.abort());
  }

  function handleCancel(event) {
    event.preventDefault();
    const controller = new AbortController();
    history.goBack();
    return () => controller.abort();
  }

  return (
    <div className="form-box">
      <h2>New Table</h2>
      <ErrorAlert error={error} />
      <form
        name="reservation-create"
        className="form-group mx-3"
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <label className="sr-only" htmlFor="table_name">
          Table Name
        </label>
        <div className="input-box">
          <input
            type="text"
            name="table_name"
            id="table_name"
            value={tableData.table_name}
            required={true}
            onChange={handleChange}
          />
          <span>Table Name</span>
        </div>
        <label className="sr-only" htmlFor="capacity">
          Capacity
        </label>
        <div className="input-box">
          <input
            type="number"
            name="capacity"
            id="capacity"
            value={tableData.capacity}
            onChange={handleChange}
            required={true}
          />
          <span>Capacity</span>
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
