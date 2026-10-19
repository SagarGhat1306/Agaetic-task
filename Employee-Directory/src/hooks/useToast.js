// usage: showToast("Saved") or showToast("Something went wrong", "error")
import { useContext } from "react";
import { ToastContext } from "../context/appContexts.js";

export function useToast() {
  return useContext(ToastContext);
}
