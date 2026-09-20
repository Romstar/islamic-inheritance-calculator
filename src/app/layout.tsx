import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Islamic Inheritance Calculator",
    template: "%s · Islamic Inheritance Calculator",
  },
  description:
    "Calculate Islamic inheritance shares for surviving relatives. Covers fixed shares, residue, blocking, 'awl, and radd. For education only.",
  applicationName: "Islamic Inheritance Calculator",
  keywords: [
    "Islamic inheritance",
    "Faraid",
    "inheritance calculator",
    "heir shares",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: "Islamic Inheritance Calculator",
    description:
      "A step-by-step calculator for Islamic inheritance shares. For education only.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#1c5e3a",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteHeader />
        <div className="flex flex-1 flex-col">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
