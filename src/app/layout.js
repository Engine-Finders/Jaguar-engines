import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FreeQuoteSticky from "@/components/shared/FreeQuoteForm";
import { ThemeProvider } from "@/components/shared/themeProvider";

export const metadata = {
  metadataBase: new URL("https://jaguarengines.uk/"),
  title: "Jaguar Engines UK — The Complete Ownership Guide",
  description:
    "The UK's Most Trusted Jaguar Ownership Guide. Reliability rankings, real failure data, honest repair-vs-replace economics for every Jaguar model. Powered by 1,700+ real UK enquiries.",
  icons: {
    icon: [{ url: "/jaguar-fav.jpg", type: "image/jpeg" }],
    shortcut: "/jaguar-fav.jpg",
    apple: "/jaguar-fav.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className="h-full">
      <body className="min-h-full bg-[var(--color-page)] text-[var(--color-text)] antialiased">
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-[var(--color-page)] text-[var(--color-text)]">
            <Navbar />
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
          <FreeQuoteSticky />
        </ThemeProvider>
      </body>
    </html>
  );
}
