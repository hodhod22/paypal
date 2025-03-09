import React, { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Profile from "./pages/Profile";
import AdminDashboard from "./pages/AdminDashboard";
import Navbar from "./components/Navbar";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import ZarinpalCallback from "./components/ZarinpalCallback";
import ConfirmOrder from "./pages/ConfirmOrder";
import VerifyPayout from "./components/VerifyPayout"; // Create this component
import LanguageSettings from "./pages/LanguageSettings";
import LanguageIndicator from "./components/LanguageIndicator";
import { useLanguage, LanguageProvider } from "./contexts/LanguageContext";
import useLanguageDetection from "./hooks/useLanguageDetection";
import PayoutFormBuilder from "./components/PayoutFormBuilder";
import { NotificationProvider } from "./contexts/NotificationContext";
import NotificationContainer from "./components/NotificationContainer";
import NotificationDemo from "./pages/NotificationDemo";
import DateTimeDemo from "./pages/DateTimeDemo";
import DateTimeTest from "./components/DateTimeTest";

const PrivateRoute = ({ children, roleRequired }) => {
  const token = localStorage.getItem("token");
  const { user } = useSelector((state) => state.auth);

  if (!token) return <Navigate to="/login" />;

  if (roleRequired && user.role !== roleRequired) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

const App = () => {
  const { isRTL } = useLanguage();
  // Use the language detection hook
  useLanguageDetection();

  return (
    <NotificationProvider>
      <div
        className={`min-h-screen bg-[#00008B] App ${
          isRTL() ? "rtl" : "ltr"
        } mobile-scrollable`}
      >
        <Navbar />
        <NotificationContainer />
        <LanguageIndicator position="bottom-right" />
        <div
          className="page-content overflow-auto"
          style={{ minHeight: "calc(100vh - 64px)" }}
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/admin/dashboard"
              element={
                <PrivateRoute roleRequired="admin">
                  <AdminDashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/zarinpal-callback" element={<ZarinpalCallback />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings/language" element={<LanguageSettings />} />
            <Route path="/confirm?" element={<ConfirmOrder />} />
            <Route path="/verify-payout" element={<VerifyPayout />} />
            <Route path="/payouts/builder" element={<PayoutFormBuilder />} />
            <Route path="/notifications/demo" element={<NotificationDemo />} />
            <Route path="/datetime/demo" element={<DateTimeDemo />} />
            <Route path="/datetime/test" element={<DateTimeTest />} />
          </Routes>
        </div>
      </div>
    </NotificationProvider>
  );
};

const AppWithProviders = () => {
  return (
    <LanguageProvider>
      <App />
    </LanguageProvider>
  );
};

export default AppWithProviders;
