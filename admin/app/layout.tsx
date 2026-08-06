import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toast";
import { ThemeProvider } from "@/components/theme-provider";

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
  title: "TECIM Admin — CMS",
  description: "Content management for The Eagle Centre for International Ministries.",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f4f0" },
    { media: "(prefers-color-scheme: dark)", color: "#0f1115" },
  ],
};

const themeInit = `(function(){var t;try{t=window.localStorage.getItem("tecim.theme")}catch(e){}if(t==="dark"||t==="light"){document.documentElement.classList.toggle("dark",t==="dark")}else if(window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches){document.documentElement.classList.add("dark")}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${cormorant.variable} antialiased`}
    >
      <body className="grain" suppressHydrationWarning>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <ThemeProvider>
          <Toaster>{children}</Toaster>
        </ThemeProvider>
      </body>
    </html>
  );
}
