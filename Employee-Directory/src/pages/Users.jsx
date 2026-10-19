// admin page to create and manage viewer logins
import { useCallback, useEffect, useState } from "react";
import CreateLoginModal from "../components/CreateLoginModal.jsx";
import CredentialsModal from "../components/CredentialsModal.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import { KeyIcon, PlusIcon, TrashIcon } from "../components/Icons.jsx";
import { createViewer, deleteUser, getUsers, resetUserPassword } from "../services/userService.js";
import { getErrorMessage } from "../services/api.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { formatDate } from "../utils/constants.js";

const ROLE_STYLES = {
  admin: "bg-indigo-50 text-indigo-700",
  viewer: "bg-slate-100 text-slate-700",
};

function Users() {
  const { user: currentUser } = useAuth();
  const showToast = useToast();

  const [users, setUsers] = useState([]);
  const [emailEnabled, setEmailEnabled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [credentials, setCredentials] = useState(null);
  const [userToReset, setUserToReset] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [working, setWorking] = useState(false);

  const loadUsers = useCallback(async () => {
    try {
      const result = await getUsers();
      setUsers(result.data);
      setEmailEnabled(result.emailEnabled);
      setError("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const closeCreate = useCallback(() => setCreateOpen(false), []);
  const closeCredentials = useCallback(() => setCredentials(null), []);

  async function handleCreate(name, email) {
    const result = await createViewer(name, email);
    setCreateOpen(false);
    setCredentials({ name, email: result.data.email, password: result.password, emailSent: result.emailSent });
    showToast(`Login created for ${name}`);
    loadUsers();
  }

  async function handleReset() {
    setWorking(true);
    try {
      const result = await resetUserPassword(userToReset.id);
      setCredentials({ name: userToReset.name, email: userToReset.email, password: result.password, emailSent: result.emailSent });
      showToast(`New password created for ${userToReset.name}`);
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUserToReset(null);
      setWorking(false);
    }
  }

  async function handleDelete() {
    setWorking(true);
    try {
      await deleteUser(userToDelete.id);
      showToast(`${userToDelete.name} was deleted`);
      loadUsers();
    } catch (err) {
      showToast(getErrorMessage(err), "error");
    } finally {
      setUserToDelete(null);
      setWorking(false);
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Logins</h1>
          <p className="text-sm text-slate-500">Create logins for employees. They can view the directory but not change it.</p>
        </div>
        <button
          type="button"
          onClick={() => setCreateOpen(true)}
          className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
        >
          <PlusIcon /> Create Login
        </button>
      </div>

      {!loading && !emailEnabled && (
        <p className="mb-4 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800">
          Email sending is not set up yet. New passwords will be shown on screen for you to share.
        </p>
      )}

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        {error && <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}
        {loading && <p className="p-10 text-center text-sm text-slate-500">Loading users...</p>}

        {!loading && users.length > 0 && (
          <ul className="divide-y divide-slate-100">
            {users.map((user) => {
              const isMe = user.id === currentUser.id;
              return (
                <li key={user.id} className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-medium text-slate-900">{user.name}</p>
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${ROLE_STYLES[user.role]}`}>
                        {user.role}
                      </span>
                      {isMe && <span className="text-xs text-slate-500">(you)</span>}
                    </div>
                    <p className="truncate text-sm text-slate-500">{user.email}</p>
                    <p className="text-xs text-slate-400">Created {formatDate(user.created_at.slice(0, 10))}</p>
                  </div>

                  {!isMe && (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setUserToReset(user)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 sm:flex-none"
                      >
                        <KeyIcon /> Reset password
                      </button>
                      <button
                        type="button"
                        onClick={() => setUserToDelete(user)}
                        title="Delete"
                        aria-label={`Delete ${user.name}`}
                        className="flex items-center justify-center rounded-lg border border-red-200 px-3 py-2 text-red-600 hover:bg-red-50"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>

      <CreateLoginModal open={createOpen} onClose={closeCreate} onCreate={handleCreate} />
      <CredentialsModal credentials={credentials} onClose={closeCredentials} />

      <ConfirmDialog
        open={Boolean(userToReset)}
        title="Reset password?"
        message={userToReset ? `${userToReset.name} will get a new password and be logged out everywhere.` : ""}
        confirmLabel="Reset"
        loading={working}
        onConfirm={handleReset}
        onCancel={() => setUserToReset(null)}
      />

      <ConfirmDialog
        open={Boolean(userToDelete)}
        title="Delete user?"
        message={userToDelete ? `${userToDelete.name} will no longer be able to log in.` : ""}
        loading={working}
        onConfirm={handleDelete}
        onCancel={() => setUserToDelete(null)}
      />
    </section>
  );
}

export default Users;
