// @ts-check

/**
 * Publish change
 * @param {import('knex')} knex
 */
exports.up = async (knex) => {
  await knex.schema.raw('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');
  await knex.schema.createTable('orders', (table) => {
    table.string('id').notNullable().unique().primary();
    table.string('buyerId').notNullable();
    table.integer('quantity').notNullable();
    table.string('dateOrdered').notNullable();
    table.string('status').notNullable();
    table.integer('price');
    table.boolean('priceDetermined').notNullable();
    table.string('comments');
    table.string('organization');
    table.string('organizationWebsite');
    table.string('contactName').notNullable();
    table.string('contactPhone').notNullable();
    table.string('contactEmail').notNullable();
    table.string('address').notNullable();
    table.string('country').notNullable();
  });
};

/**
 * Rollback change
 * @param {import('knex')} knex
 */
exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('orders');
};
