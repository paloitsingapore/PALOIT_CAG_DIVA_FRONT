import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Assisted Wayfinding",
  description: "Airport navigation assistance",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col h-full`}
      >
        <main className="flex-grow flex">{children}</main>
        <footer className="grid grid-cols-2 gap-4 p-4 bg-gray-100">
          <div className="flex items-center bg-white p-4 rounded-lg shadow">
            <span className="mr-4">📶</span>
            <p>Scan your phone below to connect to our free Wi-Fi</p>
          </div>
          <div className="flex items-center bg-white p-4 rounded-lg shadow">
            <span className="mr-4">🗺️</span>
            <p>Scan your phone below to download the airport map</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
