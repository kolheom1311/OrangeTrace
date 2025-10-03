import "./globals.css";
import Script from "next/script";
import { Inter } from "next/font/google";
import { ReactNode } from "react";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { Toaster } from "@/components/ui/sonner";
import { NotificationProvider } from "@/contexts/NotificationContext";
import { SpeedInsights } from "@vercel/speed-insights/next";
import ClientLayout from "@/contexts/ClientLayout";
import { LanguageProvider } from "@/contexts/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "OrangeTrace",
  description: "A sustainable agri-supply platform",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <NotificationProvider>
              <LanguageProvider>
                <Header />
                <main className="min-h-screen relative">
                  <ClientLayout>{children}</ClientLayout>
                  <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js" />
                  <Toaster richColors />
                </main>
                <Footer />
              </LanguageProvider>
            </NotificationProvider>
          </AuthProvider>
        </ThemeProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
