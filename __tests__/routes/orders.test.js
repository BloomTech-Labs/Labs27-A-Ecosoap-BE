const request = require('supertest');
const express = require('express');
const server = require('../../api/app.js');
const { findAll, findBy } = require('../../api/order/orderModel');
const { createNewOrder } = require('./createNewOrder');
server.use(express.json());

jest.mock('../../api/order/orderModel');
jest.mock('../../api/middleware/authRequired', () =>
  jest.fn((req, res, next) => next())
);

//GET /Orders
describe('GET endpoints for orderRouter', () => {
  it('should return json with res status 200', () => {
    findAll.mockResolvedValue([]);

    return request(server)
      .get('/orders')
      .then((res) => {
        expect(res.status).toBe(200);
        expect(res.type).toMatch(/json/i);
      });
  });

  it('should return seeded order data values, looking for id of 2 in array index[1]', () => {
    findBy.mockResolvedValue([{}, { id: '2' }]);

    return request(server)
      .get('/orders')
      .then((res) => {
        expect(findBy).toHaveBeenCalledWith({ priceDetermined: true });
        expect(findBy).toHaveBeenCalledWith({ priceDetermined: false });
        expect(res.body.determinedPrice[1].id).toBe('2');
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
  const newOrder = createNewOrder();

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
      .send(newOrder)
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
      .send(newOrder)
      .then((res) => {
        let obj = JSON.parse(res.text);
        console.log(obj.order);
        expect(res.status).toBe(200);
        expect(obj.order).toMatchObject(newOrder);
      });
  });
});

// PUT Endpoint
describe('PUT Endpoint for /order', () => {
  it('should do stuff', () => {});
});
