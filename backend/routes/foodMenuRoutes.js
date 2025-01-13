const express = require("express");
const {
  authenticate,
  specialPrivileges,
  specialVendorPrivileges
} = require("../middleware/auth");
const router = express.Router();
const {
  populateMenuDatabase,
  getAllMenus,
  updateMenuItem,
  getVendorMenus,
  updateMenuItemForVendor
} = require("../controllers/menuController");

router.get("/menus", getAllMenus);

router.get(
  "/vendor/menus/:cookId",
  authenticate,
  specialVendorPrivileges,
  getVendorMenus
);

router.put(
  "/vendor/menus/:menuId/items/:itemId",
  authenticate,
  specialVendorPrivileges,
  updateMenuItemForVendor
);

router.post(
  "/menus/populate",
  authenticate,
  specialPrivileges,
  populateMenuDatabase
);

router.put(
  "/menus/:menuId/items/:itemId",
  authenticate,
  specialPrivileges,
  updateMenuItem
);

module.exports = router;