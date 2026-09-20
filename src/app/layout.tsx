import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { HOME_PAGE } from "@/lib/guides";
import { getSiteUrl, SITE_NAME } from "@/lib/site";
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
  metadataBase: new URL(getSiteUrl()),
  title: {
    default: SITE_NAME,
    template: `%s · ${SITE_NAME}`,
  },
  description: HOME_PAGE.description,
  applicationName: SITE_NAME,
  keywords: [
    "Islamic inheritance",
    "Faraid",
    "inheritance calculator",
    "heir shares",
    "mirath",
    "wasiyyah",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    title: SITE_NAME,
    description:
      "A step-by-step calculator for Islamic inheritance shares. For education only.",
    type: "website",
    siteName: SITE_NAME,
    url: "/",
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
