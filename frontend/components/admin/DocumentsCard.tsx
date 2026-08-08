import { LuFileText, LuEye, LuDownload } from "react-icons/lu";

export function DocumentsCard() {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-8 mb-6">
      <h2 className="text-base font-bold text-gray-900 mb-6">Documents</h2>
      
      <div className="border border-gray-100 rounded-md p-4 flex gap-4">
        <div className="w-12 h-12 bg-red-50 rounded flex items-center justify-center shrink-0 text-red-500">
          <LuFileText className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate mb-1">
            Resume_A_Whitmore_2026.pdf
          </p>
          <p className="text-xs text-gray-400 mb-3">PDF · 1.2 MB</p>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <button className="flex items-center gap-1.5 text-blue-600 hover:underline">
              <LuEye className="w-4 h-4" />
              Preview
            </button>
            <button className="flex items-center gap-1.5 text-blue-600 hover:underline">
              <LuDownload className="w-4 h-4" />
              Download
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
