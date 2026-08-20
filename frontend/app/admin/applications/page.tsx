"use client";

import { ApplicationsListTable } from "@/components/admin/ApplicationsListTable";
import { m, Variants } from "framer-motion";
import { useEffect, useState } from "react";
import { applicationsApi } from "@/lib/api/applications";
import { LuDownload, LuPlus } from "react-icons/lu";

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
          <h1 className="text-3xl font-bold text-[#061a3d] mb-1">Applications</h1>
          <p className="text-sm text-gray-500 font-medium">{totalCount} Total Applicants</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
            <LuDownload className="w-4 h-4" />
            Export CSV
          </button>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#061a3d] text-white text-sm font-semibold hover:bg-blue-900 transition-colors">
            <LuPlus className="w-4 h-4" />
            Add New
          </button>
        </div>
      </div>
      
      <ApplicationsListTable />
    </m.div>
  );
}
