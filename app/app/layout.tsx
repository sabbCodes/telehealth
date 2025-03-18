import type { Metadata } from "next";
import "./globals.css";
import AppWalletProvider from "./components/AppWalletProvider";
import { ReactQueryProvider } from "./react-query-provider";
import { AuthProvider } from "./context/AuthContext";
import AuthObserver from "./AuthObserver";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const metadata: Metadata = {
  title: "teleHealthSol",
  description: "Schedule one-on-one sessions with medical experts all around the world, get your health records saved on decentralised networks and your medications delivered to your doorstep.",
  openGraph: {
    title: "teleHealthSol - Telemedicine App",
    description: "Telemedicine app, built with love from Nigeria.",
    url: "https://app.telehealthsol.health",
    siteName: "teleHealthSol",
    images: [
      {
        url: "https://app.telehealthsol.health/teleHealth.jpg",
        width: 800,
        height: 600,
        alt: "teleHealthSol logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "teleHealthSol",
    description: "Telemedicine app, built with love from Nigeria.",
    images: ["https://app.telehealthsol.health/teleHealth.jpg"],
    site: "@teleHealthS0l",
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
            <AuthProvider>
              <AuthObserver />
              {children}
              <ToastContainer />
            </AuthProvider>
          </AppWalletProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}