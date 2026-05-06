import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { Toaster } from "sonner";
import CommandPalette from "@/components/CommandPalette";
import { AuthProvider } from "@/context/auth-context";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Zariva Africa Properties Ltd",
  description: "Premium property management for landlords and tenants across Kenya",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn(jakarta.variable)}>
      <body className="antialiased" style={{ fontFamily: "var(--font-jakarta, system-ui, sans-serif)" }}>
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
      </body>
    </html>
  );
}
