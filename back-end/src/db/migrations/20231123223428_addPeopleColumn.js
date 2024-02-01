exports.up = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.integer("people").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("people");
  });
};
