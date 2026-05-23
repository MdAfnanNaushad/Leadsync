import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { DashboardLayout } from "./layout/DashboardLayout";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { LoginForm } from "./features/auth/components/LoginForm";
import { RegisterForm } from "./features/auth/components/RegisterForm";
import { LeadsDashboard } from "./features/leads/components/LeadsDashboard";
import { ShieldAlert } from "lucide-react";

// Lightweight fallback panel view for unauthorized role exceptions
const UnauthorizedView: React.FC = () => (
  <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
    <ShieldAlert className="w-16 h-16 text-rose-500 mb-2 animate-pulse" />
    <h2 className="text-2xl font-black text-slate-900 dark:text-white">
      Insufficient Clearance Level
    </h2>
    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-sm text-center">
      Your user profile role does not hold permissions to operate this module
      function.
    </p>
    <a
      href="/"
      className="mt-4 px-4 py-2 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all"
    >
      Return to Explorer
    </a>
  </div>
);

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. Public Authentication Route Nodes */}
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/unauthorized" element={<UnauthorizedView />} />

            {/* 2. Secured Authenticated Layout Shell Engine Pointers */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <DashboardLayout />
                </ProtectedRoute>
              }
            >
              {/* Core Index Workspace Dashboard */}
              <Route index element={<LeadsDashboard />} />
            </Route>

            {/* 3. Global Unmapped Route Catch Fallback redirection block */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
