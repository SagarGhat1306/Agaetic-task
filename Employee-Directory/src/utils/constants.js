// lists and small helpers used in a few places
export const DEPARTMENTS = [
  "Engineering",
  "Finance",
  "Human Resources",
  "Marketing",
  "Operations",
  "Sales",
];

export const ROLES = ["Intern", "Employee", "Team Lead", "Manager"];

export const ROWS_PER_PAGE_OPTIONS = [5, 10, 25];

export function formatDate(dateText) {
  if (!dateText) return "—";
  const [year, month, day] = dateText.split("-");
  return new Date(year, month - 1, day).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function formatSalary(amount) {
  if (amount === null || amount === undefined) return "—";
  return amount.toLocaleString("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  });
}

export function getInitials(employee) {
  return `${employee.first_name[0] || ""}${employee.last_name[0] || ""}`.toUpperCase();
}
