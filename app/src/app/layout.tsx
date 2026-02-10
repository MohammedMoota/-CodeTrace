import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
});

export const metadata: Metadata = {
  title: "CodeTrace - Intelligent Debugging",
  description: "AI-powered video analysis platform for root cause detection in software development workflow.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
  icons: {
    icon: "/favicon.ico", // Assuming default exists or will be added
  },
  openGraph: {
    title: "CodeTrace - Intelligent Debugging",
    description: "AI-powered video analysis for root cause detection.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable}`}>
        {children}
        <Toaster position="top-right" theme="dark" />
      </body>
    </html>
  );
}
