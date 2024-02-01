const knex = require("../db/connection");

async function create(table) {
  try {
    const createdRecords = await knex("tables")
      .insert({ ...table })
      .returning("*");
    return createdRecords[0];
  } catch (error) {
    throw error;
  }
}

async function read(table_id) {
  try {
    return await knex("tables").where({ table_id }).first();
  } catch (error) {
    throw error;
  }
}

async function update(table, reservation) {
  const { table_id, reservation_id } = table;
  await knex("tables")
    .where({ table_id })
    .update({ ...table });
  await knex("reservations")
    .where({ reservation_id })
    .update({ ...reservation });

  return await knex("tables").where({ table_id }).first();
}

async function destroy(table, reservation) {
  const { table_id } = table;
  const { reservation_id } = reservation;
  await knex("tables")
    .where({ table_id })
    .update({ ...table });

  await knex("reservations")
    .where({ reservation_id })
    .update({ ...reservation });

  return await knex("tables").where({ table_id }).first();
}

async function list() {
  try {
    return await knex("tables").select("*").orderBy("table_name");
  } catch (error) {
    throw error;
  }
}

module.exports = {
  create,
  read,
  update,
  delete: destroy,
  list,
};
