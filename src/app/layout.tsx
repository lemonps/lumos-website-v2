import type { Metadata } from "next";
import { WebflowTouchClass } from "@/components/webflow-touch-class";
import "./globals.css";

export const metadata: Metadata = {
  description:
    "Specialized autonomous systems that make businesses scalable without scaling costs.",
  title: "Lumos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="w-mod-js" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/css/ovo-armor.webflow.shared.e7aa36950.css"
          rel="stylesheet"
          type="text/css"
          crossOrigin="anonymous"
          integrity="sha384-56o2lQ0RNeGTpnLvz9k6XDhZx04fGd1MEWSlmah+agkEnr9P5TKL36yeVT8nQAzk"
        />
      </head>
      <body suppressHydrationWarning>
        <WebflowTouchClass />
        {children}
      </body>
    </html>
  );
}
