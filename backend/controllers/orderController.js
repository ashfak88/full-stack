const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Order = require("../models/orderSchema");
const Cart = require("../models/cartSchema");
const { v4: uuidv4 } = require("uuid");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const placeOrder = async (req, res) => {
  try {
    const { items, address, phone, paymentMethod } = req.body

    if (!items || !Array.isArray(items)) {
      return res.status(400).json({ message: "Invalid request data" });
    }


    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    const validItems = items.filter((i) => i.product && i.price && i.quantity);

    if (validItems.length === 0) {
      return res.status(400).json({ message: "No valid items in order" });
    }

    const totalAmount = validItems.reduce(
      (sum, i) => sum + i.price * i.quantity,
      0,
    )

    for (const item of validItems) {
      try {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        })
      } catch (stockErr) {
        console.error("Stock update failed for:", item.product, stockErr);
      }
    }

    const newOrder = new Order({
      userId: req.user.id,
      userName: user.name,
      orderId: uuidv4(),
      items: validItems,
      totalAmount,
      address,
      phone,
      paymentMethod: paymentMethod || "cod",
      status: "Pending",
    });

    await newOrder.save();

    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { $set: { items: [] } }
    );

    res.json({ message: "Order placed successfully" });
  } catch (err) {
    console.error("Order placement failed:", err);
    res.status(500).json({
      message: err.message || "Internal server error while placing order",
    });
  }
};

const getUserOrders = async (req, res) => {
  try {
    if (req.user.id !== req.params.userId)
      return res.status(403).json({ message: "Forbidden" })

    const orders = await Order.find({ userId: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("Fetch orders failed:", err);
    res.status(500).json({ message: "Failed to fetch orders" })
  }
}

const cancelOrder = async (req, res) => {
  try {
    const { userId, orderId } = req.params;

    if (req.user.id !== userId)
      return res.status(403).json({ message: "Forbidden" })

    const order = await Order.findOne({ orderId: orderId, userId: userId });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Cancelled";
    await order.save();

    res.json({ message: "Order cancelled" });
  } catch (err) {
    console.error("Cancel order failed:", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const pipeline = [
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "userDetails"
        }
      },
      { $unwind: { path: "$userDetails", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: "$orderId",
          orderId: 1,
          email: "$userDetails.email",
          name: { $ifNull: ["$userName", "$userDetails.name", "$email"] },
          items: 1,
          totalAmount: 1,
          status: 1,
          address: 1,
          phone: 1,
          createdAt: 1,
        }
      }
    ];

    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { orderId: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } },
            { name: { $regex: search, $options: "i" } }
          ]
        }
      });
    }

    pipeline.push({ $sort: { createdAt: -1 } });

    pipeline.push({
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: parseInt(limit) }]
      }
    });

    const result = await Order.aggregate(pipeline);

    const data = result[0].data;
    const total = result[0].metadata[0] ? result[0].metadata[0].total : 0;


    const finalData = await Order.populate(data, { path: "items.product", model: "Product" });

    res.json({
      orders: finalData,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      totalOrders: total
    });

  } catch (err) {
    console.error("Fetch orders error:", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status: newStatus } = req.body;

    const order = await Order.findOne({ orderId: id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const oldStatus = order.status;


    if (newStatus === "Cancelled" && oldStatus !== "Cancelled") {

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    } else if (oldStatus === "Cancelled" && newStatus !== "Cancelled") {

      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -item.quantity },
        });
      }
    }

    order.status = newStatus;
    await order.save();

    res.json({ message: "Order status updated", order });
  } catch (err) {
    console.error("Status update error:", err);
    res.status(500).json({ message: "Failed to update order status" });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;

    const order = await Order.findOne({ orderId: id });
    if (!order) return res.status(404).json({ message: "Order not found" });

    if (order.status !== "Cancelled") {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: item.quantity },
        });
      }
    }

    await Order.findOneAndDelete({ orderId: id });

    res.json({ message: "Order deleted and stock restored" });
  } catch (err) {
    console.error("Delete order error:", err);
    res.status(500).json({ message: "Failed to delete order" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;


    const order = await Order.findOne({ orderId: id }).populate("items.product").populate("userId");

    if (!order) return res.status(404).json({ message: "Order not found" });

    res.json({
      id: order.orderId,
      orderId: order.orderId,
      email: order.userId ? order.userId.email : "Unknown",
      userName: order.userName || (order.userId ? order.userId.name : "Unknown"),
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      address: order.address,
      phone: order.phone,
      createdAt: order.createdAt
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch order" });
  }
};

const getRazorpayKey = (req, res) => {
  res.status(200).json({ key: process.env.RAZORPAY_KEY_ID });
};

const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;
    
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const instance = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: Math.round(amount * 100), // amount in smallest currency unit (paise for INR)
      currency: "INR",
      receipt: `rcpt_${uuidv4().slice(0, 20)}`
    };

    const order = await instance.orders.create(options);

    if (!order) return res.status(500).json({ message: "Some error occurred" });

    res.json(order);
  } catch (error) {
    console.error("Razorpay Create Order Error:", error);
    res.status(500).json({ message: "Failed to create Razorpay order", details: error.message });
  }
};

const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
      phone
    } = req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const user = await User.findById(req.user.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      const validItems = items.filter((i) => i.product && i.price && i.quantity);

      if (validItems.length === 0) {
        return res.status(400).json({ message: "No valid items in order" });
      }

      const totalAmount = validItems.reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      )

      for (const item of validItems) {
        try {
          await Product.findByIdAndUpdate(item.product, {
            $inc: { stock: -item.quantity },
          })
        } catch (stockErr) {
          console.error("Stock update failed for:", item.product, stockErr);
        }
      }

      const newOrder = new Order({
        userId: req.user.id,
        userName: user.name,
        orderId: uuidv4(),
        items: validItems,
        totalAmount,
        address,
        phone,
        paymentMethod: "razorpay",
        status: "Pending", 
      });

      await newOrder.save();

      await Cart.findOneAndUpdate(
        { userId: req.user.id },
        { $set: { items: [] } }
      );

      res.status(200).json({ message: "Payment verified successfully and order placed" });
    } else {
      res.status(400).json({ message: "Invalid Signature" });
    }
  } catch (error) {
    console.error("Payment Verification Error:", error);
    res.status(500).json({ message: "Internal server error during verification" });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
  getOrderById,
  getRazorpayKey,
  createRazorpayOrder,
  verifyRazorpayPayment
};
