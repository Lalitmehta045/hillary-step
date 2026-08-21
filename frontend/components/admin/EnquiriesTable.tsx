"use client";

import { LuSearch, LuFilterX, LuEye } from "react-icons/lu";
import { useEffect, useState } from "react";
import { contactApi } from "@/lib/api/contact";
import { Enquiry, EnquiryStatus } from "@/lib/api/types";

const REGIONS = [
  { value: "", label: "Region: All" },
  { value: "USA", label: "USA" },
  { value: "IND", label: "IND" },
  { value: "AUS", label: "AUS" },
];

const STATUS_OPTIONS: { value: "" | EnquiryStatus; label: string }[] = [
  { value: "", label: "Status: All" },
  { value: "NEW", label: "New" },
  { value: "CONTACTED", label: "Contacted" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "CLOSED", label: "Closed" },
];

const DATE_OPTIONS = [
  { value: "", label: "Date Range" },
  { value: "today", label: "Today" },
  { value: "7d", label: "Last 7 days" },
  { value: "30d", label: "Last 30 days" },
  { value: "90d", label: "Last 90 days" },
];

const filterSelectClass =
  "appearance-none px-4 py-2.5 pr-8 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 bg-white shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-[length:12px] bg-[right_10px_center] bg-no-repeat cursor-pointer";

const selectChevron =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239ca3af' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E\")";

function resolveRegion(enq: Enquiry): string {
  const src = `${enq.countryCode || ""} ${enq.phone || ""}`;
  if (/\(IND\)|\+91|\bIND\b/i.test(src)) return "IND";
  if (/\(AUS\)|\+61|\bAUS\b/i.test(src)) return "AUS";
  if (/\(USA\)|\+1\s*\(|\bUSA\b/i.test(src)) return "USA";
  return "-";
}

const StatusBadge = ({ status }: { status: string }) => {
  let bg = "bg-gray-100";
  let text = "text-gray-600";

  switch (status.toUpperCase()) {
    case "NEW":
      bg = "bg-blue-50";
      text = "text-blue-600";
      break;
    case "CONTACTED":
      bg = "bg-amber-50";
      text = "text-amber-700";
      break;
    case "IN_PROGRESS":
      bg = "bg-purple-50";
      text = "text-purple-700";
      break;
    case "RESOLVED":
      bg = "bg-green-50";
      text = "text-green-600";
      break;
    case "CLOSED":
      bg = "bg-gray-100";
      text = "text-gray-600";
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${bg} ${text}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
};

export function EnquiriesTable() {
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [date, setDate] = useState("");
  const pageSize = 10;

  const hasActiveFilters =
    Boolean(debouncedSearch.trim()) ||
    Boolean(region) ||
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
    const fetchEnquiries = async () => {
      setIsLoading(true);
      try {
        const params: Record<string, string | number> = { page, pageSize };
        if (debouncedSearch.trim()) params.search = debouncedSearch.trim();
        if (region) params.region = region;
        if (status) params.status = status;
        if (date) params.date = date;

        const res = await contactApi.getAdminEnquiries(params);
        setEnquiries(res.data);
        setTotal(res.meta.total);
      } catch (err) {
        console.error("Failed to fetch enquiries", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEnquiries();
  }, [page, debouncedSearch, region, status, date]);

  const handleFilterChange = (setter: (v: string) => void) => (value: string) => {
    setter(value);
    setPage(1);
  };

  const handleClearFilters = () => {
    setSearch("");
    setDebouncedSearch("");
    setRegion("");
    setStatus("");
    setDate("");
    setPage(1);
  };

  return (
    <div className="bg-white rounded-md border border-gray-200">
      {/* Table Filters & Search */}
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-[400px]">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search enquiries..."
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-sm"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <select
            value={region}
            onChange={(e) => handleFilterChange(setRegion)(e.target.value)}
            className={filterSelectClass}
            style={{ backgroundImage: selectChevron }}
            aria-label="Filter by region"
          >
            {REGIONS.map((opt) => (
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
            aria-label="Filter by date range"
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
              className="flex items-center gap-1.5 px-3 py-2.5 text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
            >
              <LuFilterX className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto border-t border-gray-100">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 bg-white">
              <th className="py-4 px-6 w-12 text-center">
                <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              </th>
              <th className="py-4 pr-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Name</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Organization</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Region</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Date Received</th>
              <th className="py-4 px-6 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="py-4 pl-6 pr-8 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                  Loading enquiries...
                </td>
              </tr>
            ) : enquiries.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-8 text-center text-sm text-gray-500">
                  No enquiries found.
                </td>
              </tr>
            ) : (
              enquiries.map((enq) => (
                <tr
                  key={enq.id}
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
                >
                  <td className="py-5 px-6 text-center">
                    <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                  </td>
                  <td className="py-5 pr-6">
                    <div className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {enq.name ? enq.name.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900 leading-tight">
                          {enq.name || "Unknown"}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-0.5">{enq.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-5 px-6 text-xs text-gray-900 font-medium whitespace-nowrap">
                    {enq.companyName || enq.organization || "-"}
                  </td>
                  <td className="py-5 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {resolveRegion(enq)}
                  </td>
                  <td className="py-5 px-6 text-xs text-gray-500 whitespace-nowrap">
                    {new Date(enq.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-5 px-6 whitespace-nowrap">
                    <StatusBadge status={enq.status} />
                  </td>
                  <td className="py-5 pl-6 pr-8 text-right whitespace-nowrap">
                    <button
                      type="button"
                      className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50 inline-flex items-center justify-center"
                      aria-label="View enquiry"
                    >
                      <LuEye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="p-6 flex justify-between items-center text-xs font-medium text-gray-500 border-t border-gray-100 bg-white rounded-b-md">
        <span>
          Showing {enquiries.length > 0 ? (page - 1) * pageSize + 1 : 0} to{" "}
          {Math.min(page * pageSize, total)} of {total} entries
        </span>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5 bg-white shadow-sm">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => p - 1)}
            className="p-1.5 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {"<"}
          </button>
          <button className="w-7 h-7 flex items-center justify-center bg-[#061a3d] text-white font-semibold rounded-[4px]">
            {page}
          </button>
          <button
            disabled={page * pageSize >= total}
            onClick={() => setPage((p) => p + 1)}
            className="p-1.5 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
