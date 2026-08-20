import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { applicationsApi } from "@/lib/api/applications";
import { Application } from "@/lib/api/types";
import { useRouter } from "next/navigation";

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
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await applicationsApi.getAdminApplications({ pageSize: 5 });
        setApplications(res.data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleRowClick = (id: string) => {
    router.push(`/admin/applications/${id}`);
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 p-6 hover:shadow-md transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-base font-bold text-[#191c1e] font-display">Recent Applications</h2>
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
            {isLoading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                  Loading applications...
                </td>
              </tr>
            ) : applications.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-sm text-gray-500">
                  No applications found.
                </td>
              </tr>
            ) : applications.map((app) => (
              <tr 
                key={app.id} 
                onClick={() => handleRowClick(app.id)}
                className="border-b border-gray-50 hover:bg-blue-50/30 transition-colors duration-200 group cursor-pointer"
              >
                <td className="py-4 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                      {app.fullName.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">{app.fullName}</span>
                  </div>
                </td>
                <td className="py-4 px-4 text-xs text-gray-500 whitespace-pre-line leading-relaxed">
                  {app.practice || "-"}
                </td>
                <td className="py-4 px-4 text-xs text-gray-500 whitespace-nowrap">
                  {app.experienceYears || "-"}
                </td>
                <td className="py-4 px-4 text-xs text-gray-500 whitespace-pre-line leading-relaxed">
                  {app.preferredLocation || "-"}
                </td>
                <td className="py-4 px-4 whitespace-nowrap">
                  <StatusBadge status={app.status} />
                </td>
                <td className="py-4 pl-4 whitespace-nowrap">
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
