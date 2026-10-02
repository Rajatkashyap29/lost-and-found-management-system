import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { authService, getErrorMessage } from "../api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  // Fetch user profile if token is present
  const refreshProfile = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return null;
    }

    try {
      const res = await authService.getProfile();
      if (res.data && res.data.user) {
        setUser(res.data.user);
        return res.data.user;
      }
    } catch (err) {
      console.warn("Error fetching profile, removing invalid token:", err);
      localStorage.removeItem("token");
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
    return null;
  }, []);

  useEffect(() => {
    refreshProfile();
  }, [token, refreshProfile]);

  const login = async (email, password) => {
    try {
      const res = await authService.login({ email, password });
      const accessToken = res.data.access_token;
      localStorage.setItem("token", accessToken);
      setToken(accessToken);

      // Fetch user profile immediately
      const profileRes = await authService.getProfile();
      if (profileRes.data && profileRes.data.user) {
        setUser(profileRes.data.user);
      }

      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Login failed") };
    }
  };

  const register = async (userData) => {
    try {
      const res = await authService.register(userData);
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Registration failed") };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const updateProfile = async (updateData) => {
    try {
      const res = await authService.updateProfile(updateData);
      if (res.data && res.data.user) {
        setUser(res.data.user);
      }
      return { success: true, data: res.data };
    } catch (err) {
      return { success: false, error: getErrorMessage(err, "Update failed") };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token && !!user,
        isAdmin: user?.role === "ADMIN",
        login,
        register,
        logout,
        refreshProfile,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
