import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QuickPoll - Create Instant Polls',
  description: 'Create quick polls and get real-time results. No sign-up required.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background antialiased">
        <main className="max-w-2xl mx-auto px-4 py-8">
          {children}
        </main>
      </body>
    </html>
  )
}
