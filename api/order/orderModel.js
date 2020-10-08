// @ts-check

const db = require('../../data/db-config');

/**
 * @typedef Order
 * @property {string} id
 * @property {string} buyerId
 * @property {number} quantity
 * @property {string} dateOrdered
 * @property {string} status
 * @property {number} price
 * @property {boolean} priceDetermined
 * @property {string} [comments]
 * @property {string} [organization]
 * @property {string} [organizationWebsite]
 * @property {string} contactName
 * @property {string} contactPhone
 * @property {string} contactEmail
 * @property {string} address
 * @property {string} country
 */

/**
 * List all orders
 * @returns {Promise<Order>}
 */
const findAll = () => {
  return db('orders');
};

/**
 * Lists orders that match the given filter
 * @param {Readonly<Partial<Order>>} filter
 * @returns {Promise<Order[]>}
 */
const findBy = (filter) => {
  return db('orders').where({});
};

/**
 * Gets the order for a specific ID
 * @param {string} id the id of the order to find
 */
const findById = (id) => {
  return db('orders').where({ id }).first().select('*');
};

/**
 * Creates a new order
 * @param {Order} order
 * @returns {Promise<Order[]>}
 */
const create = (order) => {
  return db('orders').insert(order).returning('*');
};

/**
 * Updates the order with a specified id
 * @param {string} id
 * @param {Order} order
 */
const update = (id, order) => {
  return db('orders').where({ id }).first().update(order).returning('*');
};

/**
 * Remove the order with a specified id
 * @param {string} id
 */
const remove = (id) => {
  return db('orders').where({ id }).del();
};

/**
 * Finds or returns an existing order
 * @param {Order} orderObj
 * @returns {Promise<Order>}
 */
const findOrCreateOrder = async (orderObj) => {
  const foundOrder = await findById(orderObj.id).then((order) => order);
  if (foundOrder) {
    return foundOrder;
  } else {
    const [newOrder] = await create(orderObj);
    return newOrder;
  }
};

module.exports = {
  findAll,
  findBy,
  findById,
  create,
  update,
  remove,
  findOrCreateOrder,
};
