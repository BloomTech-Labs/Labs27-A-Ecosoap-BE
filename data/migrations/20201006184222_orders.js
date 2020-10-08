exports.up = (knex) => {
  return knex.schema
    .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
    .createTable('orders', function (table) {
      table.string('id').notNullable().unique().primary();
      table.string('buyerId').notNullable();
      table.integer('quantity').notNullable();
      table.string('dateOrdered').notNullable();
      table.string('status').notNullable();
      table.integer('price');
      table.boolean('priceDetermined').notNullable(); //???
      table.string('comments');
      table.string('organisation');
      table.string('organisationWebsite');
      table.string('contactName').notNullable();
      table.string('contactPhone').notNullable();
      table.string('contactEmail').notNullable();
      table.string('address').notNullable();
      table.string('country').notNullable();
    });
};

exports.down = (knex) => {
  return knex.schema.dropTableIfExists('orders');
};
