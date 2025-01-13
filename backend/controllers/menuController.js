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

// Get menus for a specific vendor
const getVendorMenus = async (req, res) => {
  const { cookId } = req.params;

  try {
    const menus = await Menu.find();
    const filteredMenus = menus.map(menu => {
      const filteredItems = menu.items.filter(item => item.cook_id === cookId);
      return {
        ...menu._doc,
        items: filteredItems
      };
    }).filter(menu => menu.items.length > 0);

    res.status(200).json(filteredMenus);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch vendor menus" });
  }
};

// Update an item in the menu
const updateMenuItem = async (req, res) => {
  const { menuId, itemId } = req.params;
  const updatedItem = req.body;

  try {
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });

    const item = menu.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Replace the old item with the updated item
    item.set(updatedItem);
    await menu.save();
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
};

// Update an item in the menu for a vendor
const updateMenuItemForVendor = async (req, res) => {
  const { menuId, itemId } = req.params;
  const updatedItem = req.body;
  const cookId = req.headers["x-username"]; // Assuming cookId is passed in the headers

  try {
    const menu = await Menu.findById(menuId);
    if (!menu) return res.status(404).json({ error: "Menu not found" });

    const item = menu.items.id(itemId);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // Check if the item belongs to the vendor
    if (item.cook_id !== cookId) {
      return res.status(403).json({ error: "Forbidden: You do not have permission to update this item" });
    }

    // Replace the old item with the updated item
    item.set(updatedItem);
    await menu.save();
    res.status(200).json({ message: "Item updated successfully", item });
  } catch (error) {
    res.status(500).json({ error: "Failed to update item" });
  }
};

module.exports = {
  populateMenuDatabase,
  getAllMenus,
  getVendorMenus,
  updateMenuItem,
  updateMenuItemForVendor
};