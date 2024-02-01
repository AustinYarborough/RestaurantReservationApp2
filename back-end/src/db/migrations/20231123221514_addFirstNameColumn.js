exports.up = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.string("first_name").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("first_name");
  });
};
