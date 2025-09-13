"use client";

import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/Sidebar";
import { usePathname } from "next/navigation";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const authPages = ["/login", "/register", "/"];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isAuthPage = authPages.includes(pathname);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          {isAuthPage ? (
            <>
              {children}
              <Toaster />
            </>
          ) : (
            <SidebarProvider>
              <AppSidebar />
              <main className="flex-1">
                <SidebarTrigger />
                {children}
              </main>
              <Toaster />
            </SidebarProvider>
          )}
        </AuthProvider>
      </body>
    </html>
  );
}
