import type { Metadata, Viewport } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import ServiceWorkerRegister from "@/components/ServiceWorkerRegister";

// Primary site URL for metadataBase, Open Graph and canonical links.
// comms.carephrase.com is the production domain; NEXT_PUBLIC_SITE_URL can
// override it (e.g. for preview/staging deployments).
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://comms.carephrase.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "CarePhrase Communication Academy",
  description:
    "AI-powered communication training for UK health and social care staff.",
  openGraph: {
    title: "CarePhrase Communication Academy",
    description:
      "AI-powered communication training for UK health and social care staff.",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "CarePhrase Comms",
  },
  // Legacy iOS standalone flag (older Safari relies on this; Next emits the
  // modern `mobile-web-app-capable` from appleWebApp.capable).
  other: {
    "apple-mobile-web-app-capable": "yes",
  },
};

export const viewport: Viewport = {
  themeColor: "#1d5cf5",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="flex min-h-screen flex-col antialiased">
        <ServiceWorkerRegister />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
