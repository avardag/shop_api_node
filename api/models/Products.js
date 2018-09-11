const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: String,
  price: Number
})

const Product = mongoose.model("Product", productSchema);

module.exports = Product;