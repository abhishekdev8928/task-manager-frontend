// ✅ auth.jsx (Auth Context & Provider)
import React, { createContext, useContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
    console.log("✅ AuthProvider loaded, token:", storedToken);
  }, []);

  const storeTokenInLS = (serverToken) => {
    console.log("🔐 Storing token in LS:", serverToken);
    localStorage.setItem("token", serverToken);
    setToken(serverToken);
  };

  const LogoutUser = async () => {
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("otpemail");
    localStorage.removeItem("email");
    localStorage.removeItem("authUser");
      localStorage.removeItem("adminid");
     localStorage.removeItem("role");
          localStorage.removeItem("adminname");
    try {
      await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/auth/logout`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const isLoggedIn = !!token;

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        storeTokenInLS,
        LogoutUser,
        user,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
