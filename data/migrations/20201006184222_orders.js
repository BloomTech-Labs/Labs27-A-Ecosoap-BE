
exports.up = (knex) => {
  return knex.schema
  .raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"')
  .createTable('orders', function(table) {
      table.string('orderId').notNullable().unique().primary();
      table.string('buyerId');
      table.integer('quantity');
      table.string('dateOrdered');
      table.string('status');
      table.integer('price');
      table.boolean('priceDetermined');
      table.string('comments');
      table.string('organisation');
      table.string('organisationWebsite');
      table.string('contactName');
      table.string('contactPhone');
      table.string('contactEmail');
      table.string('address');
      table.string('country');

  });
};


exports.down = (knex) => {
    return knex.schema.dropTableIfExists('orders');
  
};
