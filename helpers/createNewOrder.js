const faker = require('faker');

const createNewOrder = () => ({
  quantity: Math.floor(Math.random() * 1000),
  contactName: String(faker.name.findName()),
  contactPhone: String(faker.phone.phoneNumber()),
  contactEmail: String(faker.internet.email()),
  address: String(faker.address.streetAddress()),
  country: String(faker.address.country()),
});

exports.createNewOrder = createNewOrder;
