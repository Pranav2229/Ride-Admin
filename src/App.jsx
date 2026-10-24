import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import AdminLayout from "./components/Layout/AdminLayout";
import AdminLogin from "./pages/AdminLogin";

import Dashboard from "./pages/Dashboard";
import RideRequestsPage from "./pages/RideRequestsPage";
import LiveRidesPage from "./pages/LiveRidesPage";
import DriversPage from "./pages/DriversPage";
import DriverKYCPage from "./pages/DriverKYCPage";
import DriverDocumentsPage from "./pages/DriverDocumentsPage";
import TripManagementPage from "./pages/TripManagementPage";
import CustomersPage from "./pages/CustomersPage";
import VehiclesPage from "./pages/VehiclesPage";
import PaymentsPage from "./pages/PaymentsPage";
import RideHistoryPage from "./pages/RideHistoryPage";
import ReportsPage from "./pages/ReportsPage";
import SettingsPage from "./pages/SettingsPage";

function App() {
  return (
    <Routes>
      {/* Login page */}
      <Route path="/login" element={<AdminLogin />} />

      {/* Admin pages */}
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Navigate to="/login" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="ride-requests" element={<RideRequestsPage />} />
        <Route path="live-rides" element={<LiveRidesPage />} />
        <Route path="drivers" element={<DriversPage />} />
        <Route path="driver-kyc" element={<DriverKYCPage />} />
        <Route path="driver-documents" element={<DriverDocumentsPage />} />
        <Route path="trip-management" element={<TripManagementPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="vehicles" element={<VehiclesPage />} />
        <Route path="payments" element={<PaymentsPage />} />
        <Route path="ride-history" element={<RideHistoryPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>

      {/* Unknown routes */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;