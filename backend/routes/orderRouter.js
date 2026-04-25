const express = require("express")
const { authMiddleware } = require("../middlware/authMiddleware")
const orderController = require("../controllers/orderController")

const router = express.Router()


router.post("/place", authMiddleware, orderController.placeOrder)
router.get("/razorpay/key", authMiddleware, orderController.getRazorpayKey)
router.post("/razorpay/create-order", authMiddleware, orderController.createRazorpayOrder)
router.post("/razorpay/verify", authMiddleware, orderController.verifyRazorpayPayment)
router.get("/:userId", authMiddleware, orderController.getUserOrders)
router.patch("/:userId/:orderId", authMiddleware, orderController.cancelOrder)

module.exports = router

