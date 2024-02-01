/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5001";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();

    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);

  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  //debug log delete later
  console.log("url", url);
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * Creates a new reservation
 * @param reservation
 * @param signal
 * @returns {Promise<[reservation]>}
 * a promise resolves to an error message or an object with reservation data
 */

export async function createReservation(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`;
  reservation.people = +reservation.people;
  const response = await fetchJson(
    url,
    {
      body: JSON.stringify({ data: reservation }),
      headers,
      method: "POST",
      signal,
    },
    []
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
  return response;
}

/**
 * lists a single resrevation
 * @param reservation_id reservation to be read
 * @param signal
 * @returns {Promise<[reservation]>}
 * promise returns either an error message or object containing data for a single reservation
 */

export async function readReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}`;
  return await fetchJson(
    url,
    {
      headers,
      signal,
    },
    []
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * updates a reservation's status
 * @param data the status to be updated
 * @param reservation_id reservation to be updated
 * @param signal
 * @returns {Promise<[reservation]>}
 * promise returns either an error message or object containing updated data for reservation
 */

export async function updateReservationStatus(data, reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${data.reservation_id}/status`;
  return await fetchJson(
    url,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ data }),
      signal,
    },
    []
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * updates an existing reservation
 * @param data updates to be made
 * @param signal
 * @returns {Promise<[reservation]>}
 * Promise returns either an error message or object containing updated data
 */

export async function updateReservation(data, signal) {
  const url = `${API_BASE_URL}/reservations/${data.reservation_id}`;
  return await fetchJson(
    url,
    {
      method: "PUT",
      headers,
      body: JSON.stringify({ data }),
      signal,
    },
    []
  )
    .then(formatReservationDate)
    .then(formatReservationTime);
}

/**
 * changes a reservation's status to 'cancelled'
 * @param reservation_id reservation to be cancelled
 * @param signal
 * @returns {Promise<[reservation]>}
 * Promise returns either an error message or object containing updated data
 */

export async function deleteReservation(reservation_id, signal) {
  const url = `${API_BASE_URL}/reservations/${reservation_id}/status`;
  return await fetchJson(
    url,
    {
      method: "DELETE",
      signal,
    },
    []
  );
}

//tables functions

/**
 * creates a new table
 * @param table table data to be created
 * @param signal
 * @returns {Promise<[table]>}
 * Promise returns an array of table data, or an empty array
 */

export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables`;
  const response = await fetchJson(
    url,
    {
      body: JSON.stringify({
        data: { ...table, capacity: Number(table.capacity) },
      }),
      headers,
      method: "POST",
      signal,
    },
    []
  );
  return await response;
}

/**
 * changes a table's status to 'occupied' and assigns a reservation_id to table
 * @param table_id
 * @param reservation_id
 * @param signal
 * @returns {Promise<[table]>}
 * Promise returns either an error message or object containing updated table data
 */

export async function updateTable(table_id, reservation_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  return await fetchJson(
    url,
    {
      body: JSON.stringify({ data: { reservation_id } }),
      headers,
      method: "PUT",
      signal,
    },
    []
  );
}

/**
 * sets a table's status to 'free' and clears the reservation_id
 * @param table_id
 * @param signal
 * @returns {Promise<[table]>}
 * Promise returns either an error message or object containing updated table data
 */

export async function deleteTable(table_id, signal) {
  const url = `${API_BASE_URL}/tables/${table_id}/seat`;
  return await fetchJson(
    url,
    {
      method: "DELETE",
      signal,
    },
    []
  );
}

/**
 * lists all tables
 * @param signal
 * @returns {Promise<[tables]>}
 * Promise returns an array containing all table data or an empty array
 */

export async function listTables(signal) {
  const url = `${API_BASE_URL}/tables`;
  return await fetchJson(url, { headers, signal }, []);
}
