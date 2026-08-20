"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { applicationsApi } from "@/lib/api/applications";
import { Application } from "@/lib/api/types";
import { LuSearch, LuChevronDown, LuFilterX } from "react-icons/lu";

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
      bg = "bg-gray-100";
      text = "text-gray-600";
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
  const pageSize = 10;

  useEffect(() => {
    const fetchApps = async () => {
      setIsLoading(true);
      try {
        const res = await applicationsApi.getAdminApplications({ page, pageSize });
        setApplications(res.data);
        setTotal(res.meta.total);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApps();
  }, [page]);

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
            placeholder="Search applicants..." 
            className="w-full pl-9 pr-4 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50/30"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {["Practice (All)", "Location (All)", "Experience (All)", "Status (All)", "Date (Any)"].map((filter) => (
            <button key={filter} className="flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 bg-white hover:bg-gray-50">
              {filter}
              <LuChevronDown className="w-3 h-3 text-gray-400" />
            </button>
          ))}
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 ml-auto md:ml-2">
            <LuFilterX className="w-4 h-4" />
            Clear
          </button>
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
            ) : applications.map((app) => (
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
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap group-hover:text-blue-600 transition-colors">{app.fullName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                  {app.email}
                </td>
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
                  {new Date(app.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={app.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-4 flex justify-between items-center text-xs font-medium text-gray-500">
        <span>{applications.length > 0 ? (page - 1) * pageSize + 1 : 0}-{Math.min(page * pageSize, total)} of {total}</span>
        <div className="flex items-center gap-1">
          <button 
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="p-1 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {"<"}
          </button>
          <button className="w-6 h-6 flex items-center justify-center bg-blue-50 text-blue-600 font-bold rounded">{page}</button>
          <button 
            disabled={page * pageSize >= total}
            onClick={() => setPage(p => p + 1)}
            className="p-1 hover:text-gray-900 transition-colors disabled:opacity-50"
          >
            {">"}
          </button>
        </div>
      </div>
    </div>
  );
}
