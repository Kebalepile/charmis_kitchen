const axios = require("axios");
const { sendResponse, handleError } = require("../utils/helpers");
const Order = require("../models/order");

/**
 * @description payment processing logic using YOCO custom payment gateway
 */
const PaymentGateWay = async (req, res) => {
  const { newOrder, paths } = req.body;

  if (!newOrder) {
    return sendResponse(res, 400, { message: "Order data is missing." });
  }

  const postData = {
    amount: newOrder.paymentTotal * 100, // YOCO uses cents, multiply by 100
    currency: "ZAR",
    cancelUrl:paths.cancelUrl,
    successUrl: paths.successUrl,
    failureUrl: paths.failureUrl
  };

  try {
    // YOCO checkouts API call
    const checkoutsAPI = await axios.post(
      "https://payments.yoco.com/api/checkouts",
      postData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.YOCO_TEST_SECRET_KEY}`
        }
      }
    );

    const info = {
      id: null,
      redirectUrl: null
    };

    // If YOCO checkout creation is successful
    if (checkoutsAPI.status === 200) {
      info.id = checkoutsAPI.data.id;
      info.redirectUrl = checkoutsAPI.data.redirectUrl;

      // Ensure cookId is an array
      if (!Array.isArray(newOrder.cookId)) {
        newOrder.cookId = [newOrder.cookId];
      }

      // Create a temporary order object
      const tempOrder = new Order({
        ...newOrder,
        checkoutId: checkoutsAPI.data.id,
        redirectUrl: checkoutsAPI.data.redirectUrl,
        status: "Temp",
        timestamp: new Date()
      });

      // Save temporary order
      await tempOrder.save();

      // Send response with payment info
      sendResponse(res, checkoutsAPI.status, info);
    } else {
      sendResponse(res, checkoutsAPI.status, { message: "Failed to create payment." });
    }
  } catch (error) {
    // Handle MongoDB duplicate key errors or API errors
    if (error.code === 11000) {
      return sendResponse(res, 409, { message: "Duplicate order detected." });
    }

    // Log any other error and send a response
    handleError(res, error);
  }
};

module.exports = {
  PaymentGateWay
};
