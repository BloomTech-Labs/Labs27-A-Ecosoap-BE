const request = require('supertest');
const express = require('express');
const faker = require('faker');
const server = require('../../api/app.js');
server.use(express.json());

// jest.mock('../../api/order/orderModel');
// mock the auth middleware completely
jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

// Testing Router end points
describe('Hitting base API GET endpoint /', () => {
  //setting up test enviorment to ensure all is working
  it('should return json with api:up', async () => {
    const res = await request(server).get('/');

    expect(res.status).toBe(200);
    expect(res.body.api).toBe('up');
  });
});
//GET /Orders
describe('GET endpoints for orderRouter', () => {
  it('should return json with res status 200', () => {
    return request(server)
      .get('/orders')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.type).toMatch(/json/i);
      });
  });
  it('should return seeded order data values, looking for id of 2 in array index[1]', () => {
    return request(server)
      .get('/orders')
      .then((res) => {
        //parasing the order data from the text res to json
        let obj = JSON.parse(res.text);
        expect(obj.determinedPrice[1].id).toBe('2');
      });
  });
  it('should return all orders and values accurately: Looking for country of order 1', () => {
    return request(server)
      .get('/orders')
      .then((res) => {
        let obj = JSON.parse(res.text);
        expect(obj.determinedPrice[0].country).toBe('Saudi Arabia');
      });
  });
});
//GET BY ID
describe('GET by /:id for orderRouter', () => {
  it('should return a single order, checking for a specific contact in order 3', () => {
    return request(server)
      .get('/orders/3')
      .then((res) => {
        let obj = JSON.parse(res.text);

        expect(obj.contactName).toBe('Orin Lockman');
      });
  });
  it('should return a res status 200 and respond with JSON', () => {
    return request(server)
      .get('/orders/3')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.type).toMatch(/json/i);
      });
  });
  it('should return a res status 404 for an order that does not exist', () => {
    return request(server)
      .get('/orders/8080')
      .then((res) => {
        expect(res.status).toBe(404);
        expect(res.type).toMatch(/json/i);
        expect(res.error.text).toBe(`{"error":"OrderNotFound"}`);
      });
  });
});

//POST
describe('POST by /order endpoint to create an order', () => {
  let seedobj = {
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
  };

  it('should respond with status(500) when we dont send anything in the req.body', () => {
    return request(server)
      .post('/orders')
      .then((res) => {
        expect(res.status).toBe(500);
        expect(res.type).toMatch(/json/i);
      });
  });

  it('should respond with 200 ok status when we send in an order with the body', () => {
    return request(server)
      .post('/orders')
      .send(seedobj)
      .then((res) => {
        let obj = JSON.parse(res.text);
        console.log(obj.message);
        expect(res.status).toBe(200);
        expect(obj.message).toBe('order created');
      });
  });

  it('response should match the seed object we sent as the body ', () => {
    return request(server)
      .post('/orders')
      .send(seedobj)
      .then((res) => {
        let obj = JSON.parse(res.text);
        console.log(obj.order);
        expect(res.status).toBe(200);
        expect(obj.order).toMatchObject(seedobj);
      });
  });
});
// PUT Endpoint
describe('PUT Endpoint for /order', () => {
  it('should do stuff', () => {});
});
