"use client";

import { useEffect, useState } from "react";
import { jobsApi } from "@/lib/api/jobs";
import { Job, JobStatus } from "@/lib/api/types";
import { 
  LuSearch, 
  LuFilterX, 
  LuBuilding, 
  LuMapPin, 
  LuClock, 
  LuBriefcase, 
  LuEye, 
  LuX, 
  LuTrash2
} from "react-icons/lu";

const StatusBadge = ({ status }: { status: JobStatus | string }) => {
  let bg = "bg-gray-100";
  let text = "text-gray-700";
  let border = "border-gray-200";

  switch (status?.toUpperCase()) {
    case "PUBLISHED":
      bg = "bg-emerald-50";
      text = "text-emerald-700";
      border = "border-emerald-200";
      break;
    case "DRAFT":
      bg = "bg-amber-50";
      text = "text-amber-700";
      border = "border-amber-200";
      break;
    case "CLOSED":
      bg = "bg-rose-50";
      text = "text-rose-700";
      border = "border-rose-200";
      break;
    case "ARCHIVED":
      bg = "bg-gray-100";
      text = "text-gray-500";
      border = "border-gray-200";
      break;
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${bg} ${text} ${border}`}>
      {status || "DRAFT"}
    </span>
  );
};

export function JobsListTable() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const pageSize = 10;

  const fetchJobs = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, any> = { page, pageSize };
      if (search.trim()) params.search = search.trim();
      if (statusFilter !== "ALL") params.status = statusFilter;

      const res = await jobsApi.getAdminJobs(params);
      setJobs(res.data);
      setTotal(res.meta.total);
    } catch (err) {
      console.error("Failed to fetch jobs", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchJobs();
  };

  const handleClearFilters = () => {
    setSearch("");
    setStatusFilter("ALL");
    setPage(1);
  };

  const handleUpdateStatus = async (jobId: string, newStatus: string) => {
    setIsUpdatingStatus(true);
    try {
      await jobsApi.updateJobStatus(jobId, newStatus);
      setJobs((prev) =>
        prev.map((j) => (j.id === jobId ? { ...j, status: newStatus as JobStatus } : j))
      );
      if (selectedJob && selectedJob.id === jobId) {
        setSelectedJob((prev) => (prev ? { ...prev, status: newStatus as JobStatus } : null));
      }
    } catch (err) {
      console.error("Failed to update status", err);
      alert("Failed to update job status.");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleDeleteJob = async (jobId: string) => {
    if (!confirm("Are you sure you want to delete this job posting?")) return;
    try {
      await jobsApi.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.id !== jobId));
      setTotal((t) => Math.max(0, t - 1));
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
      }
    } catch (err) {
      console.error("Failed to delete job", err);
      alert("Failed to delete job posting.");
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
      {/* Search & Filter Bar */}
      <div className="p-5 border-b border-gray-100 flex flex-col gap-4">
        <form onSubmit={handleSearchSubmit} className="relative w-full">
          <LuSearch className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title or organization name..."
            className="w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 bg-gray-50/50"
          />
        </form>

        <div className="flex flex-wrap items-center gap-2">
          {["ALL", "DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"].map((st) => (
            <button
              key={st}
              onClick={() => {
                setStatusFilter(st);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                statusFilter === st
                  ? "bg-[#061a3d] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {st === "ALL" ? "All Statuses" : st.charAt(0) + st.slice(1).toLowerCase()}
            </button>
          ))}

          {(search || statusFilter !== "ALL") && (
            <button
              onClick={handleClearFilters}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 ml-auto transition-colors"
            >
              <LuFilterX className="w-3.5 h-3.5" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Jobs Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/75">
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Job Title</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Organization</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Location</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Role Specs</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Description</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Submitted Date</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider">Status</th>
              <th className="py-3 px-4 text-[11px] font-bold text-gray-500 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-gray-500">
                  <div className="flex items-center justify-center gap-2">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
                    <span>Loading submitted jobs...</span>
                  </div>
                </td>
              </tr>
            ) : jobs.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-sm text-gray-500">
                  <p className="font-medium text-gray-700 mb-1">No job postings found</p>
                  <p className="text-xs text-gray-400">Jobs submitted via the public &quot;Post a Job&quot; form will appear here.</p>
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const locationStr = [job.city, job.country].filter(Boolean).join(", ") || "-";
                const specsStr = [job.roleType, job.experienceLevel].filter(Boolean).join(" • ") || "-";
                const descSnippet = job.jobDescription ? (job.jobDescription.length > 50 ? `${job.jobDescription.slice(0, 50)}...` : job.jobDescription) : "-";

                return (
                  <tr
                    key={job.id}
                    onClick={() => setSelectedJob(job)}
                    className="hover:bg-blue-50/40 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0">
                          <LuBriefcase className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors block">
                            {job.jobTitle}
                          </span>
                          <span className="text-[11px] text-gray-400 font-mono">ID: {job.id.slice(0, 8)}</span>
                        </div>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs font-medium text-gray-700">
                      <div className="flex items-center gap-1.5">
                        <LuBuilding className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{job.organizationName || "Independent / Unspecified"}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-600">
                      <div className="flex items-center gap-1.5">
                        <LuMapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{locationStr}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-600">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-gray-700 font-medium">
                        {specsStr}
                      </span>
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-500 max-w-[200px] truncate" title={job.jobDescription || ""}>
                      {descSnippet}
                    </td>

                    <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <LuClock className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                        <span>{new Date(job.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4 whitespace-nowrap">
                      <StatusBadge status={job.status} />
                    </td>

                    <td className="py-4 px-4 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedJob(job)}
                          title="View Details"
                          className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        >
                          <LuEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id)}
                          title="Delete Job"
                          className="p-1.5 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-md transition-colors"
                        >
                          <LuTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-gray-50/50 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs font-medium text-gray-500">
        <span>
          Showing {jobs.length > 0 ? (page - 1) * pageSize + 1 : 0} to {Math.min(page * pageSize, total)} of {total} job postings
        </span>
        <div className="flex items-center gap-1.5">
          <button
            disabled={page === 1 || isLoading}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Previous
          </button>
          <span className="px-3 py-1.5 bg-blue-50 text-blue-700 font-bold rounded-md">
            Page {page} of {Math.max(1, Math.ceil(total / pageSize))}
          </span>
          <button
            disabled={page * pageSize >= total || isLoading}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 bg-white border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      {/* Job Detail Modal */}
      {selectedJob && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedJob(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-100 flex items-start justify-between gap-4 bg-gradient-to-r from-gray-50 to-white">
              <div className="flex items-start gap-3.5">
                <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold shadow-md shadow-blue-500/20 shrink-0">
                  <LuBriefcase className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-xl font-bold text-gray-900 leading-tight">
                      {selectedJob.jobTitle}
                    </h2>
                    <StatusBadge status={selectedJob.status} />
                  </div>
                  <p className="text-sm font-medium text-gray-600 flex items-center gap-1.5">
                    <LuBuilding className="w-4 h-4 text-gray-400" />
                    <span>{selectedJob.organizationName || "Organization Unspecified"}</span>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedJob(null)}
                className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
              {/* Key Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-gray-50 border border-gray-100">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Role Type</span>
                  <span className="font-semibold text-gray-900">{selectedJob.roleType || "-"}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Experience</span>
                  <span className="font-semibold text-gray-900">{selectedJob.experienceLevel || "-"}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Location</span>
                  <span className="font-semibold text-gray-900">{[selectedJob.city, selectedJob.country].filter(Boolean).join(", ") || "-"}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-gray-400 block mb-1">Submitted</span>
                  <span className="font-semibold text-gray-900">
                    {new Date(selectedJob.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Job Description</h3>
                <div className="p-4 rounded-xl bg-white border border-gray-200 text-gray-700 whitespace-pre-wrap leading-relaxed min-h-[100px]">
                  {selectedJob.jobDescription || "No detailed job description provided."}
                </div>
              </div>

              {/* Status Management */}
              <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="font-semibold text-gray-900 block text-xs">Update Status</span>
                  <span className="text-xs text-gray-500">Change publishing state in Hillary Step portal</span>
                </div>
                <div className="flex items-center gap-2">
                  {(["DRAFT", "PUBLISHED", "CLOSED", "ARCHIVED"] as const).map((st) => (
                    <button
                      key={st}
                      disabled={isUpdatingStatus || selectedJob.status === st}
                      onClick={() => handleUpdateStatus(selectedJob.id, st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedJob.status === st
                          ? "bg-blue-600 text-white shadow-sm"
                          : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                      }`}
                    >
                      {st.charAt(0) + st.slice(1).toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <button
                onClick={() => handleDeleteJob(selectedJob.id)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold text-rose-600 hover:bg-rose-50 transition-colors"
              >
                <LuTrash2 className="w-4 h-4" />
                Delete Posting
              </button>
              <button
                onClick={() => setSelectedJob(null)}
                className="px-5 py-2 rounded-lg text-xs font-semibold bg-[#061a3d] text-white hover:bg-blue-900 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
