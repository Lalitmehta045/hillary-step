import type { Metadata } from "next";
import { Hanken_Grotesk } from "next/font/google";
import "./globals.css";
import { SmoothScroll } from "@/components/SmoothScroll";
import { CookieConsent } from "@/components/site/CookieConsent";
import { BackToTop } from "@/components/ui/BackToTop";

const hankenGrotesk = Hanken_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-hanken",
  display: "swap",
});

const title = "Hillary Step Solutions — Technology, Talent, Global Growth";
const description =
  "A global technology and workforce partner delivering AI, software engineering, digital transformation, international staffing, and civil infrastructure.";

export const metadata: Metadata = {
  title,
  description,
  icons: {
    icon: "/favicon.png",
  },
  openGraph: {
    title,
    description,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={hankenGrotesk.variable}>
      <body className="antialiased font-sans">
        <SmoothScroll>{children}</SmoothScroll>
        {/* <CookieConsent /> */}
        <BackToTop />
      </body>
    </html>
  );
}
