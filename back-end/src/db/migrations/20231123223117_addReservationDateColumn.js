exports.up = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.date("reservation_date").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("reservation_date");
  });
};
