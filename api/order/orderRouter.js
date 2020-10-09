const express = require('express');
const authRequired = require('../middleware/authRequired');
const Orders = require('./orderModel');
const router = express.Router();
const {v4: uuidv4} = require('uuidv4');

router.get('/', authRequired, function (req, res) {
  Orders.findAll()
    .then((orders) => {
      res.status(200).json(orders);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
});

router.get('/:id', authRequired, function (req, res) {
  const id = String(req.params.id);
  Orders.findById(id)
    .then((order) => {
      if (order) {
        res.status(200).json(order);
      } else {
        res.status(404).json({ error: 'OrderNotFound' });
      }
    })
    .catch((err) => {
      res.status(500).json({ error: err.message });
    });
});

router.post('/', authRequired, async (req, res) => {
  const newOrder = req.body;
  if (newOrder) {
    const id = newOrder.id || uuidv4();
    try {
      await Orders.findById(id).then(async (ordr) => {
        if (ordr === undefined) {
          //profile not found so lets insert it
          await Orders.create(newOrder).then((order) =>
            res.status(200).json({ message: 'order created', order: order[0] })
          );
        } else {
          res.status(400).json({ message: 'order already exists' });
        }
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'Order missing' });
  }
});

router.put('/', authRequired, function (req, res) {
  const order = req.body;
  if (order) {
    const id = newOrder.id || uuidv4(); 
    Orders.findById(id)
      .then(
        Orders.update(id, order)
          .then((updated) => {
            res
              .status(200)
              .json({ message: 'order created', order: updated[0] });
          })
          .catch((err) => {
            res.status(500).json({
              message: `Could not update order '${id}'`,
              error: err.message,
            });
          })
      )
      .catch((err) => {
        res.status(404).json({
          message: `Could not find profile '${id}'`,
          error: err.message,
        });
      });
  }
});

router.delete('/:id', authRequired, function (req, res) {
  const id = req.params.id;
  try {
    Orders.findById(id).then((order) => {
      Orders.remove(order.id).then(() => {
        res
          .status(200)
          .json({ message: `Order '${id}' was deleted.`, order: order });
      });
    });
  } catch (err) {
    res.status(500).json({
      message: `Could not delete order with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
