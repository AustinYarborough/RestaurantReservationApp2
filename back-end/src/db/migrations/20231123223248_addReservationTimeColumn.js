exports.up = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.time("reservation_time").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("reservation_time");
  });
};
