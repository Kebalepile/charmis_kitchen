const express = require("express");
const vendorController = require("../controllers/vendorController");
const router = express.Router();
const { authenticate, specialPrivileges } = require("../middleware/auth");

router.get(
  "/vendors",
  authenticate,
  specialPrivileges,
  vendorController.getAllVendors
);
// for below method nust be authenticated and have special previlages
router.get(
  "/vendors/:id",
  authenticate,
  specialPrivileges,
  vendorController.getVendorById
);
router.post(
  "/vendors",
  authenticate,
  specialPrivileges,
  vendorController.createVendor
);
router.put(
  "/vendors/:id",
  authenticate,
  specialPrivileges,
  vendorController.updateVendor
);
router.delete(
  "/vendors/:id",
  authenticate,
  specialPrivileges,
  vendorController.deleteVendor
);

module.exports = router;
