import { ApplicationsListTable } from "@/components/admin/ApplicationsListTable";
import { LuDownload, LuPlus } from "react-icons/lu";

export default function ApplicationsManagementPage() {
  return (
    <div className="max-w-[1280px]">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#061a3d] mb-1">Applications</h1>
          <p className="text-sm text-gray-500 font-medium">248 Total Applicants</p>
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
    </div>
  );
}
