import React from "react";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Home from "./pages/user/Home";
import ProtectedRoute from "./routes/ProtectedRoute";
import Dashboard from "./pages/admin/Dashboard";
import StoreDetails from "./pages/user/StoreDetails";
import OwnerDashboard from "./pages/owner/OwnerDashboard";
import ChangePassword from "./pages/auth/ChangePassword";

const App = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Normal User Stores List */}
      <Route
        path="/home"
        element={
          <ProtectedRoute allowedRoles={["user"]}>
            <Home />
          </ProtectedRoute>
        }
      />

      {/* Store Details Page (Accessible by both Users and Admins) */}
      <Route
        path="/stores/:id"
        element={
          <ProtectedRoute allowedRoles={["user", "admin"]}>
            <StoreDetails />
          </ProtectedRoute>
        }
      />

      {/* Admin Dashboard */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* Store Owner Dashboard */}
      <Route
        path="/owner/dashboard"
        element={
          <ProtectedRoute allowedRoles={["owner"]}>
            <OwnerDashboard />
          </ProtectedRoute>
        }
      />

      {/* Change Password Page (Accessible by all logged in users) */}
      <Route
        path="/change-password"
        element={
          <ProtectedRoute allowedRoles={["user", "owner", "admin"]}>
            <ChangePassword />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default App;

