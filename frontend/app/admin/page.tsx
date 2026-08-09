import { KpiCard } from "@/components/admin/KpiCard";
import { RecentApplicationsTable } from "@/components/admin/RecentApplicationsTable";
import { 
  LuFileText, 
  LuBadgeCheck, 
  LuStar, 
  LuMessageSquare 
} from "react-icons/lu";

export default function AdminDashboardPage() {
  return (
    <div className="max-w-[1020px]">
      <h1 className="text-sm font-bold text-[#191c1e] mb-6 font-display">Dashboard</h1>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <KpiCard
          title="Total Applications"
          value="2,482"
          percentageChange={12}
          icon={LuFileText}
          iconBgClass="bg-blue-50"
          iconColorClass="text-blue-600"
        />
        <KpiCard
          title="New Applications"
          value="156"
          percentageChange={5}
          icon={LuBadgeCheck}
          iconBgClass="bg-green-50"
          iconColorClass="text-green-600"
        />
        <KpiCard
          title="Shortlisted Candidates"
          value="42"
          percentageChange={-2}
          icon={LuStar}
          iconBgClass="bg-orange-50"
          iconColorClass="text-orange-500"
        />
        <KpiCard
          title="Contact Enquiries"
          value="89"
          percentageChange={18}
          icon={LuMessageSquare}
          iconBgClass="bg-amber-50/50"
          iconColorClass="text-amber-800"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart Placeholder */}
        <div className="lg:col-span-1 bg-white rounded-md border border-gray-200 p-6 flex flex-col">
          <h2 className="text-base font-bold text-[#191c1e] mb-6 font-display">Application Overview</h2>
          <div className="flex-1 flex flex-col items-center justify-center min-h-[300px]">
            {/* Fake Donut Chart Center */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center">
              <div className="absolute inset-0 border-[24px] border-gray-100 rounded-full"></div>
              {/* This would be a real chart in production */}
              <div className="text-center z-10">
                <span className="block text-2xl font-bold text-[#191c1e] font-display">Total</span>
                <span className="block text-sm text-gray-500">2,482</span>
              </div>
            </div>
            
            {/* Chart Legend */}
            <div className="w-full space-y-3 mt-4">
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="text-gray-600 font-medium">New</span>
                </div>
                <span className="text-gray-900 font-semibold">45%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                  <span className="text-gray-600 font-medium">Reviewed</span>
                </div>
                <span className="text-gray-900 font-semibold">25%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                  <span className="text-gray-600 font-medium">Shortlisted</span>
                </div>
                <span className="text-gray-900 font-semibold">15%</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                  <span className="text-gray-600 font-medium">Other</span>
                </div>
                <span className="text-gray-900 font-semibold">15%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="lg:col-span-2">
          <RecentApplicationsTable />
        </div>
      </div>
    </div>
  );
}
