const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");

const Order = require("./models/order");

const WebSocket = require("ws");
const http = require("http");

// load .env file to be used
require("dotenv").config();

const orderRoutes = require("./routes/orderRoutes");
const authRoutes = require("./routes/authRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const smsRoutes = require("./routes/smsRoutes");

const app = express();
const port = process.env.PORT || 5000;

// Parse the URLs from the environment variables
const devUrls = process.env.DEV_URLS.split(",");
const prodUrls = process.env.PROD_URLS.split(",");

const allowedOrigins =
  process.env.NODE_ENV === "production" ? prodUrls : devUrls;

const corsOptions = {
  origin: function(origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  }
};

// Middleware setup
app.use(cors(corsOptions));
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI);

mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// WebSocket setup
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

wss.on("connection", async ws => {
  console.log("New WebSocket connection");

  try {
    const orders = await Order.find({});
    ws.send(JSON.stringify({ type: "initialData", orders }));
  } catch (error) {
    ws.send(JSON.stringify({ type: "error", message: error.message }));
  }
});

// Routes setup
app.use(orderRoutes);
app.use(authRoutes);
app.use(paymentRoutes);
app.use(smsRoutes);

server.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
