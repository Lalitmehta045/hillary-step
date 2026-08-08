import { LuExternalLink, LuMapPin } from "react-icons/lu";

interface ApplicantDetails {
  fullName: string;
  email: string;
  phone: string;
  linkedIn: string;
  practiceArea: string;
  location: string;
  experience: string;
  dateApplied: string;
}

export function ApplicantOverview({ details }: { details: ApplicantDetails }) {
  return (
    <div className="bg-white rounded-md border border-gray-200 p-8 mb-6">
      <h2 className="text-lg font-bold text-gray-900 mb-6">Applicant Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Full Name</p>
          <p className="text-sm font-semibold text-gray-900">{details.fullName}</p>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Email Address</p>
          <a href={`mailto:${details.email}`} className="text-sm font-semibold text-blue-600 hover:underline">
            {details.email}
          </a>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Phone Number</p>
          <p className="text-sm font-semibold text-gray-900">{details.phone}</p>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">LinkedIn</p>
          <a 
            href={`https://${details.linkedIn}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline"
          >
            {details.linkedIn}
            <LuExternalLink className="w-3 h-3" />
          </a>
        </div>
        
        <div className="md:col-span-2 my-2">
          <hr className="border-gray-100" />
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Practice Area</p>
          <p className="text-sm font-semibold text-gray-900">{details.practiceArea}</p>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Preferred Location</p>
          <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
            <LuMapPin className="w-4 h-4 text-gray-400" />
            {details.location}
          </div>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Experience</p>
          <p className="text-sm font-semibold text-gray-900">{details.experience}</p>
        </div>
        
        <div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Date Applied</p>
          <p className="text-sm font-semibold text-gray-900">{details.dateApplied}</p>
        </div>
      </div>
    </div>
  );
}
