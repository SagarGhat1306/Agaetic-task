// add / edit employee form
import { useState } from "react";
import { DEPARTMENTS, ROLES } from "../utils/constants.js";
import { getErrorMessage } from "../services/employeeService.js";

const EMPTY_EMPLOYEE = {
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  department: "",
  job_title: "",
  role: "Employee",
  salary: "",
  hire_date: "",
};

// inputs need strings, so turn nulls / numbers from the api into strings
function toFormValues(employee) {
  if (!employee) return EMPTY_EMPLOYEE;

  return {
    first_name: employee.first_name,
    last_name: employee.last_name,
    email: employee.email,
    phone: employee.phone || "",
    department: employee.department,
    job_title: employee.job_title,
    role: employee.role || "Employee",
    salary: employee.salary === null ? "" : String(employee.salary),
    hire_date: employee.hire_date || "",
  };
}

function validate(values) {
  const errors = {};
  if (!values.first_name.trim()) errors.first_name = "First name is required";
  if (!values.last_name.trim()) errors.last_name = "Last name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email";
  if (values.phone.trim() && !/^\+?[0-9]{7,15}$/.test(values.phone.replace(/[\s()-]/g, ""))) {
    errors.phone = "Enter a valid phone number";
  }
  if (!values.department) errors.department = "Choose a department";
  if (!values.job_title.trim()) errors.job_title = "Job title is required";
  if (values.salary !== "" && Number(values.salary) < 0) errors.salary = "Salary can't be negative";
  return errors;
}

function Field({ label, error, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

function EmployeeForm({ initialValues, submitLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState(toFormValues(initialValues));
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
    setErrors({ ...errors, [name]: "" });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formErrors = validate(values);
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");

    try {
      await onSubmit({
        ...values,
        phone: values.phone.trim() || null,
        salary: values.salary === "" ? null : Number(values.salary),
        hire_date: values.hire_date || null,
      });
    } catch (error) {
      const fieldErrors = {};
      error.response?.data?.errors?.forEach((item) => {
        fieldErrors[item.field] = item.message;
      });
      setErrors(fieldErrors);
      setServerError(getErrorMessage(error));
      setSubmitting(false);
    }
  }

  const inputClass = (name) =>
    `w-full rounded-lg border bg-white px-3 py-2 text-sm outline-none placeholder:text-slate-400 focus:ring-2 ${
      errors[name]
        ? "border-red-400 focus:ring-red-100"
        : "border-slate-300 focus:border-indigo-500 focus:ring-indigo-100"
    }`;

  return (
    <form onSubmit={handleSubmit} noValidate className="p-4 sm:p-6">
      {serverError && (
        <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name *" error={errors.first_name}>
          <input name="first_name" placeholder="e.g. Rahul" value={values.first_name} onChange={handleChange} className={inputClass("first_name")} />
        </Field>

        <Field label="Last name *" error={errors.last_name}>
          <input name="last_name" placeholder="e.g. Sharma" value={values.last_name} onChange={handleChange} className={inputClass("last_name")} />
        </Field>

        <Field label="Email *" error={errors.email}>
          <input type="email" name="email" placeholder="e.g. rahul.sharma@company.com" value={values.email} onChange={handleChange} className={inputClass("email")} />
        </Field>

        <Field label="Phone" error={errors.phone}>
          <input type="tel" name="phone" placeholder="e.g. 9876543210" value={values.phone} onChange={handleChange} className={inputClass("phone")} />
        </Field>

        <Field label="Department *" error={errors.department}>
          <select name="department" value={values.department} onChange={handleChange} className={inputClass("department")}>
            <option value="">Select department</option>
            {DEPARTMENTS.map((department) => (
              <option key={department} value={department}>
                {department}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Job title *" error={errors.job_title}>
          <input name="job_title" placeholder="e.g. Frontend Developer" value={values.job_title} onChange={handleChange} className={inputClass("job_title")} />
        </Field>

        <Field label="Role *" error={errors.role}>
          <select name="role" value={values.role} onChange={handleChange} className={inputClass("role")}>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Salary (₹ per year)" error={errors.salary}>
          <input type="number" min="0" name="salary" placeholder="e.g. 600000" value={values.salary} onChange={handleChange} className={inputClass("salary")} />
        </Field>

        <Field label="Hire date" error={errors.hire_date}>
          <input type="date" name="hire_date" value={values.hire_date} onChange={handleChange} className={inputClass("hire_date")} />
        </Field>
      </div>

      <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}

export default EmployeeForm;
