import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// Importar solo el JS necesario
import BootstrapClientScripts from './BootstrapClientScripts'
import Footer from "@/components/footer";
import Navbar from "@/components/navbar";



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
        <div className="d-flex flex-column min-vh-100">
            <BootstrapClientScripts />
            <Navbar />
            {children}
          <Footer />
        </div>
      </body>
    </html >
  );
}