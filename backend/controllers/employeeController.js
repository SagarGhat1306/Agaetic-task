// employee CRUD. everything is scoped to req.user.ownerId so admins only see their own data
const { withTransaction } = require("../config/db");
const Employee = require("../models/employeeModel");
const AppError = require("../utils/AppError");

const { ROLES } = Employee;
const SORT_FIELDS = ["name", "department", "hireDate", "createdAt"];
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^\+?[0-9]{7,15}$/;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function cleanText(value) {
  if (value === undefined || value === null) return "";
  return String(value).trim();
}

function readEmployee(body = {}) {
  const employee = {
    first_name: cleanText(body.first_name),
    last_name: cleanText(body.last_name),
    email: cleanText(body.email).toLowerCase(),
    // "98765 43210" and "98765-43210" should count as the same number
    phone: cleanText(body.phone).replace(/[\s()-]/g, "") || null,
    department: cleanText(body.department),
    job_title: cleanText(body.job_title),
    role: cleanText(body.role) || "Employee",
    salary: cleanText(body.salary) === "" ? null : Number(body.salary),
    hire_date: cleanText(body.hire_date) || null,
  };

  const errors = [];

  if (!employee.first_name) errors.push({ field: "first_name", message: "First name is required" });
  if (employee.first_name.length > 50) errors.push({ field: "first_name", message: "First name is too long" });
  if (!employee.last_name) errors.push({ field: "last_name", message: "Last name is required" });
  if (employee.last_name.length > 50) errors.push({ field: "last_name", message: "Last name is too long" });
  if (!EMAIL_PATTERN.test(employee.email)) errors.push({ field: "email", message: "Enter a valid email" });
  if (employee.phone && !PHONE_PATTERN.test(employee.phone)) {
    errors.push({ field: "phone", message: "Enter a valid phone number" });
  }
  if (!employee.department) errors.push({ field: "department", message: "Department is required" });
  if (!employee.job_title) errors.push({ field: "job_title", message: "Job title is required" });
  if (!ROLES.includes(employee.role)) {
    errors.push({ field: "role", message: `Role must be one of: ${ROLES.join(", ")}` });
  }
  if (employee.salary !== null && (Number.isNaN(employee.salary) || employee.salary < 0)) {
    errors.push({ field: "salary", message: "Salary must be a positive number" });
  }
  if (employee.hire_date && !DATE_PATTERN.test(employee.hire_date)) {
    errors.push({ field: "hire_date", message: "Hire date must look like YYYY-MM-DD" });
  }

  if (errors.length > 0) {
    throw new AppError("Please fix the highlighted fields", 400, errors);
  }

  return employee;
}

function readId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("Employee id must be a positive number", 400);
  }
  return id;
}

async function getEmployees(req, res) {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  if (page < 1) page = 1;
  if (limit < 1) limit = 10;
  if (limit > 100) limit = 100; // don't let anyone ask for the whole table at once

  const sortBy = SORT_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : "createdAt";
  const order = req.query.order === "asc" ? "asc" : "desc";

  const { employees, total } = await Employee.findAll({
    ownerId: req.user.ownerId,
    search: cleanText(req.query.search),
    department: cleanText(req.query.department),
    sortBy,
    order,
    limit,
    offset: (page - 1) * limit,
  });

  res.json({
    data: employees,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(Math.ceil(total / limit), 1),
    },
  });
}

async function getEmployee(req, res) {
  const employee = await Employee.findById(readId(req.params.id), req.user.ownerId);

  if (!employee) {
    throw new AppError("Employee not found", 404);
  }

  res.json({ data: employee });
}

async function createEmployee(req, res) {
  const employee = await Employee.create(readEmployee(req.body), req.user.ownerId);
  res.status(201).json({ message: "Employee created", data: employee });
}

async function updateEmployee(req, res) {
  const id = readId(req.params.id);
  const data = readEmployee(req.body);
  const { ownerId } = req.user;

  const employee = await withTransaction(async (client) => {
    const existing = await Employee.findByIdForUpdate(id, ownerId, client);

    if (!existing) {
      throw new AppError("Employee not found", 404);
    }

    return Employee.update(id, ownerId, data, client);
  });

  res.json({ message: "Employee updated", data: employee });
}

async function deleteEmployee(req, res) {
  const deleted = await Employee.remove(readId(req.params.id), req.user.ownerId);

  if (!deleted) {
    throw new AppError("Employee not found", 404);
  }

  res.json({ message: "Employee deleted" });
}

module.exports = { getEmployees, getEmployee, createEmployee, updateEmployee, deleteEmployee };
