import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://carephrase-communication-academy.vercel.app"),
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
