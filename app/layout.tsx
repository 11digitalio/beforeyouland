import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Before You Land | Tokyo arrival checklist",
  description:
    "A destination-specific arrival-prep dashboard for first-time solo travelers landing in Tokyo."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html data-scroll-behavior="smooth" lang="en">
      <body>{children}</body>
    </html>
  );
}
