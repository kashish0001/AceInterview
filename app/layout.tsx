import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AceInterview - AI Interview Preparation',
  description: 'AI-powered interview preparation tool',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

