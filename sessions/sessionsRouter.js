const express = require('express');

require('dotenv').config({ path: './.env' });
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET);



router.get('/config', async (req, res) => {// ???
    const price = await stripe.prices.retrieve(process.env.PRICE);
  
    res.send({
      publicKey: process.env.STRIPE_PUBLISHABLE_KEY,
      unitAmount: price.unit_amount,
      currency: price.currency,
    });
});

  // Fetch the Checkout Session to display the JSON result on the success page
router.get('/checkout-session', async (req, res) => {
    const { sessionId } = req.query;
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    res.send(session);
});


router.post('/create-checkout-session', async (req, res) => {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'soap',
            },
            unit_amount: 2000,// make dynamic
          },
          quantity: 1,// make dynamic
        },
      ],
      mode: 'payment',
      success_url: 'https://example.com/success',// modify URL path  for FE
      cancel_url: 'https://example.com/cancel',
    });
  
    res.json({ id: session.id });
  });

  router.post('/webhook', async (req, res) => {
    let data;
    let eventType;
    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers['stripe-signature'];
  
      try {
        event = stripe.webhooks.constructEvent(
          req.rawBody,
          signature,
          process.env.STRIPE_WEBHOOK_SECRET
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed.`);
        return res.sendStatus(400);
      }
      // Extract the object from the event.
      data = event.data;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data;
      eventType = req.body.type;
    }
  
    if (eventType === 'checkout.session.completed') {
      console.log(`🔔  Payment received!`);
    }
  
    res.sendStatus(200);
  });

module.exports = router;
