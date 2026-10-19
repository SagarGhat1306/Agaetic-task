// keeps the logged in user. on page load we try the refresh cookie so people stay logged in
import { useEffect, useState } from "react";
import { AuthContext } from "./appContexts.js";
import { refreshAccessToken, setAccessToken, setSessionExpiredHandler } from "../services/api.js";
import * as authService from "../services/authService.js";

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setSessionExpiredHandler(() => setUser(null));

    refreshAccessToken()
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  async function login(email, password) {
    const data = await authService.login(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }

  async function register(name, email, password) {
    const data = await authService.register(name, email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    return data.user;
  }

  async function logout() {
    try {
      await authService.logout();
    } finally {
      setAccessToken(null);
      setUser(null);
    }
  }

  const value = {
    user,
    loading,
    isAdmin: user?.role === "admin",
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
