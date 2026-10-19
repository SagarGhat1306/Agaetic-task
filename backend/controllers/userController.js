// admin creates / resets / deletes viewer logins
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const { withTransaction } = require("../config/db");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const AppError = require("../utils/AppError");
const mailer = require("../utils/mailer");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// no 0/O or 1/l/I so people don't mix them up when typing
const PASSWORD_CHARS = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";

function generatePassword() {
  let password = "";

  // keep trying until it has at least one letter and one number
  while (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password)) {
    password = "";
    for (let i = 0; i < 12; i++) {
      password += PASSWORD_CHARS[crypto.randomInt(PASSWORD_CHARS.length)];
    }
  }

  return password;
}

function readId(value) {
  const id = Number(value);
  if (!Number.isInteger(id) || id < 1) {
    throw new AppError("User id must be a positive number", 400);
  }
  return id;
}

async function listUsers(req, res) {
  const users = await User.findTeam(req.user.id);
  res.json({ data: users, emailEnabled: mailer.isConfigured });
}

async function createViewer(req, res) {
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email = typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";

  const errors = [];
  if (!name) errors.push({ field: "name", message: "Name is required" });
  if (name.length > 100) errors.push({ field: "name", message: "Name is too long" });
  if (!EMAIL_PATTERN.test(email)) errors.push({ field: "email", message: "Enter a valid email" });
  if (errors.length > 0) {
    throw new AppError("Please fix the highlighted fields", 400, errors);
  }

  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);
  const user = await User.create({ name, email, passwordHash, role: "viewer", createdBy: req.user.id });

  const emailSent = await mailer.sendLoginDetails({ name, email, password, isReset: false });

  res.status(201).json({ data: user, password, emailSent });
}

async function resetPassword(req, res) {
  const id = readId(req.params.id);
  const password = generatePassword();
  const passwordHash = await bcrypt.hash(password, 12);

  const user = await withTransaction(async (client) => {
    const updated = await User.updatePassword(id, req.user.id, passwordHash, client);
    if (!updated) {
      throw new AppError("User not found", 404);
    }
    await RefreshToken.revokeAllForUser(id, client);
    return updated;
  });

  const emailSent = await mailer.sendLoginDetails({ ...user, password, isReset: true });

  res.json({ data: user, password, emailSent });
}

async function deleteUser(req, res) {
  const id = readId(req.params.id);

  if (id === req.user.id) {
    throw new AppError("You can't delete your own account", 400);
  }

  const deleted = await User.remove(id, req.user.id);
  if (!deleted) {
    throw new AppError("User not found", 404);
  }

  res.json({ message: "User deleted" });
}

module.exports = { listUsers, createViewer, resetPassword, deleteUser };
