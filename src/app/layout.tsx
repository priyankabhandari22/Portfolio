import type { Metadata } from "next";
import { Geist, Orbitron, Rajdhani, Share_Tech_Mono } from "next/font/google";
import BootScreen from "@/components/BootScreen";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  preload: false,
});

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const rajdhani = Rajdhani({
  variable: "--font-rajdhani",
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  preload: false,
});

const shareTechMono = Share_Tech_Mono({
  variable: "--font-share-tech-mono",
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Priyanka Bhandari | Full Stack Developer",
  description:
    "Premium portfolio of Priyanka Bhandari — Full Stack Developer, MERN Developer & Problem Solver. Building scalable, modern web applications.",
  keywords: [
    "Priyanka Bhandari",
    "Full Stack Developer",
    "MERN Developer",
    "Portfolio",
    "Web Developer",
    "React",
    "Next.js",
  ],
  openGraph: {
    title: "Priyanka Bhandari | Full Stack Developer",
    description:
      "Full Stack Developer specializing in building scalable, modern web applications.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${orbitron.variable} ${rajdhani.variable} ${shareTechMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <BootScreen />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
