const User = require("../models/userSchema");
const Product = require("../models/productSchema");
const Order = require("../models/orderSchema");



const getDashboardStats = async (req, res) => {
    try {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        thirtyDaysAgo.setHours(0, 0, 0, 0)

        const twelveMonthsAgo = new Date();
        twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 11);
        twelveMonthsAgo.setDate(1);
        twelveMonthsAgo.setHours(0, 0, 0, 0)


        const [
            totalUsers,
            totalProducts,
            orderStats,
            dailySales,
            monthlyOrdersAgg,
            monthlyUsersAgg
        ] = await Promise.all([
            User.countDocuments(),
            Product.countDocuments(),
            Order.aggregate([
                {
                    $facet: {
                        totalOrders: [{ $count: "count" }],
                        revenue: [
                            { $match: { status: { $ne: "Cancelled" } } },
                            { $group: { _id: null, total: { $sum: "$totalAmount" } } }
                        ],
                        statusCounts: [
                            { $group: { _id: "$status", count: { $sum: 1 } } }
                        ]
                    }
                }
            ]),
            Order.aggregate([
                {
                    $match: {
                        createdAt: { $gte: thirtyDaysAgo },
                        status: { $ne: "Cancelled" }
                    }
                },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        sales: { $sum: "$totalAmount" }
                    }
                },
                { $sort: { _id: 1 } }
            ]),
            Order.aggregate([
                { $match: { createdAt: { $gte: twelveMonthsAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                }
            ]),
            User.aggregate([
                { $match: { createdAt: { $gte: twelveMonthsAgo } } },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                        count: { $sum: 1 }
                    }
                }
            ])
        ]);


        const statsFacet = orderStats[0];
        const totalOrders = statsFacet.totalOrders[0]?.count || 0
        const totalRevenue = statsFacet.revenue[0]?.total || 0
        const statusCounts = statsFacet.statusCounts.reduce((acc, curr) => {
            acc[curr._id || "Pending"] = curr.count
            return acc
        }, {})


        const salesData = [];
        for (let i = 29; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split("T")[0];
            const match = dailySales.find(d => d._id === dateStr);
            salesData.push({ date: dateStr, sales: match ? match.sales : 0 });
        }


        const usersVsOrdersData = [];
        for (let i = 11; i >= 0; i--) {
            const date = new Date();
            date.setMonth(date.getMonth() - i);
            const monthStr = date.toISOString().split("-").slice(0, 2).join("-");
            const monthDisplayName = date.toLocaleString('default', { month: 'short', year: 'numeric' });

            const orderMatch = monthlyOrdersAgg.find(m => m._id === monthStr);
            const userMatch = monthlyUsersAgg.find(m => m._id === monthStr);

            usersVsOrdersData.push({
                month: monthDisplayName,
                orders: orderMatch ? orderMatch.count : 0,
                users: userMatch ? userMatch.count : 0
            })
        }

        res.json({
            totalUsers,
            totalProducts,
            totalOrders,
            totalRevenue,
            statusCounts,
            salesData,
            usersVsOrdersData
        });
    } catch (err) {
        console.error("Get stats error:", err);
        res.status(500).json({ message: "Failed to fetch dashboard statistics" });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        let query = {}
        if (search) {
            query = {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            }
        }

        const skip = (parseInt(page) - 1) * parseInt(limit);
        const totalUsers = await User.countDocuments(query);
        const users = await User.find(query)
            .select("-password")
            .skip(skip)
            .limit(parseInt(limit));

        res.json({
            users,
            totalPages: Math.ceil(totalUsers / limit),
            currentPage: parseInt(page),
            totalUsers
        });
    } catch (err) {
        console.error("Fetch users error:", err)
        res.status(500).json({ message: "Failed to fetch users" })
    }
}

module.exports = {
    getDashboardStats,
    getAllUsers
};
