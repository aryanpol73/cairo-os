import type { Metadata, Viewport } from "next";
import "./globals.css";

// 1. Force the viewport to behave like a native mobile app
export const viewport: Viewport = {
  themeColor: "#030305",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents annoying zoom when tapping buttons quickly
};

// 2. Link the manifest and tell Apple devices to hide the Safari URL bar
export const metadata: Metadata = {
  title: "Cairo OS | Orchestration Engine",
  description: "Autonomous AI Orchestration Engine",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Cairo OS",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-[#030305] text-white overflow-hidden">
        {children}
      </body>
    </html>
  );
}