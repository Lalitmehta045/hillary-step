"use client";

import { ApplicationsListTable } from "@/components/admin/ApplicationsListTable";
import { m, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { applicationsApi } from "@/lib/api/applications";
import { LuDownload, LuPlus, LuFileText, LuBriefcase } from "react-icons/lu";
import Link from "next/link";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

export default function ApplicationsManagementPage() {
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    applicationsApi.getAdminApplications({ pageSize: 1 })
      .then(res => setTotalCount(res.meta.total))
      .catch(console.error);
  }, []);

  return (
    <m.div className="max-w-[1280px]" variants={containerVariants} initial="hidden" animate="visible">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#061a3d]">Applications</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {totalCount} Total Applicants
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">Candidate applications received via Find a Job.</p>
        </div>
        
        <div className="flex items-center gap-3 flex-wrap">
          {/* Tab switcher linking Applications & Jobs */}
          <div className="flex items-center bg-gray-100 p-1 rounded-xl">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#061a3d] shadow-xs">
              <LuFileText className="w-3.5 h-3.5 text-blue-600" />
              Applications
            </div>
            <Link
              href="/admin/jobs"
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
            >
              <LuBriefcase className="w-3.5 h-3.5" />
              Job Postings
            </Link>
          </div>

          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <LuDownload className="w-4 h-4" />
            Export CSV
          </button>
        </div>
      </div>
      
      <ApplicationsListTable />
    </m.div>
  );
}
