// shows the generated password once so the admin can copy it
import { useState } from "react";
import Modal from "./Modal.jsx";

function CredentialsModal({ credentials, onClose }) {
  const [copied, setCopied] = useState(false);

  async function copyDetails() {
    const text = `Email: ${credentials.email}\nPassword: ${credentials.password}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <Modal open={Boolean(credentials)} title="Login Details" onClose={onClose} maxWidth="max-w-md">
      {credentials && (
        <div className="space-y-4 p-4 sm:p-6">
          {credentials.emailSent ? (
            <p className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-800">
              These details were emailed to <b>{credentials.email}</b>.
            </p>
          ) : (
            <p className="rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
              Email is not set up, so nothing was sent. Copy these details and share them with {credentials.name} yourself.
            </p>
          )}

          <dl className="space-y-3 rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Email</dt>
              <dd className="break-all text-sm text-slate-900">{credentials.email}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">Password</dt>
              <dd className="font-mono text-lg tracking-wider text-slate-900">{credentials.password}</dd>
            </div>
          </dl>

          <p className="text-xs text-slate-500">This password is shown only once. It is not stored anywhere in plain text.</p>

          <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Done
            </button>
            <button
              type="button"
              onClick={copyDetails}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
            >
              {copied ? "Copied!" : "Copy details"}
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
}

export default CredentialsModal;
