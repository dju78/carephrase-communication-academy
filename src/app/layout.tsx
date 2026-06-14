import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

// Primary site URL. Defaults to the Vercel URL; set NEXT_PUBLIC_SITE_URL in
// Vercel to https://comms.carephrase.com once the custom domain is live —
// metadataBase and OG image URLs then follow with no code change.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "https://carephrase-communication-academy.vercel.app";

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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="flex min-h-screen flex-col antialiased">
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
