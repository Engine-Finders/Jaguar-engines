import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "JaguarEngines.uk — The Complete Ownership Guide",
  description: "The UK's Most Trusted Jaguar Ownership Guide. Reliability rankings, real failure data, honest repair-vs-replace economics for every XE, XF, XJ, F-Pace, E-Pace, F-Type, XK, S-Type and X-Type ever sold in the UK.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-black antialiased">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
