// sign up page - anyone who signs up here becomes an admin
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthLayout, { AuthInput } from "../components/AuthLayout.jsx";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { getErrorMessage } from "../services/api.js";

function validate(values) {
  const errors = {};
  if (!values.name.trim()) errors.name = "Name is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email";
  if (values.password.length < 8 || !/[A-Za-z]/.test(values.password) || !/[0-9]/.test(values.password)) {
    errors.password = "At least 8 characters with a letter and a number";
  }
  if (values.confirmPassword !== values.password) errors.confirmPassword = "Passwords don't match";
  return errors;
}

function Register() {
  const { register } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  const [values, setValues] = useState({ name: "", email: "", password: "", confirmPassword: "" });
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
      const user = await register(values.name.trim(), values.email.trim(), values.password);
      showToast(`Welcome, ${user.name}! Your admin account is ready.`);
      navigate("/", { replace: true });
    } catch (err) {
      const fieldErrors = {};
      err.response?.data?.errors?.forEach((item) => {
        fieldErrors[item.field] = item.message;
      });
      setErrors(fieldErrors);
      setServerError(getErrorMessage(err));
      setSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Sign up to access the employee directory."
      footer={
        <>
          Already have an account?{" "}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {serverError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}

        <AuthInput label="Full name" name="name" autoComplete="name" placeholder="e.g. Rahul Sharma" value={values.name} onChange={handleChange} error={errors.name} />
        <AuthInput label="Email" name="email" type="email" autoComplete="email" placeholder="you@company.com" value={values.email} onChange={handleChange} error={errors.email} />
        <AuthInput label="Password" name="password" type="password" autoComplete="new-password" placeholder="At least 8 characters" value={values.password} onChange={handleChange} error={errors.password} />
        <AuthInput label="Confirm password" name="confirmPassword" type="password" autoComplete="new-password" placeholder="Type it again" value={values.confirmPassword} onChange={handleChange} error={errors.confirmPassword} />

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
        >
          {submitting ? "Creating account..." : "Create account"}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Register;
