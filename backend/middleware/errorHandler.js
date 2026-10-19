// central error handler. 23505 is postgres' unique violation (duplicate email / phone)
const DUPLICATE_MESSAGES = {
  users_email_key: { field: "email", message: "An account with this email already exists" },
  idx_employees_owner_email: { field: "email", message: "An employee with this email already exists" },
  idx_employees_owner_phone: { field: "phone", message: "An employee with this phone number already exists" },
};

function errorHandler(error, req, res, next) {
  if (error.code === "23505") {
    const duplicate = DUPLICATE_MESSAGES[error.constraint] || { field: "email", message: "This already exists" };
    return res.status(409).json({ message: duplicate.message, errors: [duplicate] });
  }

  const statusCode = error.statusCode || error.status || 500;

  if (statusCode === 500) {
    console.error(error);
    return res.status(500).json({ message: "Something went wrong on the server" });
  }

  res.status(statusCode).json({
    message: error.message,
    errors: error.errors,
  });
}

module.exports = errorHandler;
