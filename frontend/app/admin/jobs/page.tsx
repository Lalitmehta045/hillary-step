"use client";

import { JobsListTable } from "@/components/admin/JobsListTable";
import { m, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { jobsApi } from "@/lib/api/jobs";
import Link from "next/link";
import { LuFileText, LuBriefcase } from "react-icons/lu";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

export default function JobsManagementPage() {
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    jobsApi.getAdminJobs({ pageSize: 1 })
      .then((res) => setTotalCount(res.meta.total))
      .catch(console.error);
  }, []);

  return (
    <m.div className="max-w-[1280px]" variants={containerVariants} initial="hidden" animate="visible">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold text-[#061a3d]">Job Postings</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              {totalCount} Total
            </span>
          </div>
          <p className="text-sm text-gray-500 font-medium">
            Manage organization-submitted jobs and recruitment postings.
          </p>
        </div>

        {/* Tab switcher linking Applications & Jobs */}
        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <Link
            href="/admin/applications"
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 hover:text-gray-900 transition-colors"
          >
            <LuFileText className="w-3.5 h-3.5" />
            Applications
          </Link>
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-white text-[#061a3d] shadow-xs">
            <LuBriefcase className="w-3.5 h-3.5 text-blue-600" />
            Job Postings
          </div>
        </div>
      </div>
      
      <JobsListTable />
    </m.div>
  );
}
