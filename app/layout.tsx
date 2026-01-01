import type { Metadata } from "next";
import { Raleway } from "next/font/google";
import Script from "next/script";
import Providers from "./providers";
import "./globals.css";
import Footer from "../components/ui/footer";

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Home",
  description: "Booking Tiket Terbaik dan Termurah",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className={raleway.variable}>
        <Providers>{children}</Providers>

        {/* ✅ MIDTRANS SNAP (BENAR) */}
        <Script
          src="https://app.sandbox.midtrans.com/snap/snap.js"
          data-client-key={process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY}
          strategy="afterInteractive"
        />

        <Footer />
      </body>
    </html>
  );
}
