const express = require("express");
const router = express.Router();
const authenticate = require("../middleware/auth");

const {
  RegisterCustomer,
  LoginCustomer,
  LogoutCustomer,
  RestCustomerPassword,
  EditCustomerDetails
} = require("../controllers/customerController");

router.post("/customer-register", RegisterCustomer);
router.post("/customer-login", LoginCustomer);
router.post("/customer-rest-password", RestCustomerPassword);
router.post("/customer-logout", authenticate, LogoutCustomer);
router.post("/customer-update-profile", authenticate, EditCustomerDetails);

module.exports = router;
