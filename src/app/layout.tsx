import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  description: "A Next.js port of the provided Webflow HTML export.",
  title: "Lumos",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link href="https://fonts.googleapis.com" rel="preconnect" />
        <link
          href="https://fonts.gstatic.com"
          rel="preconnect"
          crossOrigin="anonymous"
        />
        <link
          href="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/css/ovo-armor.webflow.shared.e7aa36950.css"
          rel="stylesheet"
          type="text/css"
          crossOrigin="anonymous"
          integrity="sha384-56o2lQ0RNeGTpnLvz9k6XDhZx04fGd1MEWSlmah+agkEnr9P5TKL36yeVT8nQAzk"
        />
        <link
          href="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b2eafa795b5711fcebcf_Fav.png"
          rel="shortcut icon"
          type="image/x-icon"
        />
        <link
          href="https://cdn.prod.website-files.com/69c2ae749ddb18cdddca84ee/69c2b2f0f35113d970b60259_Web.png"
          rel="apple-touch-icon"
        />
        <Script
          id="webflow-webfont"
          src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"
          strategy="beforeInteractive"
        />
        <Script id="webflow-webfont-init" strategy="beforeInteractive">
          {`WebFont.load({ google: { families: ["Inter:300,400,500,600,700","Manrope:300,400,500,600,700"] } });`}
        </Script>
        <Script id="webflow-html-init" strategy="beforeInteractive">
          {`!function(o,c){var n=c.documentElement,t=" w-mod-";n.className+=t+"js",("ontouchstart"in o||o.DocumentTouch&&c instanceof DocumentTouch)&&(n.className+=t+"touch")}(window,document);`}
        </Script>
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
