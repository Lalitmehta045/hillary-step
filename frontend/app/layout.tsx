import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
