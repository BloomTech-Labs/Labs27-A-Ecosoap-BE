const db = require('../../data/db-config');

const findAll = () => {
  return db('orders');
};

const findBy = (filter) => {
  return db('orders').where(filter);
};

const findById = (id) => {
  return db('orders').where({ id }).first().select('*');
};

const create = (order) => {
  return db('orders').insert(order).returning('*');
};

const update = (id, order) => {
  return db('orders').where({ id }).first().update(order).returning('*');
};

const remove = (id) => {
  return db('orders').where({ id }).del();
};

const findOrCreateOrder = async (orderObj) => {
  const foundOrder = await findById(orderObj.id).then((order) => order);
  if (foundOrder) {
    return foundOrder;
  } else {
    return await create(orderObj).then((newOrder) => {
      return newOrder ? newOrder[0] : newOrder;
    });
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
