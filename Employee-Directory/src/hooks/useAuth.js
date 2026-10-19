// so we don't have to import useContext + AuthContext everywhere
import { useContext } from "react";
import { AuthContext } from "../context/appContexts.js";

export function useAuth() {
  return useContext(AuthContext);
}
