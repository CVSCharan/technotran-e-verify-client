import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AdminProvider } from "@/context/AdminContext";
import { VendorProvider } from "@/context/VendorContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Technotran E-Verify",
  description: "Created by CVS CHARAN",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AdminProvider>
          <VendorProvider>{children}</VendorProvider>
        </AdminProvider>
      </body>
    </html>
  );
}
