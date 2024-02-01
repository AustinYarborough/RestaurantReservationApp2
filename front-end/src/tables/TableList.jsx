import Table from "./Table";
import "./TableList.css";

export default function TableList({ tables, date, setTables }) {
  function clearTables(tables) {
    let result = [];
    tables.forEach((table) => {
      if (table.reservation_id) {
        result.push(table);
      }
    });
    return result;
  }
  let clearTableToggler = clearTables(tables);

  return (
    <table className="table-list">
      <thead className="table-head">
        <tr>
          <th> ID </th>
          <th> Table Name </th>
          <th> Capacity </th>
          <th> Reservation ID </th>
          <th> Table Status </th>
          {clearTableToggler.length ? <th> Clear Tables </th> : <th></th>}
        </tr>
      </thead>
      <tbody>
        {tables.map(({ ...rest }) => (
          <Table table={rest} key={rest.table_id} />
        ))}
      </tbody>
    </table>
  );
}
