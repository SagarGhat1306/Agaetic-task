// /api/users (admin only)
const express = require("express");
const userController = require("../controllers/userController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.get("/", userController.listUsers);
router.post("/", userController.createViewer);
router.post("/:id/reset-password", userController.resetPassword);
router.delete("/:id", userController.deleteUser);

module.exports = router;
