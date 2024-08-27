import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { ReactQueryProvider } from "./react-query-provider";

export const metadata: Metadata = {
  title: "teleHealthSol",
  description: "Telemedicine app, built with love from Nigeria.",
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
