// employees table + queries. every query filters by owner_id
const { pool } = require("../config/db");

const ROLES = ["Intern", "Employee", "Team Lead", "Manager"];

async function createTable() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS employees (
      id          SERIAL PRIMARY KEY,
      owner_id    INTEGER      REFERENCES users (id) ON DELETE CASCADE,
      first_name  VARCHAR(50)  NOT NULL,
      last_name   VARCHAR(50)  NOT NULL,
      email       VARCHAR(255) NOT NULL,
      phone       VARCHAR(20),
      department  VARCHAR(100) NOT NULL,
      job_title   VARCHAR(100) NOT NULL,
      role        VARCHAR(20)  NOT NULL DEFAULT 'Employee'
                  CHECK (role IN ('Intern', 'Employee', 'Team Lead', 'Manager')),
      salary      NUMERIC(12, 2) CHECK (salary >= 0),
      hire_date   DATE,
      created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
      updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );

    ALTER TABLE employees ADD COLUMN IF NOT EXISTS role VARCHAR(20) NOT NULL DEFAULT 'Employee'
      CHECK (role IN ('Intern', 'Employee', 'Team Lead', 'Manager'));
    ALTER TABLE employees ADD COLUMN IF NOT EXISTS owner_id INTEGER REFERENCES users (id) ON DELETE CASCADE;
    ALTER TABLE employees DROP CONSTRAINT IF EXISTS employees_email_key;

    DROP INDEX IF EXISTS idx_employees_department;
    DROP INDEX IF EXISTS idx_employees_name;
    DROP INDEX IF EXISTS idx_employees_hire_date;
    DROP INDEX IF EXISTS idx_employees_created_at;

    CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_owner_email ON employees (owner_id, email);
    CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_owner_phone ON employees (owner_id, phone) WHERE phone IS NOT NULL;
    CREATE INDEX IF NOT EXISTS idx_employees_owner_created_at ON employees (owner_id, created_at);
    CREATE INDEX IF NOT EXISTS idx_employees_owner_department ON employees (owner_id, department);
    CREATE INDEX IF NOT EXISTS idx_employees_owner_name ON employees (owner_id, first_name, last_name);
    CREATE INDEX IF NOT EXISTS idx_employees_owner_hire_date ON employees (owner_id, hire_date);
  `);
}

const SORT_COLUMNS = {
  name: "first_name",
  department: "department",
  hireDate: "hire_date",
  createdAt: "created_at",
};

function buildWhere(ownerId, search, department) {
  const values = [ownerId];
  const conditions = ["owner_id = $1"];

  if (search) {
    values.push(`%${search}%`);
    const n = values.length;
    conditions.push(
      `(first_name ILIKE $${n} OR last_name ILIKE $${n} OR email ILIKE $${n} OR job_title ILIKE $${n})`
    );
  }

  if (department) {
    values.push(department);
    conditions.push(`department = $${values.length}`);
  }

  return { where: `WHERE ${conditions.join(" AND ")}`, values };
}

async function findAll({ ownerId, search, department, sortBy, order, limit, offset }) {
  const { where, values } = buildWhere(ownerId, search, department);
  const sortColumn = SORT_COLUMNS[sortBy] || "created_at";
  const sortOrder = order === "asc" ? "ASC" : "DESC";

  const countResult = await pool.query(`SELECT COUNT(*) AS total FROM employees ${where}`, values);

  const rowsResult = await pool.query(
    `SELECT * FROM employees ${where}
     ORDER BY ${sortColumn} ${sortOrder}, id ${sortOrder}
     LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
    [...values, limit, offset]
  );

  return {
    employees: rowsResult.rows,
    total: Number(countResult.rows[0].total),
  };
}

async function findById(id, ownerId) {
  const result = await pool.query("SELECT * FROM employees WHERE id = $1 AND owner_id = $2", [id, ownerId]);
  return result.rows[0];
}

async function findByIdForUpdate(id, ownerId, client) {
  const result = await client.query(
    "SELECT * FROM employees WHERE id = $1 AND owner_id = $2 FOR UPDATE",
    [id, ownerId]
  );
  return result.rows[0];
}

async function create(employee, ownerId) {
  const result = await pool.query(
    `INSERT INTO employees (owner_id, first_name, last_name, email, phone, department, job_title, role, salary, hire_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
     RETURNING *`,
    [
      ownerId,
      employee.first_name,
      employee.last_name,
      employee.email,
      employee.phone,
      employee.department,
      employee.job_title,
      employee.role,
      employee.salary,
      employee.hire_date,
    ]
  );
  return result.rows[0];
}

async function update(id, ownerId, employee, client) {
  const result = await client.query(
    `UPDATE employees
     SET first_name = $1, last_name = $2, email = $3, phone = $4, department = $5,
         job_title = $6, role = $7, salary = $8, hire_date = $9, updated_at = NOW()
     WHERE id = $10 AND owner_id = $11
     RETURNING *`,
    [
      employee.first_name,
      employee.last_name,
      employee.email,
      employee.phone,
      employee.department,
      employee.job_title,
      employee.role,
      employee.salary,
      employee.hire_date,
      id,
      ownerId,
    ]
  );
  return result.rows[0];
}

async function remove(id, ownerId) {
  const result = await pool.query(
    "DELETE FROM employees WHERE id = $1 AND owner_id = $2 RETURNING id",
    [id, ownerId]
  );
  return result.rows[0];
}

module.exports = { ROLES, createTable, findAll, findById, findByIdForUpdate, create, update, remove };
