const mongoose = require("mongoose");


const wishlistItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true
    }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: { type: String, unique: true },
    password: String,
    role: { type: String, default: "user" },
    status: { type: String, default: "active" },
    wishlist: [wishlistItemSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
