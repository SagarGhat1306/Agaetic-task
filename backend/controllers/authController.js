// register, login, refresh and logout
// access token = short lived jwt, refresh token = random string in an httpOnly cookie
const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { pool, withTransaction } = require("../config/db");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const AppError = require("../utils/AppError");

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const REFRESH_COOKIE = "refreshToken";
const REFRESH_DAYS = Number(process.env.REFRESH_TOKEN_DAYS) || 7;
const REUSE_GRACE_SECONDS = 30;
const isProduction = process.env.NODE_ENV === "production";

function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createAccessToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN || "15m",
  });
}

async function createRefreshToken(userId, db) {
  const token = crypto.randomBytes(64).toString("hex");
  const expiresAt = new Date(Date.now() + REFRESH_DAYS * 24 * 60 * 60 * 1000);
  const id = await RefreshToken.create({ userId, tokenHash: hashToken(token), expiresAt }, db);
  return { id, token, expiresAt };
}

// two tabs (or a quick double reload) can send the same token at the same moment.
// if the token was only just swapped for a new one that's still active, that's not theft
async function isHarmlessRace(saved, client) {
  const secondsAgo = (Date.now() - new Date(saved.revoked_at).getTime()) / 1000;
  if (!saved.replaced_by || secondsAgo > REUSE_GRACE_SECONDS) return false;
  return RefreshToken.isActive(saved.replaced_by, client);
}

function cookieOptions(expiresAt) {
  return {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/api/auth",
    expires: expiresAt,
  };
}

function sendSession(res, statusCode, user, refresh) {
  res.cookie(REFRESH_COOKIE, refresh.token, cookieOptions(refresh.expiresAt));
  res.status(statusCode).json({ accessToken: createAccessToken(user), user });
}

async function register(req, res) {
  const name = cleanText(req.body?.name);
  const email = cleanText(req.body?.email).toLowerCase();
  const password = String(req.body?.password || "");

  const errors = [];
  if (!name) errors.push({ field: "name", message: "Name is required" });
  if (name.length > 100) errors.push({ field: "name", message: "Name is too long" });
  if (!EMAIL_PATTERN.test(email)) errors.push({ field: "email", message: "Enter a valid email" });
  if (password.length < 8 || !/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    errors.push({ field: "password", message: "Password needs at least 8 characters with a letter and a number" });
  }
  if (password.length > 72) errors.push({ field: "password", message: "Password is too long" });

  if (errors.length > 0) {
    throw new AppError("Please fix the highlighted fields", 400, errors);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const { user, refresh } = await withTransaction(async (client) => {
    const newUser = await User.create({ name, email, passwordHash, role: "admin" }, client);
    const newRefresh = await createRefreshToken(newUser.id, client);
    return { user: newUser, refresh: newRefresh };
  });

  sendSession(res, 201, user, refresh);
}

async function login(req, res) {
  const email = cleanText(req.body?.email).toLowerCase();
  const password = String(req.body?.password || "");

  // same message for wrong email and wrong password, so nobody can guess which emails exist
  const user = email ? await User.findByEmail(email) : null;
  const passwordMatches = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!passwordMatches) {
    throw new AppError("Invalid email or password", 401);
  }

  const { password_hash, ...safeUser } = user;
  const refresh = await createRefreshToken(safeUser.id, pool);

  // clean up old tokens in the background, no need to wait for it
  RefreshToken.deleteExpired().catch(() => {});

  sendSession(res, 200, safeUser, refresh);
}

async function refresh(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (!token) {
    throw new AppError("Please log in to continue", 401);
  }

  const result = await withTransaction(async (client) => {
    const saved = await RefreshToken.findByHashForUpdate(hashToken(token), client);

    if (!saved || saved.expires_at < new Date()) {
      return { error: "Your session has expired, please log in again" };
    }

    if (saved.revoked_at) {
      if (await isHarmlessRace(saved, client)) {
        const newRefresh = await createRefreshToken(saved.user_id, client);
        return { userId: saved.user_id, refresh: newRefresh };
      }

      // an old token showing up later means it may have been stolen, so log the user out everywhere
      await RefreshToken.revokeAllForUser(saved.user_id, client);
      return { error: "Your session is no longer valid, please log in again" };
    }

    const newRefresh = await createRefreshToken(saved.user_id, client);
    await RefreshToken.markReplaced(saved.id, newRefresh.id, client);
    return { userId: saved.user_id, refresh: newRefresh };
  });

  if (result.error) {
    res.clearCookie(REFRESH_COOKIE, cookieOptions());
    throw new AppError(result.error, 401);
  }

  const user = await User.findById(result.userId);
  if (!user) {
    throw new AppError("Your account no longer exists", 401);
  }

  sendSession(res, 200, user, result.refresh);
}

async function logout(req, res) {
  const token = req.cookies?.[REFRESH_COOKIE];
  if (token) {
    await RefreshToken.revokeByHash(hashToken(token));
  }
  res.clearCookie(REFRESH_COOKIE, cookieOptions());
  res.json({ message: "Logged out" });
}

async function me(req, res) {
  res.json({ user: req.user });
}

module.exports = { register, login, refresh, logout, me };
