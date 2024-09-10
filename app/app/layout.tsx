import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { ReactQueryProvider } from "./react-query-provider";

export const metadata: Metadata = {
  title: "teleHealthSol",
  description: "Telemedicine app, built with love from Nigeria.",
  // Open Graph metadata
  openGraph: {
    title: "teleHealthSol - Telemedicine App",
    description: "Telemedicine app, built with love from Nigeria.",
    url: "https://telehealthsol.health",
    siteName: "teleHealthSol",
    images: [
      {
        url: "https://solana.com/_next/static/media/logotype.e4df684f.svg",
        width: 800,
        height: 600,
        alt: "teleHealthSol logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  // Twitter card metadata
  twitter: {
    card: "summary_large_image",
    title: "teleHealthSol",
    description: "Telemedicine app, built with love from Nigeria.",
    images: ["https://solana.com/_next/static/media/logotype.e4df684f.svg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ReactQueryProvider>
          <AppWalletProvider>
            {children}
          </AppWalletProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
