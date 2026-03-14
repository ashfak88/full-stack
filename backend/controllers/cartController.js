const Cart = require("../models/cartSchema");
const User = require("../models/userSchema");

const getCart = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId) {
      return res.status(403).json({ message: "Forbidden Access" });
    }

    const cart = await Cart.findOne({ userId: req.user.id }).populate("items.product");

    if (!cart) return res.json([]);

    res.json(cart.items || []);
  } catch (err) {
    console.error(err);
    res.status(500).json([]);
  }
};

const updateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;

    console.log("Update cart request for user:", req.params.userId);
    console.log("Auth user ID:", req.user.id);

    if (req.user.id !== req.params.userId) {
      console.log("Auth mismatch: Forbidden Access");
      return res.status(403).json({ message: "Forbidden Access" });
    }

    if (!Array.isArray(cartItems)) {
      console.log("Error: cartItems is not an array");
      return res.status(400).json({ message: "Invalid cart data" });
    }


    const validItems = cartItems.filter(item => (item.product?._id || item.product) && item.quantity > 0);
    console.log("Valid items count:", validItems.length);


    const user = await User.findById(req.user.id);
    const userName = user ? user.name : "Unknown";

    const cart = await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: validItems, userName: userName },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    ).populate("items.product");

    console.log("Cart updated successfully in MongoDB");
    res.json(cart.items);
  } catch (err) {
    console.error("CRITICAL: Cart update error details:", err);
    res.status(500).json({ message: "Failed to update cart", error: err.message });
  }
}

module.exports = {
  getCart,
  updateCart,
}
