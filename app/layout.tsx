import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

import { LoadingProvider } from "@/contexts/LoadingContext";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "ICCICN '26 Registration",
  description: "International Conference on Computational Intelligence & Computer Networks",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-slate-50 text-slate-900 antialiased bg-grid-pattern",
          jakarta.className
        )}
      >
        <LoadingProvider>
          <div className="fixed inset-0 bg-gradient-to-b from-white/80 via-white/50 to-slate-50/80 pointer-events-none -z-10" />
          {children}
        </LoadingProvider>
      </body>
    </html>
  );
}
