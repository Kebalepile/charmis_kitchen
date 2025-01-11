const express = require("express");
const vendorController = require("../controllers/vendorController");
const router = express.Router();
router.get("/vendors", vendorController.getAllVendors);
// for below method nust be authenticated and have special previlages
router.get("/vendors/:id", vendorController.getVendorById);
router.post("/vendors", vendorController.createVendor);
router.put("/vendors/:id", vendorController.updateVendor);
router.delete("/vendors/:id", vendorController.deleteVendor);

module.exports = router;