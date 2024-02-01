exports.up = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.string("mobile_number").notNullable();
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("reservations", (table) => {
    table.dropColumn("mobile_number");
  });
};
