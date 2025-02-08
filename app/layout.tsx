import type { Metadata } from "next";
import { Toaster } from "../components/ui/toaster"
import "./globals.css";

export const metadata: Metadata = {
  title: "Flow",
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/fonts/stylesheet.css" />
      </head>
      <body
        className="antialiased [#__next-route-announcer__]:hidden"
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
