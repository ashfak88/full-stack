const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    price: {
      type: Number,
      required: true,
      min: 0
    },

    stock: {
      type: Number,
      required: true,
      min: 0
    },

    category: {
      type: String,
      required: true,
      lowercase: true
    },

    image: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
productSchema.index({ createdAt: 1, _id: 1 });

module.exports = mongoose.model("Product", productSchema);
