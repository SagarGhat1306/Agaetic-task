// table on desktop, cards on mobile
import { formatDate, formatSalary, getInitials } from "../utils/constants.js";
import { EyeIcon, PencilIcon, TrashIcon } from "./Icons.jsx";

function SortableHeader({ label, field, sortBy, order, onSort }) {
  const isActive = sortBy === field;
  const arrow = isActive ? (order === "asc" ? "▲" : "▼") : "↕";

  return (
    <th className="px-4 py-3 text-left font-semibold">
      <button
        type="button"
        onClick={() => onSort(field)}
        className={`flex items-center gap-1 hover:text-slate-900 ${isActive ? "text-slate-900" : ""}`}
      >
        {label}
        <span className={`text-xs ${isActive ? "text-indigo-600" : "text-slate-300"}`}>{arrow}</span>
      </button>
    </th>
  );
}

const ROLE_COLORS = {
  Intern: "bg-amber-50 text-amber-700",
  Employee: "bg-sky-50 text-sky-700",
  "Team Lead": "bg-violet-50 text-violet-700",
  Manager: "bg-emerald-50 text-emerald-700",
};

function RoleBadge({ role }) {
  return (
    <span className={`inline-block whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[role] || "bg-slate-100 text-slate-700"}`}>
      {role}
    </span>
  );
}

function Avatar({ employee }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-sm font-semibold text-indigo-700">
      {getInitials(employee)}
    </span>
  );
}

function EmployeeTable({ employees, sortBy, order, onSort, canEdit, onView, onEdit, onDelete }) {
  const sortProps = { sortBy, order, onSort };

  return (
    <>
      <div className="hidden overflow-x-auto md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-slate-600">
            <tr>
              <SortableHeader label="Employee" field="name" {...sortProps} />
              <th className="px-4 py-3 text-left font-semibold">Job Title</th>
              <th className="px-4 py-3 text-left font-semibold">Role</th>
              <SortableHeader label="Department" field="department" {...sortProps} />
              <th className="px-4 py-3 text-left font-semibold">Phone</th>
              <th className="px-4 py-3 text-right font-semibold">Salary</th>
              <SortableHeader label="Hire Date" field="hireDate" {...sortProps} />
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {employees.map((employee) => (
              <tr key={employee.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <Avatar employee={employee} />
                    <div>
                      <p className="font-medium text-slate-900">
                        {employee.first_name} {employee.last_name}
                      </p>
                      <p className="text-slate-500">{employee.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{employee.job_title}</td>
                <td className="px-4 py-3">
                  <RoleBadge role={employee.role} />
                </td>
                <td className="px-4 py-3">
                  <span className="inline-block whitespace-nowrap rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                    {employee.department}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-600">{employee.phone || "—"}</td>
                <td className="px-4 py-3 text-right tabular-nums">{formatSalary(employee.salary)}</td>
                <td className="px-4 py-3 text-slate-600">{formatDate(employee.hire_date)}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      onClick={() => onView(employee)}
                      title="View"
                      aria-label={`View ${employee.first_name}`}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                    >
                      <EyeIcon />
                    </button>
                    {canEdit && (
                      <>
                        <button
                          type="button"
                          onClick={() => onEdit(employee)}
                          title="Edit"
                          aria-label={`Edit ${employee.first_name}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                        >
                          <PencilIcon />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDelete(employee)}
                          title="Delete"
                          aria-label={`Delete ${employee.first_name}`}
                          className="rounded-lg p-2 text-slate-500 hover:bg-red-50 hover:text-red-600"
                        >
                          <TrashIcon />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ul className="divide-y divide-slate-100 md:hidden">
        {employees.map((employee) => (
          <li key={employee.id} className="p-4">
            <div className="flex items-start gap-3">
              <Avatar employee={employee} />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-medium text-slate-900">
                    {employee.first_name} {employee.last_name}
                  </p>
                  <RoleBadge role={employee.role} />
                </div>
                <p className="text-sm text-slate-600">{employee.job_title}</p>
                <p className="truncate text-sm text-slate-500">{employee.email}</p>

                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                  <span className="whitespace-nowrap rounded-full bg-slate-100 px-2 py-0.5 font-medium text-slate-700">
                    {employee.department}
                  </span>
                  {employee.phone && <span>{employee.phone}</span>}
                  <span>Joined {formatDate(employee.hire_date)}</span>
                </div>
              </div>
            </div>

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => onView(employee)}
                className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700"
              >
                <EyeIcon /> View
              </button>
              {canEdit && (
                <>
                  <button
                    type="button"
                    onClick={() => onEdit(employee)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 py-2 text-sm font-medium text-slate-700"
                  >
                    <PencilIcon /> Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(employee)}
                    className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-200 py-2 text-sm font-medium text-red-600"
                  >
                    <TrashIcon /> Delete
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default EmployeeTable;
