"use client";

import { ApplicantHeader } from "@/components/admin/ApplicantHeader";
import { ApplicantOverview } from "@/components/admin/ApplicantOverview";
import { CoverNote } from "@/components/admin/CoverNote";
import { InternalNotes } from "@/components/admin/InternalNotes";
import { DocumentsCard } from "@/components/admin/DocumentsCard";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { LuStar, LuMessageSquare, LuEye, LuInbox } from "react-icons/lu";
import { useEffect, useState } from "react";
import { applicationsApi } from "@/lib/api/applications";
import { Application, InternalNote, Document, ActivityLog } from "@/lib/api/types";
import { use } from "react";

export default function ApplicantDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { id } = resolvedParams;
  const [application, setApplication] = useState<Application & { documents: Document[]; notes: InternalNote[] } | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [appRes, actRes] = await Promise.all([
          applicationsApi.getApplicationDetail(id),
          applicationsApi.getActivity(id)
        ]);
        setApplication(appRes);
        setActivities(actRes);
      } catch (err) {
        console.error("Failed to load application details", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center text-gray-500">Loading application details...</div>;
  }

  if (!application) {
    return <div className="p-8 text-center text-red-500">Application not found</div>;
  }

  const applicantDetails = {
    fullName: application.fullName,
    email: application.email,
    phone: application.phone || "N/A",
    linkedIn: application.linkedinProfile || "N/A",
    practiceArea: application.practice || "N/A",
    location: application.preferredLocation || "N/A",
    experience: application.experienceYears ? `${application.experienceYears} Years` : "N/A",
    dateApplied: new Date(application.createdAt).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
  };

  const coverNoteContent = application.coverNote || "No cover letter provided.";

  const internalNotesData = application.notes || [];

  const activityData = activities.map((act) => {
    let icon = LuInbox;
    let iconColor = "text-blue-600";
    let iconBg = "bg-blue-100";

    if (act.action === "STATUS_CHANGE") {
      icon = act.details?.newStatus === "SHORTLISTED" ? LuStar : LuEye;
      iconColor = act.details?.newStatus === "SHORTLISTED" ? "text-green-600" : "text-gray-600";
      iconBg = act.details?.newStatus === "SHORTLISTED" ? "bg-green-100" : "bg-gray-100";
    } else if (act.action === "NOTE_ADDED") {
      icon = LuMessageSquare;
      iconColor = "text-gray-600";
      iconBg = "bg-gray-100";
    }

    return {
      id: act.id,
      title: act.details?.message || act.action,
      date: new Date(act.createdAt).toLocaleString("en-GB", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      icon,
      iconColor,
      iconBg,
    };
  });

  return (
    <div className="max-w-[1280px]">
      <ApplicantHeader 
        name={application.fullName} 
        status={application.status} 
        role={application.practice || "Application"} 
        applicantId={application.id} 
      />
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 flex flex-col">
          <ApplicantOverview details={applicantDetails} />
          <CoverNote content={coverNoteContent} />
          <InternalNotes notes={internalNotesData} applicationId={application.id} />
        </div>
        
        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 flex flex-col">
          <DocumentsCard documents={application.documents} applicationId={application.id} />
          <ActivityTimeline activities={activityData} />
        </div>
      </div>
    </div>
  );
}
