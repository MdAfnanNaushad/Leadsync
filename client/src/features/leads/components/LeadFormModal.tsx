import React, { useState, useEffect } from "react";
import type { ILead } from "../../../types/shared.types";
import  { LeadStatus, LeadSource } from "../../../types/shared.types";
import { apiClient } from "../../../services/apiClient";
import { X, Loader2, AlertCircle } from "lucide-react";

interface LeadFormModalProps {
  activeLeadRecord: ILead | null; // Pass target record to update, or pass null for fresh creation
  closeModalTrigger: () => void;
  refreshDataCallback: () => void;
}

export const LeadFormModal: React.FC<LeadFormModalProps> = ({
  activeLeadRecord,
  closeModalTrigger,
  refreshDataCallback,
}) => {
  const isEditingMode = !!activeLeadRecord;

  // Local Operational Input State Matrix
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [status, setStatus] = useState<LeadStatus>(LeadStatus.NEW);
  const [source, setSource] = useState<LeadSource>(LeadSource.WEBSITE);

  // Interface state tracking variables
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<{
    name?: string;
    email?: string;
  }>({});

  // Pre-load data variables if an active lead record is passed for editing
  useEffect(() => {
    if (activeLeadRecord) {
      setName(activeLeadRecord.name);
      setEmail(activeLeadRecord.email);
      setStatus(activeLeadRecord.status);
      setSource(activeLeadRecord.source);
    }
  }, [activeLeadRecord]);

  const validateInputs = (): boolean => {
    const errors: { name?: string; email?: string } = {};
    if (!name.trim()) errors.name = "Lead contact name is required.";
    if (!email.trim()) {
      errors.email = "Lead communication email is required.";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Invalid email address formatting structure.";
    }
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFormSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!validateInputs()) return;

    setIsSubmitting(true);
    try {
      const payload = { name, email, status, source };

      if (isEditingMode && activeLeadRecord) {
        await apiClient.patch(`/leads/${activeLeadRecord._id}`, payload);
      } else {
        await apiClient.post("/leads", payload);
      }

      refreshDataCallback();
      closeModalTrigger();
    } catch (error: any) {
      const serverMessage =
        error.response?.data?.message ||
        "Failed to sync lead record parameters.";
      setErrorMessage(serverMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Dark overlay backdrop layer */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={closeModalTrigger}
      />

      {/* Modal Layout Window content wrapper block */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-10 animate-scale-in">
        {/* Header Ribbon Component */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <h3 className="text-lg font-black tracking-tight text-slate-900 dark:text-white">
            {isEditingMode
              ? "Modify Target Lead parameters"
              : "Track Fresh Business Lead"}
          </h3>
          <button
            onClick={closeModalTrigger}
            className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Local Processing Server Notification Alert block */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800/40 rounded-xl flex items-start gap-2 text-rose-600 dark:text-rose-400 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleFormSubmission} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Lead Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Rajesh Kumar"
              className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                validationErrors.name
                  ? "border-rose-500 ring-2 ring-rose-500/10"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {validationErrors.name && (
              <p className="text-xs text-rose-500 font-medium mt-1">
                {validationErrors.name}
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Communication Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g., rajesh@gmail.com"
              className={`w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 ${
                validationErrors.email
                  ? "border-rose-500 ring-2 ring-rose-500/10"
                  : "border-slate-200 dark:border-slate-700"
              }`}
            />
            {validationErrors.email && (
              <p className="text-xs text-rose-500 font-medium mt-1">
                {validationErrors.email}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Lead Status Flag
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as LeadStatus)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(LeadStatus).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Origin Source
              </label>
              <select
                value={source}
                onChange={(e) => setSource(e.target.value as LeadSource)}
                className="w-full px-3.5 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
              >
                {Object.values(LeadSource).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Action footer triggers panel block layout */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800/60 mt-6">
            <button
              type="button"
              onClick={closeModalTrigger}
              className="px-4 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-600/60 text-white rounded-xl text-sm font-bold shadow-md shadow-indigo-600/10 transition-all flex items-center gap-1.5"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditingMode ? "Save Modifications" : "Create Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
