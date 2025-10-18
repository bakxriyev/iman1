import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import Script from "next/script"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "OZODSAN - Kurs",
  description: "Iphone 17 telefoni yutib olish imkoniyati",
  generator: "ITZONE",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <head>
        {/* ✅ Facebook Domain Verification */}
        <meta
          name="facebook-domain-verification"
          content="hpct7lrt1w4te4dit3npe8gd2tq81w"
        />

        {/* ✅ Facebook Pixel Script */}
        <Script id="facebook-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '647005224750459');
            fbq('track', 'PageView');
          `}
        </Script>

        {/* ✅ Noscript versiyasi (fallback) */}
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=647005224750459&ev=PageView&noscript=1"
            alt="facebook pixel"
          />
        </noscript>
      </head>

      <body className={`${geist.className} antialiased bg-[#1a1a1a]`}>
        {children}
      </body>
    </html>
  )
}
