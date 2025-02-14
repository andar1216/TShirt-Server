const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/order', async (req, res) => {
  try {
    const { variantId, color, designUrl, recipient } = req.body;

    const orderData = {
      recipient: {
        name: recipient.name,
        address1: recipient.address1,
        city: recipient.city,
        state_code: recipient.state_code,
        country_code: recipient.country_code,
        zip: recipient.zip,
      },
      items: [
        {
          variant_id: variantId,
          quantity: 1,
          files: [
            {
              url: designUrl,
              placement: 'front',
            },
          ],
          // Optionally include extra options if Printful supports them
          options: {
            color: color,
          },
        },
      ],
      // Uncomment the next line to confirm the order immediately if desired:
      // confirm: 1,
    };

    // Note the updated endpoint: '/orders'
    const printfulResponse = await axios.post(
      'https://api.printful.com/orders',
      orderData,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PRINTFUL_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    res.status(200).json(printfulResponse.data);
  } catch (error) {
    console.error('Error creating Printful order:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Failed to create order in Printful',
      error: error.response?.data || error.message,
    });
  }
});

module.exports = router;
