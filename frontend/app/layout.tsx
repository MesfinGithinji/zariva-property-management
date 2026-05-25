import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Toaster } from "sonner";
import CommandPalette from "@/components/CommandPalette";
import { AuthProvider } from "@/context/auth-context";
import { MotionConfig } from "framer-motion";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zariva Africa Properties Ltd",
  description: "Premium property management for landlords and tenants across Kenya",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#1A3626",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(jakarta.variable)}>
      <body className="antialiased" style={{ fontFamily: "var(--font-jakarta, system-ui, sans-serif)" }}>
        <MotionConfig reducedMotion="user">
          <AuthProvider>
            <SmoothScroll>
              {children}
            </SmoothScroll>
          </AuthProvider>
          <CommandPalette />
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#1A3626",
                color: "#F5EDD6",
                border: "1px solid rgba(201, 168, 67, 0.3)",
                fontFamily: "var(--font-jakarta)",
              },
            }}
          />
        </MotionConfig>
      </body>
    </html>
  );
}
