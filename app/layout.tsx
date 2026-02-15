import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "School Credit Counter",
  description: "Upload your course list or transcript to calculate credits",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}

