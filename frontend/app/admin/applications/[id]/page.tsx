import { ApplicantHeader } from "@/components/admin/ApplicantHeader";
import { ApplicantOverview } from "@/components/admin/ApplicantOverview";
import { CoverNote } from "@/components/admin/CoverNote";
import { InternalNotes } from "@/components/admin/InternalNotes";
import { DocumentsCard } from "@/components/admin/DocumentsCard";
import { ActivityTimeline } from "@/components/admin/ActivityTimeline";
import { LuStar, LuMessageSquare, LuEye, LuInbox } from "react-icons/lu";

export default function ApplicantDetailPage() {
  const applicantDetails = {
    fullName: "Ariel Whitmore",
    email: "ariel.whitmore@example.com",
    phone: "+61 400 123 456",
    linkedIn: "linkedin.com/in/ariel-whitmore",
    practiceArea: "Civil & Infrastructure",
    location: "Sydney",
    experience: "12 Years",
    dateApplied: "15 Jul 2026",
  };

  const coverNoteContent = `Dear Hiring Team,

I am writing to express my strong interest in the Principal Engineer position within your Civil & Infrastructure practice. With over 12 years of experience managing large-scale infrastructure projects across APAC, I have developed a deep expertise in sustainable concrete structures and advanced tunneling methodologies.

Most recently, I led the structural design for the North West Transit Link, delivering the project 2 months ahead of schedule while reducing material waste by 14%. Furthermore, I am particularly drawn to Hillary Step Solutions' recent pivot towards integrating AI-driven predictive maintenance into infrastructure lifecycles—an area I have actively researched and published on over the past two years.

I welcome the opportunity to discuss how my technical background and leadership experience align with your strategic objectives.

Sincerely,
Ariel Whitmore`;

  const internalNotesData = [
    {
      id: "note-1",
      author: "James Smith",
      role: "Technical Lead",
      date: "17 Jul 2026, 14:30",
      content: "Strong candidate. Her experience on the transit link is highly relevant to our upcoming pipeline. We should fast-track her to a technical interview panel next week.",
      initials: "JS",
    }
  ];

  const activityData = [
    {
      id: "act-1",
      title: "Status changed to Shortlisted",
      date: "18 Jul 2026, 09:15 AM",
      icon: LuStar,
      iconColor: "text-green-600",
      iconBg: "bg-green-100",
    },
    {
      id: "act-2",
      title: "Note added by Admin (James Smith)",
      date: "17 Jul 2026, 02:30 PM",
      icon: LuMessageSquare,
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
    },
    {
      id: "act-3",
      title: "Status changed to Reviewed",
      date: "16 Jul 2026, 11:45 AM",
      icon: LuEye,
      iconColor: "text-gray-600",
      iconBg: "bg-gray-100",
    },
    {
      id: "act-4",
      title: "Application received",
      date: "15 Jul 2026, 08:22 AM",
      icon: LuInbox,
      iconColor: "text-blue-600",
      iconBg: "bg-blue-100",
    },
  ];

  return (
    <div className="max-w-[1280px]">
      <ApplicantHeader 
        name="Ariel Whitmore" 
        status="SHORTLISTED" 
        role="Principal Engineer" 
        applicantId="APP-2026-892" 
      />
      
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Main Content) */}
        <div className="lg:col-span-8 flex flex-col">
          <ApplicantOverview details={applicantDetails} />
          <CoverNote content={coverNoteContent} />
          <InternalNotes notes={internalNotesData} />
        </div>
        
        {/* Right Column (Sidebar) */}
        <div className="lg:col-span-4 flex flex-col">
          <DocumentsCard />
          <ActivityTimeline activities={activityData} />
        </div>
      </div>
    </div>
  );
}
