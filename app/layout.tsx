import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import '@/lib/env'
import Providers from '@/components/layout/Providers'
import { LayoutProvider } from '@/components/layout/LayoutContext'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import ChatWidget from '@/components/chat/ChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'MangoStore — Premium Fresh Mangoes',
  description: 'Pure, fresh, and hand-picked mangoes delivered from our farm to your doorstep.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="h-full antialiased" data-scroll-behavior="smooth">
      <body className={`${inter.className} min-h-full flex flex-col bg-bg text-text`}>
        <LayoutProvider>
          <Providers>
            <Navbar />
            <main className="flex-grow pb-20 md:pb-0">
              {children}
            </main>
            <ChatWidget />
            <Footer />
          </Providers>
        </LayoutProvider>
      </body>
    </html>
  )
}
