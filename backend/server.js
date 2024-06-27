const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");


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


/
app.post("/send-sms", async (req, res) => {
  const { customerNumber, storeNumber, customerMessage, storeMessage } = req.body;

  // Logging the phone numbers for debugging
  console.log(`Original Customer Number: ${customerNumber}`);
  console.log(`Original Store Number: ${storeNumber}`);

  
});

app.listen(port, () => console.log(`Server running on port ${port}`));
// 2LURJRqyS1GQfMQD
// boitekongcommunity