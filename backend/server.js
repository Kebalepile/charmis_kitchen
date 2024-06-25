const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const twilio = require("twilio");

require("dotenv").config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 5000;

// More than one origin: Define an array of allowed origins
const allowedOrigins = ["http://localhost:5173", "http://localhost:5173/"];

// Configure CORS options
const corsOptions = {
  origin: function (origin, callback) {
    // Check if the origin is in the allowed list or if it is undefined (for non-browser environments like curl requests)
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
};
app.use(cors(corsOptions));

app.use(bodyParser.json());

// Function to format phone numbers
function formatPhoneNumber(number) {
  if (number.startsWith("0")) {
    return "+27" + number.slice(1);
  }
  return number;
}

// Create a Twilio client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

app.post("/send-sms", async (req, res) => {
  const { customerNumber, storeNumber, customerMessage, storeMessage } = req.body;

  // Logging the phone numbers for debugging
  console.log(`Original Customer Number: ${customerNumber}`);
  console.log(`Original Store Number: ${storeNumber}`);

  // Format the numbers correctly
  const formattedCustomerNumber = formatPhoneNumber(customerNumber);
  const formattedStoreNumber = formatPhoneNumber(storeNumber);

  // Log formatted numbers
  console.log(`Formatted Customer Number: ${formattedCustomerNumber}`);
  console.log(`Formatted Store Number: ${formattedStoreNumber}`);

  try {
    // Send SMS to customer
    const customerResponse = await client.messages.create({
      body: customerMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedCustomerNumber,
    });
    console.log(`Customer SMS sent: ${customerResponse.sid}`);

    // Send SMS to store owner
    const storeResponse = await client.messages.create({
      body: storeMessage,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: formattedStoreNumber,
    });
    console.log(`Store owner SMS sent: ${storeResponse.sid}`);

    res.status(200).send("SMS sent");
  } catch (error) {
    console.error("Error sending SMS:", error);
    res.status(500).send("Error sending SMS");
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
