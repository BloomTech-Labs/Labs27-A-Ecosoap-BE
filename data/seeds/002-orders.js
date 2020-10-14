const faker = require('faker');

/**
 * Publish change
 * @param {import('knex')} knex
 */
exports.seed = (knex) => {
  // Deletes ALL existing entries
  return knex('orders')
    .truncate()
    .then(() => {
      // Inserts seed entries
      // const map = new Map()

      // const seedArr = Array.from({ length: 100 }, (_, i) => {
      //   return {
      //     id: `${i}`,

      //   }
      // });

      return knex('orders').insert([
        {
          id: '1',
          buyerId: '12',
          quantity: 2,
          dateOrdered: faker.date.past().toISOString(),
          status: 'completed',
          priceDetermined: true,
          contactName: faker.name.findName(),
          contactPhone: faker.phone.phoneNumber(),
          contactEmail: faker.internet.email(),
          address: '123 wallaby way',
          country: faker.address.country(),
        },
        {
          id: '2',
          buyerId: '31',
          quantity: 4,
          dateOrdered: faker.date.past().toISOString(),
          status: 'WIP',
          priceDetermined: true,
          contactName: faker.name.findName(),
          contactPhone: faker.phone.phoneNumber(),
          contactEmail: faker.internet.email(),
          address: '123 wallaby way',
          country: faker.address.country(),
        },
        {
          id: '3',
          buyerId: '2',
          quantity: 3,
          dateOrdered: faker.date.past().toISOString(),
          status: 'completed',
          priceDetermined: true,
          contactName: faker.name.findName(),
          contactPhone: faker.phone.phoneNumber(),
          contactEmail: faker.internet.email(),
          address: '123 wallaby way',
          country: faker.address.country(),
        },
      ]);
    });
};
