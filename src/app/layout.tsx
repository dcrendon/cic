import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Toaster } from "@/components/ui/Toaster"

export const metadata: Metadata = {
  title: "Cardboard is Cool",
  description: "Route tracking for cardboard pickup drivers",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body><Toaster>{children}</Toaster></body>
    </html>
  )
}
