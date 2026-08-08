import { EnquiriesTable } from "@/components/admin/EnquiriesTable";
import { LuDownload } from "react-icons/lu";

export default function EnquiriesPage() {
  return (
    <div className="max-w-[1020px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4 pt-16 lg:pt-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#061a3d] mb-1 leading-tight">Contact Enquiries</h1>
          <p className="text-[13px] text-gray-500 font-medium">Manage and respond to inbound communication.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            89 Total Enquiries
          </span>
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm">
            <LuDownload className="w-3.5 h-3.5" />
            Export CSV
          </button>
        </div>
      </div>
      
      <EnquiriesTable />
    </div>
  );
}
