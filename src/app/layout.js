import "./globals.css";

export const metadata = {
  title: "BMW Reliability Guide",
  description: "The UK's Most Trusted BMW Ownership Guide",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-white text-black antialiased">
        {children}
      </body>
    </html>
  );
}
