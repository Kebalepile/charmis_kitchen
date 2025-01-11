const Vendor = require("../models/vendor");

async function createVendor(req, res) {
  try {
    const vendor = new Vendor(req.body);
    await vendor.save();
    res.status(201).json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}

async function getVendorById(req, res) {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }
    res.json(vendor);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getAllVendors(req, res) {
  try {
    const vendors = await Vendor.find({});
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateVendor(req, res) {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "address", "phone"]; // Add other fields as necessary
  const isValidOperation = updates.every(update =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).json({ error: "Invalid updates!" });
  }

  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor) {
      return res.status(404).json({ error: "Vendor not found" });
    }

    updates.forEach(update => (vendor[update] = req.body[update]));
    await vendor.save();
    res.json(vendor);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}
async function deleteVendor(req, res) {
    try {
        const vendor = await Vendor.findByIdAndDelete(req.params.id);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }
        res.json({ message: "Vendor deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = {
    createVendor,
    getVendorById,
    getAllVendors,
    updateVendor,
    deleteVendor
};

