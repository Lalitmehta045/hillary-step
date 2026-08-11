"use client";

import { Navbar } from "@/components/site/Navbar";
import { Footer } from "@/components/site/Footer";
import { GlobalStaffingContent } from "@/components/site/GlobalStaffingContent";

export default function PostAJobPage() {
  return (
    <div className="min-h-screen w-full bg-white font-display flex flex-col">
      <Navbar />
      <div className="flex-1 mx-auto w-full max-w-[1210px] px-[32px] max-md:px-[16px] pb-[96px]">
        <GlobalStaffingContent isModal={false} />
      </div>
      <Footer />
    </div>
  );
}
