import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { UserRole } from '../types/shared.types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isSessionResolving } = useAuth();
  const activeLocation = useLocation();

  // 1. If global context is actively fetching session variables out of localStorage, halt routing
  if (isSessionResolving) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  // 2. If user is unauthenticated, redirect to sign-in while caching their intended path target
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: activeLocation }} replace />;
  }

  // 3. If an explicit clearance check fails against user profile roles, block access
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // 4. Verification steps completed safely, load downstream viewport
  return <>{children}</>;
};