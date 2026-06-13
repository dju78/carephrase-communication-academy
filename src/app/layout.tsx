import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CarePhrase Communication Academy",
  description:
    "AI-powered communication training for UK health and social care staff.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
