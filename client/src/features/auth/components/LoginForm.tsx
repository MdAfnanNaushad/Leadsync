import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { apiClient } from "../../../services/apiClient";
import { AlertCircle, Loader2 } from "lucide-react";

export const LoginForm: React.FC = () => {
  const { loginSession } = useAuth();
  const navigate = useNavigate();

  // Local Component Input States
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  // UX UI UI State tracking
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string;
    password?: string;
  }>({});

  const validateFormInput = (): boolean => {
    const errors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      errors.email = "Email coordinate is strictly required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Please input a valid structural email formatting.";
    }

    if (!password) {
      errors.password = "Verification password cannot be sent empty.";
    } else if (password.length < 6) {
      errors.password = "Password parameters must hit at least 6 characters.";
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
      const response = await apiClient.post("/auth/login", { email, password });
      const { token, user } = response.data.data;

      // Save data globally straight inside the Context state machine engine
      loginSession(token, user);
      navigate("/");
    } catch (error: any) {
      const serverMessage =
        error.response?.data?.message ||
        "Authentication pipeline failed. Please try again.";
      setErrorMessage(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 transition-colors duration-200">
      <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Access your Leadsync master command console
          </p>
        </div>

        {/* Global Error Banner Notice Component UI */}
        {errorMessage && (
          <div className="p-4 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800/50 rounded-xl flex items-start gap-3 text-rose-600 dark:text-rose-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleFormSubmission} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., administrator@leadsync.com"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.email
                  ? "border-rose-500 ring-2 ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {fieldErrors.email && (
              <p className="text-xs text-rose-500 font-semibold mt-1">
                {fieldErrors.email}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Verification Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                fieldErrors.password
                  ? "border-rose-500 ring-2 ring-rose-500/20"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {fieldErrors.password && (
              <p className="text-xs text-rose-500 font-semibold mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/60 text-white rounded-xl text-sm font-bold transition-all shadow-md shadow-indigo-600/10 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Authorization
                Processing...
              </>
            ) : (
              "Sign In To Workspace"
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-slate-100 dark:border-slate-800/60">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Need a workspace profile registered?{" "}
            <Link
              to="/register"
              className="text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
