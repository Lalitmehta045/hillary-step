"use client";

import { EnquiriesTable, resolveRegion } from "@/components/admin/EnquiriesTable";
import { LuDownload } from "react-icons/lu";
import { useEffect, useState } from "react";
import { contactApi } from "@/lib/api/contact";
import { Enquiry } from "@/lib/api/types";

export default function EnquiriesPage() {
  const [totalCount, setTotalCount] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    contactApi.getAdminEnquiries({ pageSize: 1 })
      .then(res => setTotalCount(res.meta.total))
      .catch(console.error);
  }, []);

  const handleExportCSV = async () => {
    if (isExporting) return;
    setIsExporting(true);

    try {
      // Fetch all enquiries in batches (using existing paginated API)
      const allEnquiries: Enquiry[] = [];
      const batchSize = 100;
      let currentPage = 1;
      let totalPages = 1;

      while (currentPage <= totalPages) {
        const res = await contactApi.getAdminEnquiries({
          page: currentPage,
          pageSize: batchSize,
        });
        allEnquiries.push(...res.data);
        totalPages = res.meta.totalPages;
        currentPage++;
      }

      // Build CSV
      const headers = [
        "Name",
        "Email",
        "Phone",
        "Organization",
        "Region",
        "Message",
        "Date Received",
        "Status",
      ];

      const escapeCSV = (value: string): string => {
        if (!value) return "";
        // Wrap in quotes if contains comma, quote, or newline
        if (/[",\n\r]/.test(value)) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      };

      const rows = allEnquiries.map((enq) => [
        escapeCSV(enq.name || enq.contactPerson || ""),
        escapeCSV(enq.email || ""),
        escapeCSV(enq.phone || ""),
        escapeCSV(enq.organization || enq.companyName || ""),
        escapeCSV(resolveRegion(enq)),
        escapeCSV(enq.message || ""),
        escapeCSV(
          new Date(enq.createdAt).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        ),
        escapeCSV(enq.status.replace(/_/g, " ")),
      ]);

      const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

      // Trigger download
      const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to export CSV", err);
      alert("Failed to export enquiries. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="max-w-[1020px] mx-auto w-full">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-8 gap-4 pt-16 lg:pt-0">
        <div>
          <h1 className="text-[28px] font-bold text-[#061a3d] mb-1 leading-tight">Contact Enquiries</h1>
          <p className="text-[13px] text-gray-500 font-medium">Manage and respond to inbound communication.</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-xs font-semibold">
            {totalCount} Total Enquiries
          </span>
          <button
            onClick={handleExportCSV}
            disabled={isExporting}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 text-xs font-bold text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-sm ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            <LuDownload className={`w-3.5 h-3.5 ${isExporting ? "animate-bounce" : ""}`} />
            {isExporting ? "Exporting..." : "Export CSV"}
          </button>
        </div>
      </div>
      
      <EnquiriesTable />
    </div>
  );
}
