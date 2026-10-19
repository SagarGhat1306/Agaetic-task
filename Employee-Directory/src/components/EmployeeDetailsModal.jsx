// read only view of one employee
import Modal from "./Modal.jsx";
import { PencilIcon } from "./Icons.jsx";
import { formatDate, formatSalary, getInitials } from "../utils/constants.js";

function Detail({ label, value }) {
  return (
    <div>
      <dt className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 break-words text-sm text-slate-900">{value || "—"}</dd>
    </div>
  );
}

function EmployeeDetailsModal({ employee, canEdit, onClose, onEdit }) {
  return (
    <Modal open={Boolean(employee)} title="Employee Details" onClose={onClose} maxWidth="max-w-lg">
      {employee && (
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-lg font-semibold text-indigo-700">
              {getInitials(employee)}
            </span>
            <div className="min-w-0">
              <p className="text-lg font-semibold text-slate-900">
                {employee.first_name} {employee.last_name}
              </p>
              <p className="text-sm text-slate-600">
                {employee.job_title} · {employee.role}
              </p>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Detail label="Email" value={<a href={`mailto:${employee.email}`} className="text-indigo-600 hover:underline">{employee.email}</a>} />
            <Detail label="Phone" value={employee.phone} />
            <Detail label="Department" value={employee.department} />
            <Detail label="Role" value={employee.role} />
            <Detail label="Salary" value={formatSalary(employee.salary)} />
            <Detail label="Hire date" value={formatDate(employee.hire_date)} />
          </dl>

          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Close
            </button>
            {canEdit && (
              <button
                type="button"
                onClick={() => onEdit(employee)}
                className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
              >
                <PencilIcon /> Edit
              </button>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}

export default EmployeeDetailsModal;
