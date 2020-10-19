const faker = require('faker');

const createNewOrder = () => ({
  buyerId: String(faker.random.number()),
  quantity: Math.floor(Math.random() * 1000),
  dateOrdered: String(faker.date.recent()),
  status: 'en route',
  priceDetermined: true,
  contactName: String(faker.name.findName()),
  contactPhone: String(faker.phone.phoneNumber()),
  contactEmail: String(faker.internet.email()),
  address: String(faker.address.streetAddress()),
  country: String(faker.address.country()),
});

exports.createNewOrder = createNewOrder;
