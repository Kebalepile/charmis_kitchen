/**
 * @description
 * Define the endpoints related to payment processing.
 */
const express = require("express");
const router = express.Router();
const { PaymentGateWay } = require("../controllers/paymentController");

router.post("/process-payment", PaymentGateWay);

module.exports = router;
