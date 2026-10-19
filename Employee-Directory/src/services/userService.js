// admin only - manage viewer logins
import api from "./api.js";

export async function getUsers() {
  const response = await api.get("/users");
  return response.data;
}

export async function createViewer(name, email) {
  const response = await api.post("/users", { name, email });
  return response.data;
}

export async function resetUserPassword(id) {
  const response = await api.post(`/users/${id}/reset-password`);
  return response.data;
}

export async function deleteUser(id) {
  await api.delete(`/users/${id}`);
}
