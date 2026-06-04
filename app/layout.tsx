import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
// website metadata displayed in browser tab
export const metadata: Metadata = {
  title: "Dairy Flat Air",
  description: "Online booking system for Dairy Flat Airport flights",
};
// root layout shared across all pages
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-100 text-slate-950">
        {/* Navigation Bar */}
        <nav className="border-b bg-white/90 shadow-sm backdrop-blur">
          <div className="flex items-center justify-between px-10 py-4">
            {/* Logo */}
            <Link
              href="/"
              className="text-2xl font-bold tracking-tight text-blue-700"
            >
              Dairy Flat Air
            </Link>

            {/* Navigation Links */}
            <div className="flex gap-2 text-sm font-bold">
              <Link
                href="/"
                className="rounded-lg px-3 py-2 text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                Home
              </Link>

              <Link
                href="/search"
                className="rounded-lg px-3 py-2 text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                Search Flights
              </Link>

              <Link
                href="/bookings"
                className="rounded-lg px-3 py-2 text-slate-800 transition-colors hover:bg-blue-50 hover:text-blue-700"
              >
                Passenger Bookings
              </Link>
            </div>
          </div>
        </nav>

        {/* Main Page Content */}
        {children}

        {/* Footer */}
        <footer className="border-t bg-slate-950 px-6 py-8 text-center text-sm text-slate-300">
          <p>© 2026 Dairy Flat Air Inc. All rights reserved.</p>

          <p className="mt-2">
            Contact Us:{" "}
            <a
              href="mailto:dairyFlatAirSupport@gmail.com"
              className="text-blue-300 hover:text-blue-200"
            >
              dairyFlatAirSupport@gmail.com.
            </a>
          </p>
        </footer>
      </body>
    </html>
  );
}