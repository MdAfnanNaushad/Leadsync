import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { apiClient } from '../../../services/apiClient';
import { UserRole } from '../../../types/shared.types';
import { AlertCircle, Loader2 } from 'lucide-react';

export const RegisterForm: React.FC = () => {
  const { loginSession } = useAuth();
  const navigate = useNavigate();

  // Local Form State Matrix
  const [name, setName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>(UserRole.SALES);

  // Runtime UX UI tracker flags
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ name?: string; email?: string; password?: string }>({});

  const validateFormInput = (): boolean => {
    const errors: { name?: string; email?: string; password?: string } = {};

    if (!name.trim()) errors.name = 'Full identity name is mandatory.';
    if (!email.trim()) {
      errors.email = 'Email identifier coordinates are mandatory.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Invalid email expression format structure.';
    }
    if (!password) {
      errors.password = 'Security password registration is mandatory.';
    } else if (password.length < 6) {
      errors.password = 'Passwords must hold a minimum of 6 validation bytes.';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateFormInput()) return;

    setIsSubmitting(true);
    try {
      const response = await apiClient.post('/auth/register', { name, email, password, role });
      const { token, user } = response.data.data;

      loginSession(token, user);
      navigate('/');
    } catch (error: any) {
      const serverMessage = error.response?.data?.message || 'Profile setup failed. Email might be claimed.';
      setErrorMessage(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-5">
        
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">Create Account</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Deploy your operational workspace nodes</p>
        </div>

        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleFormSubmission} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-white dark:text-slate-400 mb-1.5">Full Identity Name</label>
            <input 
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Abdullah GS3"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.name ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {fieldErrors.name && <p className="text-xs text-rose-500 font-semibold mt-1">{fieldErrors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Email Address</label>
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., sales_lead@leadsync.tech"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.email ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {fieldErrors.email && <p className="text-xs text-rose-500 font-semibold mt-1">{fieldErrors.email}</p>}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Choose Clearance Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as UserRole)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            >
              <option value={UserRole.SALES}>Sales User (Standard Operations)</option>
              <option value={UserRole.ADMIN}>Admin (Full Control Clearance)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">Security Access Password</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Minimum 6 characters long"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.password ? 'border-rose-500 ring-2 ring-rose-500/20' : 'border-slate-200 dark:border-slate-700'
              }`}
            />
            {fieldErrors.password && <p className="text-xs text-rose-500 font-semibold mt-1">{fieldErrors.password}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/60 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Provisioning Account...
              </>
            ) : 'Complete Workspace Registration'}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Already own an active profile grid?{' '}
            <Link to="/login" className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline">Log In</Link>
          </p>
        </div>

      </div>
    </div>
  );
};