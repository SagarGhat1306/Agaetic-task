// /api/auth
const express = require("express");
const authController = require("../controllers/authController");
const { requireAuth } = require("../middleware/auth");
const { loginLimiter, refreshLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/register", loginLimiter, authController.register);
router.post("/login", loginLimiter, authController.login);
router.post("/refresh", refreshLimiter, authController.refresh);
router.post("/logout", authController.logout);
router.get("/me", requireAuth, authController.me);

module.exports = router;
