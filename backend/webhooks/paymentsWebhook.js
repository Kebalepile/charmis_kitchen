/**
 * @description
 * Define the endpoints related to payment processing.
 */
const express = require("express");
const crypto = require("crypto");
const webhook = express.Router();

// Middleware to parse raw body for signature verification
const rawBodyMiddleware = (req, res, buf, encoding) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
};

const PaymentGateWay = async (req, res) => {
  try {
    // Step 1: Read and verify the incoming webhook payload
    const secret =process.env.YOCO_TEST_SECRET_KEY; 
    const signature = req.headers["yoco-signature"]; // Header that contains the webhook signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(req.rawBody)
      .digest("hex");

    // Step 2: Verify the event origin using the signature
    if (signature !== expectedSignature) {
      console.error("Invalid signature received!");
      return res.status(400).send("Invalid signature");
    }

    // Step 3: Extract and log the event payload
    const event = req.body;
    console.log("Webhook event received:", event);

    // Step 4: Verify the payment status
    if (event.type === "payment.succeeded") {
      console.log("Payment succeeded!");
      
      // Step 5: Filter by checkoutId to ensure it's relevant
      const { checkoutId } = event.metadata; // Assuming metadata contains the checkoutId
      if (checkoutId === "your-checkout-id") {  // Replace with your actual checkoutId
        // Handle successful payment here
        console.log("Payment matched the checkoutId, processing...");
        
        // Process order fulfillment or update records as needed
      } else {
        console.log("Checkout ID did not match, skipping...");
      }
    } else {
      console.log("Event type is not payment.succeeded, ignoring...");
    }

    // Respond with 200 OK to acknowledge the webhook
    res.status(200).send("Webhook processed successfully");

  } catch (error) {
    console.error("Error processing webhook:", error);
    res.status(500).send("Internal server error");
  }
};

// Register the rawBody middleware for the webhook route
webhook.use(express.json({ verify: rawBodyMiddleware }));
webhook.post("/webhook/", PaymentGateWay);

module.exports = webhook;
