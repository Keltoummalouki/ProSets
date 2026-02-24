import type { Metadata } from "next";
import { Bebas_Neue, DM_Mono, Fraunces } from "next/font/google";
import "./globals.css";

const bebasNeue = Bebas_Neue({
  weight: "400",
  variable: "--font-bebas",
  subsets: ["latin"],
});

const dmMono = DM_Mono({
  weight: ["300", "400", "500"],
  variable: "--font-dm-mono",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Prosets — Digital Asset Marketplace",
  description:
    "Premium digital assets — 3D models, code snippets, Notion templates — bought, sold, and delivered securely.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
        />
      </head>
      <body
        className={`${bebasNeue.variable} ${dmMono.variable} ${fraunces.variable}`}
      >
        {children}
      </body>
    </html>
  );
}
