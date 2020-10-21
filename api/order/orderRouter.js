// @ts-check

const express = require('express');
const { v4 } = require('uuid');

const authRequired = require('../middleware/authRequired');
const { validate } = require('../middleware/validate');
const { checkPrice } = require('../pricing/pricingService');
const Orders = require('./orderModel');
const router = express.Router();

const { Stripe } = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET, {
  apiVersion: '2020-08-27',
});

router.get('/', authRequired(), async (req, res) => {
  try {
    const orders = await Orders.findAll();
    res.status(200).json(orders);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
});

router.get('/:id', authRequired(), async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findById(id);

    if (order) {
      res.status(200).json(order);
    } else {
      res.status(404).json({ error: 'OrderNotFound' });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', authRequired(), validate('order'), async (req, res) => {
  const newOrder = req.body;
  if (newOrder) {
    try {
      const { hasPrice, price } = await checkPrice({
        barsRequested: newOrder.quantity,
        contactEmailAddress: newOrder.contactEmail,
        contactName: newOrder.contactName,
        country: newOrder.country,
        organizationName: newOrder.organization,
      });

      const session = await (async () =>
        hasPrice
          ? await stripe.checkout.sessions.create({
              payment_method_types: ['card'],
              line_items: [
                {
                  price_data: {
                    currency: 'usd',
                    product_data: {
                      name: 'soap',
                    },
                    unit_amount: price / newOrder.quantity,
                  },
                  quantity: newOrder.quantity,
                },
              ],
              mode: 'payment',

              success_url: `${process.env.FRONTEND_URL}/dashboard`,
              cancel_url: `${process.env.FRONTEND_URL}/dashboard`,
            })
          : { id: v4() })();

      const [order] = await Orders.create({
        ...newOrder,
        // @ts-ignore
        buyerId: req.profile.id,
        status: 'Pending',
        dateOrdered: new Date().toISOString(),
        priceDetermined: hasPrice,
        price: hasPrice ? price : null,
        id: session.id,
      });

      res.status(200).json({ message: 'order created', order: order });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: e.message });
    }
  } else {
    res.status(404).json({ message: 'Order missing' });
  }
});

router.put(
  '/:id',
  authRequired(),
  validate('order', { requiredFields: false }),
  async (req, res) => {
    const order = req.body;
    if (order) {
      const { id } = req.params;

      try {
        await Orders.findById(id);
      } catch (err) {
        res.status(404).json({
          message: `Could not find profile '${id}'`,
          error: err.message,
        });
      }

      try {
        const [updated] = await Orders.update(id, order);
        res.status(200).json({ message: 'order created', order: updated });
      } catch (err) {
        res.status(500).json({
          message: `Could not update order '${id}'`,
          error: err.message,
        });
      }
    }
  }
);

router.delete('/:id', authRequired(), async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Orders.findById(id);
    if (order) {
      await Orders.remove(id);
      res
        .status(200)
        .json({ message: `Order '${id}' was deleted.`, order: order });
    } else {
      res.status(404).json({ message: 'Order was not found' });
    }
  } catch (err) {
    res.status(500).json({
      message: `Could not delete order with ID: ${id}`,
      error: err.message,
    });
  }
});

module.exports = router;
