// creates the tables. run: npm run db:setup
const { pool } = require("../config/db");
const User = require("../models/userModel");
const RefreshToken = require("../models/refreshTokenModel");
const Employee = require("../models/employeeModel");

async function setup() {
  try {
    await User.createTable();
    await RefreshToken.createTable();
    await Employee.createTable();
    console.log("Database tables are ready");
  } catch (error) {
    console.error("Database setup failed:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

setup();
