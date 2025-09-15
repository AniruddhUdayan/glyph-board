import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Glyph Board - Collaborative Digital Whiteboard",
  description: "Create, collaborate, and communicate with Glyph Board - the intuitive digital whiteboard for teams and individuals. Perfect for brainstorming, planning, and real-time collaboration.",
  keywords: ["digital whiteboard", "collaboration", "brainstorming", "online drawing", "team collaboration", "visual thinking"],
  authors: [{ name: "Glyph Board Team" }],
  creator: "Glyph Board",
  publisher: "Glyph Board",
  openGraph: {
    title: "Glyph Board - Collaborative Digital Whiteboard",
    description: "The intuitive digital whiteboard that brings your ideas to life. Perfect for brainstorming, planning, and real-time collaboration.",
    url: "https://glyphboard.com",
    siteName: "Glyph Board",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Glyph Board - Collaborative Digital Whiteboard",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Glyph Board - Collaborative Digital Whiteboard",
    description: "Create, collaborate, and communicate with Glyph Board - the intuitive digital whiteboard for teams and individuals.",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
