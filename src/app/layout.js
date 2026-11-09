import { Cormorant_Garamond } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import FreeQuoteSticky from "@/components/shared/FreeQuoteForm";
import { ThemeProvider } from "@/components/shared/themeProvider";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-heading",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL("https://jaguarengines.uk/"),
  title: "Jaguar Engines UK  The Complete Ownership Guide",
  description:
    "The UK's Most Trusted Jaguar Ownership Guide. Reliability rankings, real failure data, honest repair-vs-replace economics for every Jaguar model. Powered by 1,700+ real UK enquiries.",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/jaguar-logo.webp", type: "image/webp" },
    ],
    shortcut: "/favicon.ico",
    apple: "/jaguar-logo.webp",
  },
  openGraph: {
    title: "Jaguar Engines UK  The Complete Ownership Guide",
    description:
      "The UK's Most Trusted Jaguar Ownership Guide. Reliability rankings, real failure data, honest repair-vs-replace economics for every Jaguar model.",
    url: "https://jaguarengines.uk/",
    siteName: "JaguarEngines.uk",
    locale: "en_GB",
    type: "website",
    images: [
      {
        url: "/og-share.webp",
        width: 1200,
        height: 630,
        alt: "Jaguar Engines UK",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Jaguar Engines UK  The Complete Ownership Guide",
    description:
      "The UK's Most Trusted Jaguar Ownership Guide. Reliability rankings, real failure data, honest repair-vs-replace economics for every Jaguar model.",
    images: ["/og-share.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB" className={`${cormorantGaramond.variable} h-full`}>
      <body className="min-h-full bg-[var(--color-page)] text-[var(--color-text)] antialiased">
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "z795r7bd87");
          `}
        </Script>
        <ThemeProvider>
          <div className="flex min-h-screen flex-col bg-[var(--color-page)] text-[var(--color-text)]">
            <Navbar />
            <div className="flex-1 overflow-x-hidden">{children}</div>
            <Footer />
          </div>
          <FreeQuoteSticky />
        </ThemeProvider>
      </body>
    </html>
  );
}
