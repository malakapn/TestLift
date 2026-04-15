import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "TestLift",
  description: "Upload manual test cases and generate Selenium automation.",
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
