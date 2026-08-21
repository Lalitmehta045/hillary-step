"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { applicationsApi } from "@/lib/api/applications";
import { Application, ApplicationStatus } from "@/lib/api/types";
import { LuSearch, LuFilterX } from "react-icons/lu";

const PRACTICES = ["Engineering", "Data & AI", "Civil & Infrastructure", "Corporate"];
const LOCATIONS = ["USA", "Australia", "India"];
const EXPERIENCE_OPTIONS = [
  { value: "", label: "Experience (All)" },
  { value: "0-2", label: "0–2 years" },
  { value: "3-5", label: "3–5 years" },
  { value: "6-10", label: "6–10 years" },
  { value: "10+", label: "10+ years" },
];
const STATUS_OPTIONS: { value: "" | ApplicationStatus; label: string }[] = [
  { value: "", label: "Status (All)" },
  { value: "NEW", label: "New" },
  { value: "REVIEWING", label: "Reviewing" },
  { value: "SHORTLISTED", label: "Shortlisted" },
  { value: "INTERVIEW", label: "Interview" },
  { value: "HIRED", label: "Hired" },
  { value: "REJECTED", label: "Rejected" },
];
const DATE_OPTIONS = [
  { value: "", label: "Date (Any)" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const filterSelectClass =
  "appearance-none px-3 py-1.5 pr-7 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[length:12px] bg-[right_8px_center] bg-no-repeat cursor-pointer";

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")";

const StatusBadge = ({ status }: { status: string }) => {
  let bg = "bg-gray-100";
  let text = "text-gray-600";

  switch (status.toLowerCase()) {
    case "new":
      bg = "bg-blue-50";
      text = "text-blue-600";
      break;
    case "shortlisted":
      bg = "bg-green-100";
      text = "text-green-700";
      break;
    case "reviewed":
    case "reviewing":
      bg = "bg-gray-100";
      text = "text-gray-600";
      break;
    case "interview":
      bg = "bg-purple-50";
      text = "text-purple-700";
      break;
    case "hired":
      bg = "bg-emerald-50";
      text = "text-emerald-700";
      break;
    case "rejected":
      bg = "bg-rose-50";
      text = "text-rose-700";
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${bg} ${text}`}>
      {status}
    </span>
  );
};

export function ApplicationsListTable() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [practice, setPractice] = useState("");
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const pageSize = 10;

  const hasActiveFilters =
    Boolean(debouncedSearch.trim()) ||
    Boolean(practice) ||
    Boolean(location) ||
    Boolean(experience) ||
    Boolean(status) ||
    Boolean(date);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) setPage(1);
        return search;
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string | number> = { page, pageSize };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (practice) params.practice = practice;
        if (location) params.location = location;
        if (experience) params.experience = experience;
        if (status) params.status = status;
        if (date) params.date = date;

        const res = await applicationsApi.getAdminApplications(params);
        setApplications(res.data);
        setTotal(res.meta.total);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, [page, debouncedSearch, practice, location, experience, status, date]);

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setPractice("");
    setLocation("");
    setExperience("");
    setStatus("");
    setDate("");
    setPage(1);
  };

  const handleRowClick = (id: string) => {
    router.push(`/admin/applications/${id}`);
  };

  return (
    <div className="bg-white rounded-md border border-gray-200">
      {/* Table Filters & Search */}
      <div className="p-6 flex flex-col gap-6">
        <div className="relative w-full">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicants..."
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/30"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={practice}
            onChange={(e) => handleFilterChange(setPractice)(e.target.value)}
            className={filterSelectClass}
            style={{ backgroundImage: selectChevron }}
            aria-label="Filter by practice"
          >
            <option value="">Practice (All)</option>
            {PRACTICES.map((p) => (
              <option key={p} value={p}>
                {p}
              </option>
            ))}
          </select>

          <select
            value={location}
            onChange={(e) => handleFilterChange(setLocation)(e.target.value)}
            className={filterSelectClass}
            style={{ backgroundImage: selectChevron }}
            aria-label="Filter by location"
          >
            <option value="">Location (All)</option>
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>

          <select
            value={experience}
            onChange={(e) => handleFilterChange(setExperience)(e.target.value)}
            className={filterSelectClass}
            style={{ backgroundImage: selectChevron }}
            aria-label="Filter by experience"
          >
            {EXPERIENCE_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={status}
            onChange={(e) => handleFilterChange(setStatus)(e.target.value)}
            className={filterSelectClass}
            style={{ backgroundImage: selectChevron }}
            aria-label="Filter by status"
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value || "all"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          <select
            value={date}
            onChange={(e) => handleFilterChange(setDate)(e.target.value)}
            className={filterSelectClass}
            style={{ backgroundImage: selectChevron }}
            aria-label="Filter by date"
          >
            {DATE_OPTIONS.map((opt) => (
              <option key={opt.value || "any"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleClearFilters}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 ml-auto md:ml-2"
            >
              <LuFilterX className="w-4 h-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-t border-gray-200">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/50">
              <th className="py-3 px-4 w-12 text-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="py-3 pr-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Applicant</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Contact</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Practice</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Location</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Exp</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Date Applied</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                  Loading applications...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-sm text-gray-500">
                  No applications found.
                </td>
              </tr>
            ) : (
              applications.map((app) => (
                <tr
                  key={app.id}
                  onClick={() => handleRowClick(app.id)}
                  className="border-b border-gray-100 hover:bg-gray-50/80 transition-colors cursor-pointer group"
                >
                  <td className="py-4 px-4 text-center" onClick={(e) => e.stopPropagation()}>
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                        {app.fullName.charAt(0)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">
                        {app.fullName}
                      </span>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">{app.email}</td>
                  <td className="py-4 px-4 text-xs text-gray-900 font-medium whitespace-nowrap">
                    {app.practice || "-"}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-900 font-medium whitespace-nowrap">
                    {app.preferredLocation || "-"}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                    {app.experienceYears || "-"}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(app.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-4 px-4 whitespace-nowrap">
                    <StatusBadge status={app.status} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-4 flex justify-between items-center text-xs font-medium text-gray-500">
        <span>
          {applications.length > 0 ? (page - 1) * pageSize + 1 : 0}-
          {Math.min(page * pageSize, total)} of {total}
        </span>
        <div className="flex items-center gap-1">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {"<"}
          </button>
          <button className="w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded">
            {page}
          </button>
          <button
            disabled={page * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
            className="p-1 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
