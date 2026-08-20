import { LuFileText, LuEye, LuDownload } from "react-icons/lu";
import { Document } from "@/lib/api/types";
import { applicationsApi } from "@/lib/api/applications";

export function DocumentsCard({ documents = [], applicationId }: { documents: Document[]; applicationId: string }) {
  const handleDownload = async (docId: string, filename: string) => {
    try {
      const { url } = await applicationsApi.getDownloadUrl(applicationId, docId);
      // Open in new tab which will trigger download for S3 presigned URLs
      window.open(url, '_blank');
    } catch (err) {
      console.error("Failed to get download URL", err);
      alert("Failed to download document");
    }
  };

  return (
    <div className="bg-white rounded-md border border-gray-200 p-8 mb-6">
      <h2 className="text-base font-bold text-gray-900 mb-6">Documents ({documents.length})</h2>
      
      <div className="space-y-4">
        {documents.length === 0 ? (
          <p className="text-sm text-gray-500 italic">No documents attached.</p>
        ) : (
          documents.map(doc => (
            <div key={doc.id} className="border border-gray-100 rounded-md p-4 flex gap-4">
              <div className="w-12 h-12 bg-red-50 rounded flex items-center justify-center shrink-0 text-red-500">
                <LuFileText className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                  {doc.fileName}
                </p>
                <p className="text-xs text-gray-400 mb-3">{(doc.fileSize / 1024).toFixed(0)} KB</p>
                <div className="flex items-center gap-4 text-xs font-semibold">
                  <button 
                    onClick={() => handleDownload(doc.id, doc.fileName)}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <LuEye className="w-4 h-4" />
                    Preview
                  </button>
                  <button 
                    onClick={() => handleDownload(doc.id, doc.fileName)}
                    className="flex items-center gap-1.5 text-blue-600 hover:underline"
                  >
                    <LuDownload className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
