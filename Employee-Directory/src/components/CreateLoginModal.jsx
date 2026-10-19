// admin enters a name + email, the server makes the password
import { useState } from "react";
import Modal from "./Modal.jsx";
import { AuthInput } from "./AuthLayout.jsx";
import { getErrorMessage } from "../services/api.js";

function CreateLoginModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleClose() {
    setName("");
    setEmail("");
    setErrors({});
    setServerError("");
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const formErrors = {};
    if (!name.trim()) formErrors.name = "Name is required";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) formErrors.email = "Enter a valid email";
    setErrors(formErrors);
    if (Object.keys(formErrors).length > 0) return;

    setSubmitting(true);
    setServerError("");
    try {
      await onCreate(name.trim(), email.trim());
      setName("");
      setEmail("");
    } catch (err) {
      setServerError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Modal open={open} title="Create Employee Login" subtitle="They will be able to view the directory only." onClose={handleClose} maxWidth="max-w-md">
      <form onSubmit={handleSubmit} noValidate className="space-y-4 p-4 sm:p-6">
        {serverError && <p className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{serverError}</p>}

        <AuthInput label="Full name" placeholder="e.g. Priya Patel" value={name} onChange={(e) => setName(e.target.value)} error={errors.name} />
        <AuthInput label="Email" type="email" placeholder="priya.patel@company.com" value={email} onChange={(e) => setEmail(e.target.value)} error={errors.email} />

        <p className="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-600">
          A secure password is generated automatically and sent to this email.
        </p>

        <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-60"
          >
            {submitting ? "Creating..." : "Create Login"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export default CreateLoginModal;
