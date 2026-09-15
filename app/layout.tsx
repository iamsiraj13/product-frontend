import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Crate & Barrel | Luxury Living for Lifetime Agents",
  description: "Exclusive luxury interior furniture solutions and staging packages tailored for top-performing real estate professionals.",
  keywords: ["Crate & Barrel", "Luxury Furniture", "Real Estate Staging", "Lifetime Agents", "Interior Design"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-[#FAF9F6] text-[#1A1A1A] font-sans">
        {children}
      </body>
    </html>
  );
}
