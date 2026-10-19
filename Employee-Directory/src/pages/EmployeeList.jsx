// main page - employee list with search, filter, sort and paging
import { useCallback, useEffect, useState } from "react";
import SearchBar from "../components/SearchBar.jsx";
import EmployeeTable from "../components/EmployeeTable.jsx";
import Pagination from "../components/Pagination.jsx";
import ConfirmDialog from "../components/ConfirmDialog.jsx";
import EmployeeFormModal from "../components/EmployeeFormModal.jsx";
import EmployeeDetailsModal from "../components/EmployeeDetailsModal.jsx";
import { PlusIcon } from "../components/Icons.jsx";
import {
  createEmployee,
  deleteEmployee,
  getEmployees,
  getErrorMessage,
  updateEmployee,
} from "../services/employeeService.js";
import { DEPARTMENTS } from "../utils/constants.js";
import { useAuth } from "../hooks/useAuth.js";
import { useToast } from "../hooks/useToast.js";

function EmployeeList() {
  const { isAdmin } = useAuth();
  const showToast = useToast();

  const [employees, setEmployees] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [searchText, setSearchText] = useState("");
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [order, setOrder] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [employeeToView, setEmployeeToView] = useState(null);
  const [employeeToEdit, setEmployeeToEdit] = useState(null);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  // wait until the user stops typing before searching, otherwise we'd hit the api on every key
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchText.trim());
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchText]);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const result = await getEmployees({ page, limit, search, department, sortBy, order });
      setEmployees(result.data);
      setTotal(result.pagination.total);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, department, sortBy, order]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  function handleSort(field) {
    if (sortBy === field) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setOrder("asc");
    }
    setPage(1);
  }

  function openAddForm() {
    setEmployeeToEdit(null);
    setFormOpen(true);
  }

  const closeDetails = useCallback(() => setEmployeeToView(null), []);

  function openEditForm(employee) {
    setEmployeeToView(null);
    setEmployeeToEdit(employee);
    setFormOpen(true);
  }

  const closeForm = useCallback(() => {
    setFormOpen(false);
    setEmployeeToEdit(null);
  }, []);

  async function handleSave(values) {
    if (employeeToEdit) {
      await updateEmployee(employeeToEdit.id, values);
      showToast(`${values.first_name}'s details were updated`);
    } else {
      await createEmployee(values);
      showToast(`${values.first_name} was added successfully`);
    }
    closeForm();
    loadEmployees();
  }

  async function handleConfirmDelete() {
    setDeleting(true);
    try {
      await deleteEmployee(employeeToDelete.id);
      showToast(`${employeeToDelete.first_name} ${employeeToDelete.last_name} was deleted`);
      setEmployeeToDelete(null);

      if (employees.length === 1 && page > 1) {
        setPage(page - 1);
      } else {
        loadEmployees();
      }
    } catch (err) {
      showToast(getErrorMessage(err), "error");
      setEmployeeToDelete(null);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Employees</h1>
          <p className="text-sm text-slate-500">Everyone in the company, in one place.</p>
        </div>
        {isAdmin && (
          <button
            type="button"
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700"
          >
            <PlusIcon /> Add Employee
          </button>
        )}
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row">
          <SearchBar value={searchText} onChange={setSearchText} />
          <select
            value={department}
            onChange={(event) => {
              setDepartment(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500 sm:w-52"
          >
            <option value="">All departments</option>
            {DEPARTMENTS.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </div>

        {error && <p className="m-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

        {loading && employees.length === 0 && (
          <p className="p-10 text-center text-sm text-slate-500">Loading employees...</p>
        )}

        {!loading && !error && employees.length === 0 && (
          <div className="p-10 text-center">
            <p className="font-medium text-slate-700">No employees found</p>
            <p className="mt-1 text-sm text-slate-500">Try a different search or add a new employee.</p>
          </div>
        )}

        {employees.length > 0 && (
          <div className={loading ? "opacity-50" : ""}>
            <EmployeeTable
              employees={employees}
              sortBy={sortBy}
              order={order}
              onSort={handleSort}
              canEdit={isAdmin}
              onView={setEmployeeToView}
              onEdit={openEditForm}
              onDelete={setEmployeeToDelete}
            />
          </div>
        )}

        <Pagination
          page={page}
          limit={limit}
          total={total}
          onPageChange={setPage}
          onLimitChange={(newLimit) => {
            setLimit(newLimit);
            setPage(1);
          }}
        />
      </div>

      <EmployeeDetailsModal
        employee={employeeToView}
        canEdit={isAdmin}
        onClose={closeDetails}
        onEdit={openEditForm}
      />

      <EmployeeFormModal open={formOpen} employee={employeeToEdit} onClose={closeForm} onSave={handleSave} />

      <ConfirmDialog
        open={Boolean(employeeToDelete)}
        title="Delete employee?"
        message={
          employeeToDelete
            ? `${employeeToDelete.first_name} ${employeeToDelete.last_name} will be removed permanently.`
            : ""
        }
        loading={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </section>
  );
}

export default EmployeeList;
