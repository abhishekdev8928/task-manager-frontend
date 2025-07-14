import React from "react";
import { useAuth } from "./auth";
import { Navigate } from "react-router-dom";

const AuthGuard = ({ children }) => {
  const { isLoggedIn } = useAuth();

  const token = localStorage.getItem("token");

  // ⛔ Not authenticated? Redirect immediately before rendering anything
  if (!token || !isLoggedIn) {
    console.warn("⛔ AuthGuard: No token or user not logged in. Redirecting...");
    return <Navigate to="/login" replace />;
  }

  // ✅ Authenticated
  return children;
};

export default AuthGuard;
