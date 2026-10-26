import "../globals.css";
import Header from "../components/website/Header";
import Footer from "../components/website/Footer";
import { SiteSettingsProvider } from "../components/website/SiteSettingsProvider";

export default function RootLayout({ children }) {
  return (
    <html>
      <body className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 via-white to-amber-50 text-gray-900 antialiased">
        <SiteSettingsProvider>
          <Header />
          {children}
          <Footer />
        </SiteSettingsProvider>
      </body>
    </html>
  );
}
