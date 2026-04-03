import type React from "react"
import type { Metadata } from "next"
import { Inter, Instrument_Serif } from "next/font/google"
import "./globals.css"
import { LandingTourProvider } from "../components/landing-tour"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
})

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  variable: "--font-instrument-serif",
  weight: ["400"],
  display: "swap",
  preload: true,
})

export const metadata: Metadata = {
  title: "FlowPilot — Headless Flow & Tour Library for React",
  description:
    "Build guided tours and onboarding flows without the library lock-in. FlowPilot is a headless React library that handles state management while you control the UI. TypeScript-first, SSR-safe, and minimal bundle size.",
  keywords: ["react", "tour", "onboarding", "flow", "headless", "typescript", "nextjs"],
  authors: [{ name: "FlowPilot Team" }],
  openGraph: {
    title: "FlowPilot — Headless Flow & Tour Library for React",
    description: "Build guided tours and onboarding flows without the library lock-in. You own the UI. We own the state.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "FlowPilot — Headless Flow & Tour Library for React",
    description: "Build guided tours and onboarding flows without the library lock-in. You own the UI. We own the state.",
  },
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${instrumentSerif.variable} antialiased`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
        />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Instrument+Serif:wght@400&display=swap" />
      </head>
      <body className="font-sans antialiased">
        <LandingTourProvider>
          {children}
        </LandingTourProvider>
      </body>
    </html>
  )
}
