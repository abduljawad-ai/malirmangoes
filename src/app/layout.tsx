import type { Metadata } from 'next'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Sidebar from '@/components/Sidebar'

export const metadata: Metadata = {
  title: 'Malir Mangoes - Premium Mango Delivery Platform',
  description: 'The modern way to order premium Pakistani mangoes. Fresh from farm to your doorstep.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Sidebar />
          <main className="lg:ml-64 min-h-screen">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  )
}
