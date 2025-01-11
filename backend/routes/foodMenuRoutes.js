const express = require("express");
const router = express.Router();
const  {
    populateMenuDatabase,
    getAllMenus,
    updateStockStatus
} = require("../controllers/menuController");

router.get("/menus", getAllMenus);
// for the below routers you have to be autheniticated
//  and have special previlages
router.post("/menus/populate", populateMenuDatabase);
router.put("/menus/:menuId/items/:itemId", updateStockStatus);

module.exports = router;