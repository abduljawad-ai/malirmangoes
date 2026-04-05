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
  title: 'Malir Mangoes — Premium Pakistani Mangoes Delivered Fresh',
  description: 'Order fresh Chaunsa, Sindhri, Anwar Ratol and Langra mangoes direct from Malir orchards. Free delivery on orders above minimum.',
  openGraph: {
    title: 'Malir Mangoes',
    description: 'Premium Pakistani mangoes delivered fresh to your door.',
    url: 'https://malirmangoes.vercel.app',
    siteName: 'Malir Mangoes',
    type: 'website',
  },
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
            <main className="flex-grow">
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
