"use client";

import { KpiCard } from "@/components/admin/KpiCard";
import { RecentApplicationsTable } from "@/components/admin/RecentApplicationsTable";
import { 
  LuFileText, 
  LuBadgeCheck, 
  LuStar, 
  LuMessageSquare,
  LuBriefcase
} from "react-icons/lu";
import { m, Variants } from "framer-motion";
import { useState, useEffect } from "react";
import { applicationsApi } from "@/lib/api/applications";
import { contactApi } from "@/lib/api/contact";
import { jobsApi } from "@/lib/api/jobs";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1 
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 }
  }
};

export default function AdminDashboardPage() {
  const [hoveredSegment, setHoveredSegment] = useState<string | null>(null);
  
  // Real Data State
  const [kpiData, setKpiData] = useState({
    totalApps: 0,
    newApps: 0,
    shortlistedApps: 0,
    reviewedApps: 0,
    enquiries: 0,
    totalJobs: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [
          totalAppsRes,
          newAppsRes,
          shortlistedAppsRes,
          reviewedAppsRes,
          enquiriesRes,
          jobsRes
        ] = await Promise.all([
          applicationsApi.getAdminApplications({ pageSize: 1 }),
          applicationsApi.getAdminApplications({ status: "NEW", pageSize: 1 }),
          applicationsApi.getAdminApplications({ status: "SHORTLISTED", pageSize: 1 }),
          applicationsApi.getAdminApplications({ status: "REVIEWING", pageSize: 1 }), // Map reviewing to reviewed
          contactApi.getAdminEnquiries({ pageSize: 1 }),
          jobsApi.getAdminJobs({ pageSize: 1 })
        ]);

        setKpiData({
          totalApps: totalAppsRes.meta.total,
          newApps: newAppsRes.meta.total,
          shortlistedApps: shortlistedAppsRes.meta.total,
          reviewedApps: reviewedAppsRes.meta.total,
          enquiries: enquiriesRes.meta.total,
          totalJobs: jobsRes.meta.total
        });
      } catch (err) {
        console.error("Failed to load dashboard data", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const total = kpiData.totalApps || 1; // avoid div by 0
  const otherApps = kpiData.totalApps - kpiData.newApps - kpiData.reviewedApps - kpiData.shortlistedApps;
  
  const pNew = (kpiData.newApps / total) * 100;
  const pReviewed = (kpiData.reviewedApps / total) * 100;
  const pShortlisted = (kpiData.shortlistedApps / total) * 100;
  const pOther = (Math.max(0, otherApps) / total) * 100;

  // Chart data calculations for strokeDashoffset
  // Total circumference is 528
  // offset = 528 - (percent / 100) * 528
  const offsetNew = 528 - (pNew / 100) * 528;
  const offsetReviewed = 528 - (pReviewed / 100) * 528;
  const offsetShortlisted = 528 - (pShortlisted / 100) * 528;
  const offsetOther = 528 - (pOther / 100) * 528;

  // Rotations
  const rotReviewed = (pNew / 100) * 360;
  const rotShortlisted = rotReviewed + (pReviewed / 100) * 360;
  const rotOther = rotShortlisted + (pShortlisted / 100) * 360;

  const chartData = {
    new: { label: 'New', value: kpiData.newApps.toLocaleString() },
    reviewed: { label: 'Reviewed', value: kpiData.reviewedApps.toLocaleString() },
    shortlisted: { label: 'Shortlisted', value: kpiData.shortlistedApps.toLocaleString() },
    other: { label: 'Other', value: Math.max(0, otherApps).toLocaleString() },
  };

  const displayData = hoveredSegment 
    ? chartData[hoveredSegment as keyof typeof chartData] 
    : { label: 'Total', value: kpiData.totalApps.toLocaleString() };

  return (
    <m.div 
      className="max-w-[1020px]"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <m.h1 variants={itemVariants} className="text-sm font-bold text-[#191c1e] mb-6 font-display">Dashboard</m.h1>
      
      {/* KPI Cards */}
      <m.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <m.div variants={itemVariants}>
          <KpiCard
            title="Total Applications"
            value={isLoading ? "..." : kpiData.totalApps.toLocaleString()}
            percentageChange={0}
            icon={LuFileText}
            iconBgClass="bg-blue-50"
            iconColorClass="text-blue-600"
          />
        </m.div>
        <m.div variants={itemVariants}>
          <KpiCard
            title="Job Postings"
            value={isLoading ? "..." : kpiData.totalJobs.toLocaleString()}
            percentageChange={0}
            icon={LuBriefcase}
            iconBgClass="bg-indigo-50"
            iconColorClass="text-indigo-600"
          />
        </m.div>
        <m.div variants={itemVariants}>
          <KpiCard
            title="New Applications"
            value={isLoading ? "..." : kpiData.newApps.toLocaleString()}
            percentageChange={0}
            icon={LuBadgeCheck}
            iconBgClass="bg-green-50"
            iconColorClass="text-green-600"
          />
        </m.div>
        <m.div variants={itemVariants}>
          <KpiCard
            title="Shortlisted"
            value={isLoading ? "..." : kpiData.shortlistedApps.toLocaleString()}
            percentageChange={0}
            icon={LuStar}
            iconBgClass="bg-orange-50"
            iconColorClass="text-orange-500"
          />
        </m.div>
        <m.div variants={itemVariants}>
          <KpiCard
            title="Enquiries"
            value={isLoading ? "..." : kpiData.enquiries.toLocaleString()}
            percentageChange={0}
            icon={LuMessageSquare}
            iconBgClass="bg-amber-50/50"
            iconColorClass="text-amber-800"
          />
        </m.div>
      </m.div>

      {/* Main Content Area */}
      <m.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <m.div whileHover={{ scale: 1.01 }} className="lg:col-span-1 bg-white rounded-md border border-gray-200 p-6 flex flex-col hover:shadow-md transition-shadow duration-300">
          <h2 className="text-base font-bold text-[#191c1e] mb-6 font-display">Application Overview</h2>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {/* Animated Donut Chart */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 192 192">
                {/* Background Track */}
                <circle cx="96" cy="96" r="84" fill="transparent" stroke="#f3f4f6" strokeWidth="24" />
                
                {/* New */}
                <m.circle
                  cx="96" cy="96" r="84" fill="transparent" stroke="#2563eb" strokeWidth="24"
                  strokeDasharray="528 528" strokeLinecap="round"
                  initial={{ strokeDashoffset: 528, rotate: 0, originX: "50%", originY: "50%" }}
                  animate={{ strokeDashoffset: isLoading ? 528 : offsetNew }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  onMouseEnter={() => setHoveredSegment('new')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
                
                {/* Reviewed */}
                <m.circle
                  cx="96" cy="96" r="84" fill="transparent" stroke="#22c55e" strokeWidth="24"
                  strokeDasharray="528 528" strokeLinecap="round"
                  initial={{ strokeDashoffset: 528, rotate: rotReviewed, originX: "50%", originY: "50%" }}
                  animate={{ strokeDashoffset: isLoading ? 528 : offsetReviewed }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                  onMouseEnter={() => setHoveredSegment('reviewed')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />

                {/* Shortlisted */}
                <m.circle
                  cx="96" cy="96" r="84" fill="transparent" stroke="#f97316" strokeWidth="24"
                  strokeDasharray="528 528" strokeLinecap="round"
                  initial={{ strokeDashoffset: 528, rotate: rotShortlisted, originX: "50%", originY: "50%" }}
                  animate={{ strokeDashoffset: isLoading ? 528 : offsetShortlisted }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                  onMouseEnter={() => setHoveredSegment('shortlisted')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />

                {/* Other */}
                <m.circle
                  cx="96" cy="96" r="84" fill="transparent" stroke="#9ca3af" strokeWidth="24"
                  strokeDasharray="528 528" strokeLinecap="round"
                  initial={{ strokeDashoffset: 528, rotate: rotOther, originX: "50%", originY: "50%" }}
                  animate={{ strokeDashoffset: isLoading ? 528 : offsetOther }}
                  transition={{ duration: 1, ease: "easeOut", delay: 0.6 }}
                  onMouseEnter={() => setHoveredSegment('other')}
                  onMouseLeave={() => setHoveredSegment(null)}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                />
              </svg>

              <div className="text-center z-10 flex flex-col items-center">
                <m.span 
                  key={`label-${displayData.label}`}
                  className="block text-2xl font-bold text-[#191c1e] font-display"
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {displayData.label}
                </m.span>
                <m.span 
                  key={`val-${displayData.value}`}
                  className="block text-sm text-gray-500"
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  {displayData.value}
                </m.span>
              </div>
            </div>
            
            {/* Chart Legend */}
            <div className="w-full space-y-1 mt-4">
              <div 
                className="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
                onMouseEnter={() => setHoveredSegment('new')}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600 font-medium">New</span>
                </div>
                <span className="text-gray-900 font-semibold">{Math.round(pNew)}%</span>
              </div>
              <div 
                className="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
                onMouseEnter={() => setHoveredSegment('reviewed')}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 font-medium">Reviewed</span>
                </div>
                <span className="text-gray-900 font-semibold">{Math.round(pReviewed)}%</span>
              </div>
              <div 
                className="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
                onMouseEnter={() => setHoveredSegment('shortlisted')}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600 font-medium">Shortlisted</span>
                </div>
                <span className="text-gray-900 font-semibold">{Math.round(pShortlisted)}%</span>
              </div>
              <div 
                className="flex justify-between items-center text-sm cursor-pointer hover:bg-gray-50 p-1.5 rounded transition-colors"
                onMouseEnter={() => setHoveredSegment('other')}
                onMouseLeave={() => setHoveredSegment(null)}
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600 font-medium">Other</span>
                </div>
                <span className="text-gray-900 font-semibold">{Math.round(pOther)}%</span>
              </div>
            </div>
          </div>
        </m.div>

        {/* Table */}
        <div className="lg:col-span-2">
          <RecentApplicationsTable />
        </div>
      </m.div>
    </m.div>
  );
}
