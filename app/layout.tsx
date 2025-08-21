import "./globals.css";
import type { Metadata } from "next";
import BackgroundFX from "@/components/background-fx";
import SiteFooter from "@/components/SiteFooter";

export const metadata: Metadata = {
  title: "CERTHUB",
  description: "Decentralized, verifiable credentials and certificates",
   icons: {
    icon: "/favicon.svg",
      }   //
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body
        className="min-h-screen antialiased text-white"
        style={{
          background:
            "linear-gradient(180deg, #0b0b0d 0%, #0f1013 30%, #121316 60%, #17181c 100%)",
        }}
      >
        {/* Global futuristic background layers (stars + aurora + icons) */}
        <BackgroundFX />

        {/* Page content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          <div className="flex-1">{children}</div>
          <SiteFooter />
        </div>
      </body>
    </html>
  );
}
