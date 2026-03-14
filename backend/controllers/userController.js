const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../utils/tokenUtils");

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const trimmedEmail = email?.trim().toLowerCase();

    const exists = await User.findOne({ email: trimmedEmail });
    if (exists) return res.status(400).json({ message: "Email exists" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: trimmedEmail,
      password: hashed,
    })

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Registration failed" });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const trimmedEmail = email?.trim().toLowerCase()

    const user = await User.findOne({ email: trimmedEmail })
    if (!user) {
      console.log(`Login failed: User not found with email ${trimmedEmail}`)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      console.log(`Login failed: Password mismatch for ${trimmedEmail}`)
      return res.status(401).json({ message: "Invalid credentials" })
    }

    if (user.status === "blocked") {
      return res
        .status(403)
        .json({
          message: "Your account has been blocked. Please contact support.",
        });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);

    const { password: _, ...userWithoutPassword } = user.toObject();
    res.json({ user: userWithoutPassword, accessToken, refreshToken });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

const refresh = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken)
    return res.status(401).json({ message: "Refresh token required" });

  try {
    const payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET);
    const user = await User.findById(payload.id);

    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" });
    }

    if (user.status === "blocked") {
      return res.status(403).json({ message: "Account is blocked" });
    }

    const newAccessToken = generateAccessToken(user);
    res.json({ accessToken: newAccessToken });
  } catch (err) {
    res.status(403).json({ message: "Expired or invalid refresh token" });
  }
};

const logout = async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) return res.status(204).send();

  try {
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: "Logout failed" });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .populate("wishlist.product");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch profile" });
  }
};

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId)
      .select("-password")
      .populate("wishlist.product");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch user" });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
};

const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role, status } = req.body;

    const updateData = { role, status };

    if (status === "blocked") {
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true },
    ).select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Failed to update user" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findByIdAndDelete(userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user" });
  }
};

module.exports = {
  register,
  login,
  refresh,
  logout,
  getProfile,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
};

