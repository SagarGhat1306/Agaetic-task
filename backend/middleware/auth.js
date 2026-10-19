// auth middleware
// ownerId = whose employees this user can see (admin -> themselves, viewer -> the admin who created them)
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

async function requireAuth(req, res, next) {
  const header = req.headers.authorization || "";
  const [type, token] = header.split(" ");

  if (type !== "Bearer" || !token) {
    throw new AppError("Please log in to continue", 401);
  }

  let payload;
  try {
    payload = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new AppError("Access token expired or invalid", 401);
  }

  const user = await User.findById(payload.id);
  if (!user) {
    throw new AppError("Your account no longer exists", 401);
  }

  req.user = { ...user, ownerId: user.role === "admin" ? user.id : user.created_by };
  next();
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== "admin") {
    throw new AppError("Only admins can do this", 403);
  }
  next();
}

module.exports = { requireAuth, requireAdmin };
