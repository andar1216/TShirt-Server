const express = require('express');
const router = express.Router();
const axios = require('axios');

router.post('/order', async (req, res) => {
  try {
    const { variantId, color, designUrl, recipient } = req.body;

    // Calculate current time adjusted to GMT-5 (EST)
    const now = new Date();
    const adjustedTime = new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString();

    // Build the order data including the position object for file placement.
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
              placement: 'front', // You can change this to 'back', 'sleeve_right', etc.
              position: {
                area_width: 1800,  // total width of the print area on the product
                area_height: 2400, // total height of the print area on the product
                width: 1800,       // width of your design within that area
                height: 1800,      // height of your design within that area
                top: 300,          // offset from the top of the print area
                left: 0,           // offset from the left of the print area
              },
            },
          ],
          options: {
            color: color,
          },
        },
      ],
      submittedAt: adjustedTime,
      // Uncomment the next line to confirm the order immediately if desired:
      // confirm: 1,
    };

    // Make the API request to Printful's orders endpoint.
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
