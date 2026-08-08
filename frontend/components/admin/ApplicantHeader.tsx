import Link from "next/link";
import { LuArrowLeft, LuPencil, LuDownload, LuTrash2 } from "react-icons/lu";

interface ApplicantHeaderProps {
  name: string;
  status: string;
  role: string;
  applicantId: string;
}

export function ApplicantHeader({ name, status, role, applicantId }: ApplicantHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
      <div>
        <Link 
          href="/admin/applications" 
          className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:underline mb-4"
        >
          <LuArrowLeft className="w-4 h-4" />
          Back to Applications
        </Link>
        
        <div className="flex items-center gap-4 mb-1">
          <h1 className="text-3xl font-bold text-gray-900">{name}</h1>
          <span className="px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-green-100 text-green-700">
            {status}
          </span>
        </div>
        
        <p className="text-sm text-gray-500 font-medium">
          Applied for {role} · ID: {applicantId}
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors">
          <LuPencil className="w-4 h-4" />
          Edit
        </button>
        <button className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#061a3d] text-white text-sm font-semibold hover:bg-blue-900 transition-colors">
          <LuDownload className="w-4 h-4" />
          Resume
        </button>
        <button className="inline-flex items-center justify-center p-2 rounded-md border border-red-200 text-red-500 hover:bg-red-50 transition-colors">
          <LuTrash2 className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
