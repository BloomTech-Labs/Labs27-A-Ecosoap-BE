const request = require('supertest');

const server = require('../../api/app.js');
const {
  findAll,
  findById,
  create,
  update,
} = require('../../api/order/orderModel');
const { createNewOrder } = require('../../helpers/createNewOrder');

jest.mock('../../api/order/orderModel');
jest.mock('../../api/middleware/authRequired', () => () =>
  jest.fn((req, res, next) => {
    req.profile = { id: 'something' };
    next();
  })
);

//GET /Orders
describe('GET endpoints for orderRouter', () => {
  it('should return json with res status 200', async () => {
    findAll.mockResolvedValue([]);

    const res = await request(server).get('/orders');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/i);
  });

  it('should return seeded order data values, looking for id of 2 in array index[1]', async () => {
    findAll.mockResolvedValue([{}, { id: '2' }]);

    const res = await request(server).get('/orders');
    expect(res.body[1].id).toBe('2');
  });

  it('should return all orders and values accurately: Looking for country of order 1', async () => {
    findAll.mockResolvedValue([{ country: 'Saudi Arabia' }, {}]);

    const res = await request(server).get('/orders');
    expect(res.body[0].country).toBe('Saudi Arabia');
  });
});

//GET BY ID
describe('GET by /:id for orderRouter', () => {
  it('should return a single order, checking for a specific contact in order 3', async () => {
    findById.mockResolvedValue({ contactName: 'Orin Lockman' });

    const res = await request(server).get('/orders/3');
    expect(res.body.contactName).toBe('Orin Lockman');
  });

  it('should return a res status 200 and respond with JSON', async () => {
    findById.mockResolvedValue({});

    const res = await request(server).get('/orders/3');
    expect(res.status).toBe(200);
    expect(res.type).toMatch(/json/i);
  });

  it('should return a res status 404 for an order that does not exist', async () => {
    findById.mockResolvedValue(undefined);

    const res = await request(server).get('/orders/8080');
    expect(res.status).toBe(404);
    expect(res.type).toMatch(/json/i);
    expect(res.error.text).toBe(`{"error":"OrderNotFound"}`);
  });
});

//POST
describe('POST by /order endpoint to create an order', () => {
  const newOrder = createNewOrder();

  it('should respond with status(400) when we dont send anything in the req.body', async () => {
    create.mockRejectedValue(Error('Invalid Data'));

    const res = await request(server).post('/orders');
    expect(res.status).toBe(400);
    expect(res.type).toMatch(/json/i);
  });

  it('should respond with 200 ok status when we send in an order with the body', async () => {
    create.mockImplementation((order) => [order]);

    const res = await request(server).post('/orders').send(newOrder);
    expect(res.status).toBe(200);
    expect(res.body.message).toBe('order created');
  });

  it('response should match the seed object we sent as the body ', async () => {
    create.mockImplementation((order) => [order]);

    const res = await request(server).post('/orders').send(newOrder);
    expect(res.status).toBe(200);
    expect(res.body.order).toMatchObject(newOrder);
  });
});

// PUT Endpoint
describe('PUT Endpoint for /order', () => {
  it('should respond with 400 when input is invalid', () => {
    update.mockRejectedValue(Error('Invalid Data'));

    return request(server)
      .put('/orders/1')
      .then((res) => {
        expect(res.status).toBe(400);
        expect(res.type).toMatch(/json/i);
      });
  });

  it('should send data to database to be updated', async () => {
    update.mockImplementation((order) => [order]);

    const res = await request(server)
      .put('/orders/1')
      .send({ contactName: 'John Doe' });

    expect(res.status).toBe(200);
    expect(update).toHaveBeenCalledWith('1', { contactName: 'John Doe' });
  });
});

// DELETE Endpoint
describe('DELETE Endpoint for /order', () => {
  it('should respond with 404 when there is no order', async () => {
    findById.mockResolvedValue(undefined);

    const res = await request(server).delete('/orders/1');

    expect(res.status).toBe(404);
  });

  it('should return the deleted order', async () => {
    const order = createNewOrder();
    findById.mockResolvedValue(order);

    const res = await request(server).delete('/orders/1');

    expect(res.status).toBe(200);
    expect(res.body.order.contactName).toBe(order.contactName);
  });
});
