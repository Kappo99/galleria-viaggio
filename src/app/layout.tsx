import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import LogoutButton from "@/components/LogoutButton";
import AuthGuard from "@/components/AuthGuard";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Galleria di viaggio",
  description: "Galleria di viaggio realizzata con Next.js e Supabase da Andrea Cappone per il colloquio tecnico con Belka (Cosmico)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="it">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <LogoutButton />
        <AuthGuard>
          {children}
        </AuthGuard>
      </body>
    </html>
  );
}
