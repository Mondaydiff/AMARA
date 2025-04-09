import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "./navbar/layout";
// Importar solo el JS necesario
import BootstrapClientScripts from './BootstrapClientScripts'




const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "AMARA",
  description: "Amara APP",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <BootstrapClientScripts />
        <Sidebar />
        {children}

      </body>
    </html >
  );
}