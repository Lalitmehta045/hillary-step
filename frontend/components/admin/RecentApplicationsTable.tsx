import Link from "next/link";
import Image from "next/image";

const mockApplications = [
  {
    id: "1",
    name: "Ariel Whitmore",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d", // Example placeholder
    practice: "Civil &\nInfrastructure",
    experience: "12 Years",
    location: "Sydney,\nAU",
    status: "Interview",
  },
  {
    id: "2",
    name: "John Doe",
    avatar: "",
    initials: "JD",
    practice: "Structural\nEngineering",
    experience: "8 Years",
    location: "London,\nUK",
    status: "New",
  },
  {
    id: "3",
    name: "Elena Smith",
    avatar: "",
    initials: "ES",
    practice: "Project\nManagement",
    experience: "15 Years",
    location: "New\nYork, US",
    status: "Selected",
  },
];

const StatusBadge = ({ status }: { status: string }) => {
  let bg = "bg-gray-100";
  let text = "text-gray-600";

  switch (status.toLowerCase()) {
    case "interview":
      bg = "bg-orange-50";
      text = "text-orange-600";
      break;
    case "new":
      bg = "bg-blue-50";
      text = "text-blue-600";
      break;
    case "selected":
      bg = "bg-green-50";
      text = "text-green-600";
      break;
  }

  return (
    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold tracking-wide ${bg} ${text}`}>
      {status}
    </span>
  );
};

export function RecentApplicationsTable() {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-gray-900">Recent Applications</h2>
        <Link href="/admin/applications" className="text-xs font-semibold text-blue-600 hover:underline">
          View All
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="py-3 pr-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Applicant</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Practice</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Experience</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Location</th>
              <th className="py-3 px-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Status</th>
              <th className="py-3 pl-4 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map((app) => (
              <tr key={app.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors group">
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    {app.avatar ? (
                      <img src={app.avatar} alt={app.name} className="w-8 h-8 rounded-full object-cover bg-gray-200" />
                    ) : (
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-semibold text-gray-500">
                        {app.initials}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{app.name}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs text-gray-500 whitespace-pre-line leading-relaxed">
                  {app.practice}
                </td>
                <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                  {app.experience}
                </td>
                <td className="py-4 px-4 text-xs text-gray-500 whitespace-pre-line leading-relaxed">
                  {app.location}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={app.status} />
                </td>
                <td className="py-4 pl-4 whitespace-nowrap">
                  {/* Invisible by default, shown on hover like in some admin panels, or just a simple button */}
                  <button className="text-xs font-medium text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
