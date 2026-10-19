// /api/employees - viewers can read, admins can do everything
const express = require("express");
const employeeController = require("../controllers/employeeController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

const router = express.Router();

router.use(requireAuth);

router.get("/", employeeController.getEmployees);
router.get("/:id", employeeController.getEmployee);
router.post("/", requireAdmin, employeeController.createEmployee);
router.put("/:id", requireAdmin, employeeController.updateEmployee);
router.delete("/:id", requireAdmin, employeeController.deleteEmployee);

module.exports = router;
