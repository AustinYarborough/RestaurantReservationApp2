const knex = require("../db/connection");

async function create(reservation) {
  try {
    const createdRecords = await knex("reservations")
      .insert({ ...reservation })
      .returning("*");
    return createdRecords[0];
  } catch (error) {
    throw error;
  }
}

async function read(reservation_id) {
  try {
    return await knex("reservations")
      .select("*")
      .where({ reservation_id })
      .first();
  } catch (error) {
    throw error;
  }
}

async function updateStatus(reservation) {
  try {
    const { reservation_id } = reservation;
    await knex("reservations")
      .where({ reservation_id })
      .update({ ...reservation });

    return knex("reservations").where({ reservation_id }).first();
  } catch (error) {
    throw error;
  }
}

async function update(reservation) {
  try {
    const { reservation_id } = reservation;
    await knex("reservations")
      .where({ reservation_id })
      .update({ ...reservation });

    return read(reservation_id);
  } catch (error) {
    throw error;
  }
}

async function list() {
  try {
    return await knex("reservations")
      .whereNot({ status: "finished" })
      .select("*")
      .orderBy("reservation_time");
  } catch (error) {
    throw error;
  }
}

async function listByDate(reservation_date) {
  try {
    return await knex("reservations")
      .select("*")
      .whereNot({ status: "finished" })
      .where({ reservation_date })
      .orderBy("reservation_time");
  } catch (error) {
    throw error;
  }
}

async function listByNumber(mobile_number) {
  try {
    return await knex("reservations")
      .select("*")
      .whereRaw(
        "translate(mobile_number, '() -', '') like ?",
        `%${mobile_number.replace(/\D/g, "")}%`
      )
      .orderBy("reservation_id");
  } catch (error) {
    throw error;
  }
}

module.exports = {
  create,
  read,
  updateStatus,
  update,
  list,
  listByDate,
  listByNumber,
};
