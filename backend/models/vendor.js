const mongoose = require("mongoose");
//  Vendor Availability Database
const vendorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // Vendor's name
    phone: { 
      type: String, 
      unique: true, 
      required: true, 
      match: /^\d{10}$/ // Validates a 10-digit phone number
    },
    address: { type: String, required: true }, // Vendor's address
    isAvailable: { type: Boolean, required: true }, // Vendor availability status
    lastUpdated: { type: Date, required: true } // Last update timestamp
  },
  { timestamps: true } // Adds createdAt and updatedAt fields automatically
);

// Index for phone to ensure uniqueness and optimize queries
vendorSchema.index({ phone: 1 });

const Vendor = mongoose.model("Vendor", vendorSchema);

module.exports = Vendor;
