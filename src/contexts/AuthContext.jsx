import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { decodeToken, getStoredToken } from "../utils/auth";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getStoredToken();
    if (token) {
      setUser(decodeToken(token));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const token = response.data?.token;
      const userData = response.data?.user ?? decodeToken(token);
      if (!token) {
        throw new Error("Login response did not include a token");
      }
      localStorage.setItem("token", token);
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message || error.message || "Login failed",
      };
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error(error);
    } finally {
      localStorage.removeItem("token");
      setUser(null);
    }
  };

  const value = useMemo(
    () => ({ user, loading, login, logout }),
    [user, loading],
  );

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
