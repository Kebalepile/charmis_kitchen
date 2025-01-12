const express = require("express");
const { authenticate, specialPrivileges } = require("../middleware/auth");
const router = express.Router();
const {
  populateMenuDatabase,
  getAllMenus,
  updateStockStatus
} = require("../controllers/menuController");

router.get("/menus", getAllMenus);
// for the below routers you have to be autheniticated
//  and have special previlages
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
  updateStockStatus
);

module.exports = router;
