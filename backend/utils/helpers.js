const axios = require("axios");
const WebSocket = require("ws");
const WebSocketSingleton = require("./WebSocketSingleton");

const DEFAULT_WHITELISTED_URLS = [
  "http://localhost:5173/",
  "http://localhost:5173"
];

/**
 * @description Notify connected clients with WebSocket messages.
 * @param {Object} data - The data to send to clients.
 * @param {Array} [whitelistedUrls=DEFAULT_WHITELISTED_URLS] - Array of whitelisted origin URLs.
 */
const notifyClients = (
  originUrl,
  data,
  whitelistedUrls = DEFAULT_WHITELISTED_URLS
) => {
  const wss = WebSocketSingleton.getInstance();

  const jsonData = JSON.stringify(data);

  wss.clients.forEach(client => {
    // Check if the client is ready to receive messages
    if (client.readyState === WebSocket.OPEN) {
      // Check if the client's origin is whitelisted (if applicable)

      client.send(jsonData);
    }
  });
};

module.exports = notifyClients;

const sendResponse = (res, status, data) => {
  res.status(status).json(data);
};

const handleError = (res, error) => {
  console.error("Error:", error);
  res.status(500).json({ error: error.message });
};

const validateOrderFields = ({
  orderNumber,
  name,
  paymentMethod,
  paymentTotal,
  paymentItemsDescriptions
}) => {
  return (
    orderNumber &&
    name &&
    paymentMethod &&
    paymentTotal !== undefined &&
    paymentItemsDescriptions
  );
};

/**
 * @description send sms to phone number via clickatell api
 * @param {string} phone 
 * @param {string} message 
 * @returns 
 */
const clickatellApi = async (phone, message) => {
  const response = await axios.get(
    `https://platform.clickatell.com/messages/http/send`,
    {
      params: {
        apiKey: process.env.CLICKATELL_API_KEY,
        to: phone,
        content: message
      }
    }
  );
  return response.data;
};

module.exports = {
  notifyClients,
  sendResponse,
  handleError,
  validateOrderFields,
  clickatellApi
};
