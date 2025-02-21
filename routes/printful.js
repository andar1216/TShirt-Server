// routes/printful.js
import express from "express";
import axios from "axios";

const router = express.Router();

router.post("/order", async (req, res) => {
  try {
    // Extract dynamic decal positioning along with other fields.
    const { variantId, color, designUrl, recipient, designPosition } = req.body;

    // Set default design position values if none are provided.
    const defaultPosition = {
      top: 0,
      left: 0,
      width: 900,
      height: 900
    };

    // Use the provided designPosition or default to our hard-coded values.
    const dynamicPosition = designPosition || defaultPosition;

    // Calculate current time adjusted to GMT-5 (EST)
    const now = new Date();
    const adjustedTime = new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString();

    // Build the order data including the dynamic position object for file placement.
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
              position: {
                area_width: 1800,
                area_height: 2400,
                width: dynamicPosition.width,
                height: dynamicPosition.height,
                top: dynamicPosition.top,
                left: dynamicPosition.left,
              },
            },
          ],
          options: {
            color: color,
          },
        },
      ],
      submittedAt: adjustedTime,
      // confirm: 1, // Uncomment to auto-confirm the order
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

export default router;
