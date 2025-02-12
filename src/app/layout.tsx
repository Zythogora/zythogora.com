import { Inter, Kanit } from "next/font/google";

import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

import "./globals.css";

const title = Kanit({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-title",
  subsets: ["latin"],
});

const paragraph = Inter({
  variable: "--font-paragraph",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Zythogora",
  description: "The beer gathering place",
};

export default function RootLayout({ children }: Readonly<PropsWithChildren>) {
  return (
    <html lang="en">
      <body className={`${title.variable} ${paragraph.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
