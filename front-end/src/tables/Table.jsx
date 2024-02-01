import { useState } from "react";
import { listTables, deleteTable } from "../utils/api";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import ErrorAlert from "../layout/ErrorAlert";

export default function Table({ table }) {
  const history = useHistory();
  const [currentTable, setCurrentTable] = useState(table);
  const [error, setError] = useState(null);

  //US-05, event handler for table finish
  async function clearAndLoadTables() {
    const abortController = new AbortController();
    try {
      const response = await deleteTable(
        currentTable.table_id,
        abortController.signal
      );
      const tableToSet = response.find(
        (table) => table.table_id === currentTable.table_id
      );
      setCurrentTable({ ...tableToSet });
      listTables();
      return tableToSet;
    } catch (error) {
      setError(error);
    }
  }

  async function handleFinish(event) {
    event.preventDefault();
    setError(null);
    if (
      window.confirm(
        "Is this table ready to seat new guests? This cannot be undone."
      )
    ) {
      await clearAndLoadTables();
      history.push("/tables");
      return;
    }
  }

  return (
    <>
      <ErrorAlert error={error} />
      <tr className="table-row" data-table-id-status={table.table_id}>
        <td data-title="ID"> {table.table_id} </td>
        <td data-title="Table Name"> {table.table_name} </td>
        <td data-title="Capacity"> {table.capacity} </td>
        <td data-title="Reservation ID"> {table.reservation_id} </td>
        <td
          data-table-id-status={`${table.table_id}`}
          data-title="Table Status"
        >
          {" "}
          {table.status.toLowerCase()}{" "}
        </td>
        <td>
          {table.status === "Occupied" ? (
            <button
              className="finish-button"
              onClick={handleFinish}
              data-table-id-finish={`${table.table_id}`}
              value={table.table_id}
              data-title="Clear Tables"
            >
              Finish
            </button>
          ) : null}
        </td>
      </tr>
    </>
  );
}
