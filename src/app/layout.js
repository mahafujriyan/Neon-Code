// app/layout.js
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CurrencyProvider from "../context/CurrencyContext";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata = {
  title: "NeonCode",
  description: "Company Management System",
  icons: {
    icon: "/company logo .jpg", 
  },
};
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* এখানে কোনো Providers বা SessionProvider থাকবে না */}
        <CurrencyProvider>
          {children}
        </CurrencyProvider>
      </body>
    </html>
  );
}