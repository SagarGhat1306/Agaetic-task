// rate limits (per IP)
const rateLimit = require("express-rate-limit");

function createLimiter(minutes, limit, message) {
  return rateLimit({
    windowMs: minutes * 60 * 1000,
    limit,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: { message },
  });
}

const apiLimiter = createLimiter(15, 300, "Too many requests, please slow down and try again shortly");
const loginLimiter = createLimiter(15, 10, "Too many login attempts, please try again in 15 minutes");
const refreshLimiter = createLimiter(15, 150, "Too many session refreshes, please try again shortly");

module.exports = { apiLimiter, loginLimiter, refreshLimiter };
