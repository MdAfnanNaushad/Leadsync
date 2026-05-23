import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../../context/AuthContext";
import {useDebounce} from "../../../hooks/Debounce"
import { apiClient } from "../../../services/apiClient";

// 1. Import runtime JavaScript objects normally
import { LeadStatus, LeadSource, UserRole } from "../../../types/shared.types";

// 2. Import interfaces/types using strict type metadata isolation
import type { ILead, PaginationMeta } from "../../../types/shared.types";

import { LeadFormModal } from "./LeadFormModal";
import {
  Search,
  Filter,
  Plus,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  Trash2,
  Edit2,
  RotateCcw,
  ShieldCheck,
  UserX,
  SlidersHorizontal,
} from "lucide-react";

export const LeadsDashboard: React.FC = () => {
  const { user } = useAuth();

  // 1. Functional Local Search & Filtering Core States
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [selectedSource, setSelectedSource] = useState<string>("");
  const [selectedSort, setSelectedSort] = useState<"Latest" | "Oldest">(
    "Latest",
  );

  // Apply our custom hook optimization layer (400ms cooldown threshold)
  const debouncedSearchQuery = useDebounce<string>(searchQuery, 400);

  // 2. Pagination & Core Content Array States
  const [leadsList, setLeadsList] = useState<ILead[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [recordsLimit] = useState<number>(10);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(
    null,
  );

  // 3. Status Metric Indicators Aggregate States
  const [metrics, setMetrics] = useState({
    total: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    lost: 0,
  });

  // 4. Interface State Management & Overlay Visibility Trackers
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [targetedLead, setTargetedLead] = useState<ILead | null>(null);

  /**
   * Main Core Engine Task: Queries and maps data from the backend APIs
   */
  const fetchLeadsDataset = useCallback(async () => {
    setIsLoading(true);
    try {
      const queryParameters = new URLSearchParams({
        page: currentPage.toString(),
        limit: recordsLimit.toString(),
        sortBy: selectedSort,
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedSource && { source: selectedSource }),
      });

      const response = await apiClient.get(
        `/leads?${queryParameters.toString()}`,
      );
      const { leads, meta } = response.data;

      setLeadsList(leads);
      setPaginationMeta(meta);

      // Dynamically calculate standard metric card balances locally from search contexts
      if (meta) {
        setMetrics((prev) => ({
          ...prev,
          total: meta.totalRecords,
        }));
      }
    } catch (error) {
      console.error(
        "Failed to sync leads parameters from data services.",
        error,
      );
    } finally {
      setIsLoading(false);
    }
  }, [
    currentPage,
    recordsLimit,
    debouncedSearchQuery,
    selectedStatus,
    selectedSource,
    selectedSort,
  ]);

  // Trigger data synchronization routines when parameters update
  useEffect(() => {
    fetchLeadsDataset();
  }, [fetchLeadsDataset]);

  // Reset page pagination back to anchor nodes if filtering variables switch
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchQuery, selectedStatus, selectedSource, selectedSort]);

  /**
   * Reset Action: Restores all filters to default parameters instantly
   */
  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("");
    setSelectedSource("");
    setSelectedSort("Latest");
  };

  /**
   * Delete Action: Triggered strictly behind Admin clearances
   */
  const handleDeleteAction = async (leadId: string) => {
    if (
      !window.confirm(
        "Are you absolutely certain you want to permanently erase this lead record?",
      )
    ) {
      return;
    }
    try {
      await apiClient.delete(`/leads/${leadId}`);
      fetchLeadsDataset();
    } catch (error) {
      alert(
        "Operation aborted: Your role clearance level lacks authorization to erase files.",
      );
    }
  };

  /**
   * CSV Streaming Download Handler
   */
  const handleCsvExportStream = async () => {
    try {
      const queryParameters = new URLSearchParams({
        ...(debouncedSearchQuery && { search: debouncedSearchQuery }),
        ...(selectedStatus && { status: selectedStatus }),
        ...(selectedSource && { source: selectedSource }),
      });

      const response = await apiClient.get(
        `/leads/export?${queryParameters.toString()}`,
        {
          responseType: "blob", // Processes data payload stream as a binary file chunk
        },
      );

      // Construct a temporary hidden link element to simulate downpour trigger sequences
      const binaryBlob = new Blob([response.data], { type: "text/csv" });
      const temporaryDownloadUrl = window.URL.createObjectURL(binaryBlob);
      const structuralAnchor = document.createElement("a");

      structuralAnchor.href = temporaryDownloadUrl;
      structuralAnchor.setAttribute(
        "download",
        `leadsync_export_${Date.now()}.csv`,
      );
      document.body.appendChild(structuralAnchor);
      structuralAnchor.click();

      // Garbage collect local memory variables safely
      document.body.removeChild(structuralAnchor);
      window.URL.revokeObjectURL(temporaryDownloadUrl);
    } catch (error) {
      alert("CSV Export pipeline encountered a network delivery failure.");
    }
  };

  const openCreationModal = () => {
    setTargetedLead(null);
    setIsModalOpen(true);
  };

  const openModificationModal = (lead: ILead) => {
    setTargetedLead(lead);
    setIsModalOpen(true);
  };

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* SECTION 1: TOP ACTION HEADER TITLE PANEL */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            Leads Management Control
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track, filter, qualify and extract operational system pipelines
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={handleCsvExportStream}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 rounded-xl transition-all border border-slate-200/50 dark:border-slate-700/50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />{" "}
            Export CSV Data
          </button>

          <button
            onClick={openCreationModal}
            className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-all shadow-md shadow-indigo-600/10"
          >
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      {/* SECTION 2: LIVE METRIC SNAPSHOT CARDS SUMMARY */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Total Segment Scope
          </p>
          <h3 className="text-2xl font-black mt-1 text-slate-900 dark:text-white">
            {metrics.total} Records
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs border-l-4 border-l-indigo-500">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Filtering Targets Active
          </p>
          <h3 className="text-2xl font-black mt-1 text-indigo-600 dark:text-indigo-400">
            {leadsList.length} Visible
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
            Current Account Identity
          </p>
          <h3 className="text-sm font-bold mt-2 text-slate-700 dark:text-slate-300 truncate">
            {user?.name}
          </h3>
        </div>
        <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Clearance Status Flag
            </p>
            <span className="inline-flex mt-2 items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900">
              <ShieldCheck className="w-3.5 h-3.5" /> {user?.role}
            </span>
          </div>
        </div>
      </div>

      {/* SECTION 3: MULTI-FILTER CONTROL CONSOLE PANEL */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
          {/* Real-time Input Parameter Fields */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search leads by name or email coordinates..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm transition-all focus:outline-hidden focus:ring-2 focus:ring-indigo-500 text-slate-900 dark:text-white"
            />
          </div>

          {/* Filtering Dropdowns Layout Grid */}
          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
              <Filter className="w-3.5 h-3.5 text-slate-400 mr-2 hidden sm:block" />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-transparent text-sm py-1.5 focus:outline-hidden w-full font-medium"
              >
                <option value="">All Status Flags</option>
                {Object.values(LeadStatus).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400 mr-2 hidden sm:block" />
              <select
                value={selectedSource}
                onChange={(e) => setSelectedSource(e.target.value)}
                className="bg-transparent text-sm py-1.5 focus:outline-hidden w-full font-medium"
              >
                <option value="">All Sources</option>
                {Object.values(LeadSource).map((val) => (
                  <option key={val} value={val}>
                    {val}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-2.5 py-1 col-span-2 sm:col-span-1">
              <select
                value={selectedSort}
                onChange={(e) =>
                  setSelectedSort(e.target.value as "Latest" | "Oldest")
                }
                className="bg-transparent text-sm py-1.5 focus:outline-hidden w-full font-medium"
              >
                <option value="Latest">Sort: Latest Entries</option>
                <option value="Oldest">Sort: Oldest Entries</option>
              </select>
            </div>

            {(searchQuery ||
              selectedStatus ||
              selectedSource ||
              selectedSort !== "Latest") && (
              <button
                onClick={handleClearFilters}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 text-xs font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition-all col-span-2 sm:col-span-1"
              >
                <RotateCcw className="w-3.5 h-3.5" /> Reset
              </button>
            )}
          </div>
        </div>
      </div>

      {/* SECTION 4: HIGH-PERFORMANCE LEADS CORE GRID TABLE */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-xs font-bold uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Lead Primary Name</th>
                <th className="py-4 px-6">Email Coordinate</th>
                <th className="py-4 px-6">Status Flag</th>
                <th className="py-4 px-6">Origin Channel</th>
                <th className="py-4 px-6 text-right">Operational Triggers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-3"></div>
                    <p className="font-semibold text-xs uppercase tracking-widest">
                      Querying Data Clusters...
                    </p>
                  </td>
                </tr>
              ) : leadsList.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-16 text-center text-slate-400">
                    <UserX className="w-10 h-10 mx-auto mb-3 text-slate-300 dark:text-slate-700" />
                    <p className="font-bold text-base text-slate-700 dark:text-slate-300">
                      No Lead Matches Tracked
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      Try adjusting your filtration criteria matrix parameters
                    </p>
                  </td>
                </tr>
              ) : (
                leadsList.map((lead) => (
                  <tr
                    key={lead._id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/30 transition-colors"
                  >
                    <td className="py-4 px-6 font-bold text-slate-900 dark:text-white">
                      {lead.name}
                    </td>
                    <td className="py-4 px-6 font-medium text-slate-500 dark:text-slate-400">
                      {lead.email}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wide border ${
                          lead.status === LeadStatus.NEW
                            ? "bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 border-blue-200 dark:border-blue-900/50"
                            : lead.status === LeadStatus.CONTACTED
                              ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 border-amber-200 dark:border-amber-900/50"
                              : lead.status === LeadStatus.QUALIFIED
                                ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900/50"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700"
                        }`}
                      >
                        {lead.status}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-md text-xs font-bold text-slate-600 dark:text-slate-400">
                        {lead.source}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1 whitespace-nowrap">
                      <button
                        onClick={() => openModificationModal(lead)}
                        className="p-1.5 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all inline-flex"
                        title="Modify Lead Settings"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Secure Role Isolation Condition block */}
                      {user?.role === UserRole.ADMIN ? (
                        <button
                          onClick={() => handleDeleteAction(lead._id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all inline-flex"
                          title="Purge Record (Admin Privilege)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      ) : (
                        <span
                          className="p-1.5 text-slate-200 dark:text-slate-800 cursor-not-allowed inline-flex"
                          title="Deletion locked to Administrative roles"
                        >
                          <Trash2 className="w-4 h-4" />
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* BOTTOM PAGINATION CONTROLLER SECTION PANEL FOOTER */}
        {paginationMeta && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-900/50">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Showing page {paginationMeta.currentPage} of{" "}
              {paginationMeta.totalPages} ({paginationMeta.totalRecords} overall
              nodes)
            </p>

            <div className="flex items-center gap-1">
              <button
                disabled={!paginationMeta.hasPrevPage || isLoading}
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all inline-flex"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                disabled={!paginationMeta.hasNextPage || isLoading}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="p-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 disabled:opacity-40 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-all inline-flex"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* MODAL WINDOW GATEWAY ROUTER OVERLAY NODE */}
      {isModalOpen && (
        <LeadFormModal
          activeLeadRecord={targetedLead}
          closeModalTrigger={() => setIsModalOpen(false)}
          refreshDataCallback={fetchLeadsDataset}
        />
      )}
    </div>
  );
};
