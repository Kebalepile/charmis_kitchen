const fs = require("fs").promises;
const path = require("path");
const Menu = require("../models/menu"); // Assuming you have a Menu model

// Controller method to populate menu database
const populateMenuDatabase = async (req, res) => {
  try {
    // Read the menu.json file
    const menuFilePath = path.join(__dirname, "../utils/menu.json");
    const menuData = await fs.readFile(menuFilePath, "utf-8");
    const menus = JSON.parse(menuData);

    for (const [menuKey, menuDetails] of Object.entries(menus)) {
      const { name, items } = menuDetails;

      // Upsert the menu
      const menu = await Menu.findOneAndUpdate(
        { name }, // Find by menu name
        { name, items }, // Update with new data
        { upsert: true, new: true } // Create if not exists
      );

      console.log(`Menu "${menu.name}" updated/created.`);
    }

    res.status(200).json({ message: "Menu database populated successfully." });
  } catch (error) {
    console.error("Error populating menu database:", error);
    res.status(500).json({ message: "Error populating menu database.", error });
  }
};

// Get all menus
const getAllMenus = async (req, res) => {
  try {
    const menus = await Menu.find();
    res.status(200).json(menus);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch menus" });
  }
};

// Update stock status of an item
const updateStockStatus = async (req, res) => {
  const { menuId, itemId } = req.params;
  const { in_stock } = req.body;

  try {
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });

    const item = menu.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    item.in_stock = in_stock;
    await menu.save();
    res.status(200).json({ message: "Stock status updated", item });
  } catch (error) {
    res.status(500).json({ error: "Failed to update stock status" });
  }
};

module.exports = {
  populateMenuDatabase,
  getAllMenus,
  updateStockStatus
};
