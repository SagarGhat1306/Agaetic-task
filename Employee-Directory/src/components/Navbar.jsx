// top navbar
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";
import { GroupIcon } from "./Icons.jsx";

function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const showToast = useToast();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    showToast("You have been logged out");
    navigate("/login", { replace: true });
  }

  const linkClass = ({ isActive }) =>
    `rounded-md px-3 py-2 text-sm font-medium ${
      isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
    }`;

  return (
    <header className="border-b border-slate-200 bg-white">
      <nav className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="flex items-center gap-4">
          <Link to="/" className="flex items-center gap-2 text-lg font-semibold text-slate-900">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <GroupIcon className="h-5 w-5" />
            </span>
            <span className="hidden md:inline">Employee Directory</span>
          </Link>

          {user && (
            <div className="flex items-center gap-1">
              <NavLink to="/" end className={linkClass}>
                Employees
              </NavLink>
              {isAdmin && (
                <NavLink to="/users" className={linkClass}>
                  Users
                </NavLink>
              )}
            </div>
          )}
        </div>

        {user && (
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium text-slate-900">{user.name}</p>
              <p className="text-xs capitalize text-slate-500">{user.role}</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 px-4 text-sm font-medium leading-none text-slate-700 hover:bg-slate-50"
            >
              Log out
            </button>
          </div>
        )}
      </nav>
    </header>
  );
}

export default Navbar;
