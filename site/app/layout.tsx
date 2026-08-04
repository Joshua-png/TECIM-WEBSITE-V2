import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import "@tecim/shared/sections/sections.css";
import Nav from "@/components/layouts/Nav";
import Footer from "@/components/layouts/Footer";
import { PreviewChrome } from "@/components/layouts/PreviewChrome";
import { loadChrome } from "@/lib/chrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "TECIM — The Eagle Centre for International Ministries",
  description:
    "Equipping a generation of kingdom-minded people of integrity and the Word — as Light, Trumpets and Swords.",
};

export const viewport: Viewport = {
  themeColor: "#0a0a0c",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { links, footer } = await loadChrome();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} antialiased`}
    >
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <PreviewChrome nav={<Nav links={links} />} footer={<Footer data={footer} />}>
          {children}
        </PreviewChrome>
      </body>
    </html>
  );
}
