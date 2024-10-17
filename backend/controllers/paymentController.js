const axios = require("axios");
const { sendResponse, handleError } = require("../utils/helpers");
const Order = require("../models/order");
/**
 * @description payment processing logic using YOCO custom payment
 * gateway 
 */
const PaymentGateWay = async (req, res) => {
  const { paymentTotal, newOrder } = req.body;
  const postData = {
    amount: paymentTotal * 100,
    currency: "ZAR"
  };
  try {
    // add a sucess url and a cancel url
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

    console.log("Yoco response:", checkoutsAPI);

    const info = {
      id: null,
      redirectUrl: null
    };

    if (checkoutsAPI.status === 200) {
      info.id = checkoutsAPI.data.id;
      info.redirectUrl = checkoutsAPI.data.redirectUrl;
     
      if (!Array.isArray(newOrder.cookId)) {
        newOrder.cookId = [newOrder.cookId];
      }
      const tempOrder = new Order({
        ...newOrder,
        checkoutId: checkoutsAPI.data.id,
        redirectUrl: checkoutsAPI.data.redirectUrl,
        status: "Temp",
        timestamp: new Date()
      });
      tempOrder.save();

      sendResponse(res, checkoutsAPI.status, info);
    } else {
      sendResponse(res, checkoutsAPI.status, info);
    }
  } catch (error) {
    handleError(res, error);
  }
};
module.exports = {
  PaymentGateWay
};
