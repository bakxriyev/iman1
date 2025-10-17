import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "SUPERMIYA AI 2.0 - Kurs",
  description: "Eslab qilish bo'yicha Rossiya rekordchisi bilan xotirangizni 10 baravarga kuchaytiring",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="uz">
      <body className={`${geist.className} antialiased bg-[#1a1a1a]`}>{children}</body>
    </html>
  )
}
