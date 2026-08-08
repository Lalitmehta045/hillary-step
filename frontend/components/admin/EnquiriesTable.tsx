"use client";

import { LuSearch, LuChevronDown, LuCalendar, LuEye } from "react-icons/lu";

const mockEnquiries = [
  {
    id: "enq-1",
    name: "Eleanor Vance",
    email: "e.vance@structural.co",
    initials: "EV",
    organization: "Structural Engineering",
    region: "North America",
    dateReceived: "Oct 24, 2023",
    status: "New",
  },
  {
    id: "enq-2",
    name: "Marcus Thorne",
    email: "m.thorne@apexbuild.uk",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    organization: "Apex Build Group",
    region: "Europe",
    dateReceived: "Oct 23, 2023",
    status: "Read",
  },
  {
    id: "enq-3",
    name: "Sarah Rahim",
    email: "s.rahim@globalinfra.ae",
    initials: "SR",
    organization: "Global Infrastructure",
    region: "Middle East",
    dateReceived: "Oct 21, 2023",
    status: "Responded",
  },
  {
    id: "enq-4",
    name: "James Chen",
    email: "j.chen@pacific-works.com",
    initials: "JC",
    organization: "Pacific Works",
    region: "APAC",
    dateReceived: "Oct 20, 2023",
    status: "New",
  }
];

const StatusBadge = ({ status }: { status: string }) => {
  let bg = "bg-gray-100";
  let text = "text-gray-600";

  switch (status.toLowerCase()) {
    case "new":
      bg = "bg-blue-50";
      text = "text-blue-600";
      break;
    case "read":
      bg = "bg-gray-100";
      text = "text-gray-600";
      break;
    case "responded":
      bg = "bg-green-50";
      text = "text-green-600";
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${bg} ${text}`}>
      {status}
    </span>
  );
};

export function EnquiriesTable() {
  return (
    <div className="bg-white rounded-md border border-gray-200">
      {/* Table Filters & Search */}
      <div className="p-6 flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div className="relative w-full md:w-[400px]">
          <LuSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text" 
            placeholder="Search enquiries..." 
            className="w-full pl-9 pr-4 py-2.5 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white shadow-sm"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-colors">
            Region: All
            <LuChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-colors">
            Status: All
            <LuChevronDown className="w-3 h-3 text-gray-400" />
          </button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-md text-xs font-semibold text-gray-700 bg-white shadow-sm hover:bg-gray-50 transition-colors">
            <LuCalendar className="w-3.5 h-3.5 text-gray-500" />
            Date Range
          </button>
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
            {mockEnquiries.map((enq) => (
              <tr 
                key={enq.id} 
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group"
              >
                <td className="py-5 px-6 text-center">
                  <input type="checkbox" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                </td>
                <td className="py-5 pr-6">
                  <div className="flex items-center gap-4">
                    {enq.avatar ? (
                      <img src={enq.avatar} alt={enq.name} className="w-9 h-9 rounded-full object-cover bg-gray-200" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-600">
                        {enq.initials}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-semibold text-gray-900 leading-tight">{enq.name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{enq.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-5 px-6 text-xs text-gray-900 font-medium whitespace-nowrap">
                  {enq.organization}
                </td>
                <td className="py-5 px-6 text-xs text-gray-500 whitespace-nowrap">
                  {enq.region}
                </td>
                <td className="py-5 px-6 text-xs text-gray-500 whitespace-nowrap">
                  {enq.dateReceived}
                </td>
                <td className="py-5 px-6 whitespace-nowrap">
                  <StatusBadge status={enq.status} />
                </td>
                <td className="py-5 pl-6 pr-8 text-right whitespace-nowrap">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors p-1.5 rounded-md hover:bg-blue-50 inline-flex items-center justify-center">
                    <LuEye className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination Footer */}
      <div className="p-6 flex justify-between items-center text-xs font-medium text-gray-500 border-t border-gray-100 bg-white rounded-b-md">
        <span>Showing 1 to 4 of 89 entries</span>
        <div className="flex items-center gap-1 border border-gray-200 rounded-md p-0.5 bg-white shadow-sm">
          <button className="p-1.5 hover:text-gray-900 transition-colors">{"<"}</button>
          <button className="w-7 h-7 flex items-center justify-center bg-[#061a3d] text-white font-semibold rounded-[4px]">1</button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-[4px] text-gray-700">2</button>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-[4px] text-gray-700">3</button>
          <span className="px-1 text-gray-400">...</span>
          <button className="w-7 h-7 flex items-center justify-center hover:bg-gray-50 rounded-[4px] text-gray-700">9</button>
          <button className="p-1.5 hover:text-gray-900 transition-colors">{">"}</button>
        </div>
      </div>
    </div>
  );
}
