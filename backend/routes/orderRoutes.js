/**
 * @description the endpoints related to orders.
 */
const express = require("express");
const router = express.Router();
const {
  createOrder,
  getOrders,
  getCookOrders,
  getOrder,
  updateOrder,
  deleteOrder
} = require("../controllers/orderController");
const {authenticate} = require("../middleware/auth");
// must be authenited to access in the future for security reasons
router.post("/orders", createOrder);
// must be authenited to access in the future for security reasons
router.get("/orders", getOrders);
router.post("/orders/by-cook", authenticate, getCookOrders);
// must be authenited to access in the future for security reasons
router.get("/orders/:orderNumber", getOrder);
router.get("/orders/cooks_order/:orderNumber", authenticate, getOrder);
router.put("/orders/:id", authenticate, updateOrder);
router.delete("/orders/:id", authenticate, deleteOrder);

module.exports = router;
