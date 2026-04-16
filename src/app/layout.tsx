import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Syne, DM_Sans, DM_Mono } from "next/font/google";
import { GlobalNav } from "@/components/global-nav";

const syne = Syne({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-heading",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-body",
});

const dmMono = DM_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "TestLift - AI test automation",
  description: "Turn manual test cases into Selenium scripts in minutes.",
  other: {
    "color-scheme": "dark",
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" style={{ colorScheme: "dark" }}>
      <body className={`${syne.variable} ${dmSans.variable} ${dmMono.variable} min-h-full antialiased`}>
        <GlobalNav />
        <div className="pt-14">{children}</div>
      </body>
    </html>
  );
}
