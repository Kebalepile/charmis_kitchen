const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  prices:{type:Object},
  price: { type: String },
  image_url: { type: String, required: true },
  alt: { type: String },
  cook_phone: { type: String, required: true },
  cook_id: { type: String, required: true },
  support_phone: { type: String },
  quantity_question: { type: String },
  in_stock: { type: Boolean, default: true }, // Add in_stock field
});

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [itemSchema],
});

module.exports = mongoose.model('Menu', menuSchema);
