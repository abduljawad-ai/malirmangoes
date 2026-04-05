import React from 'react'
import { AuthProvider } from '@/hooks/useAuth'
import { CartProvider } from '@/hooks/useCart'
import { Toaster } from 'react-hot-toast'
import CartDrawer from '@/components/cart/CartDrawer'
import { ErrorBoundary } from '@/components/ErrorBoundary'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CartProvider>
          {children}
          <CartDrawer />
          <Toaster
            position="bottom-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#011627',
                color: '#FDFFFC',
                borderRadius: '12px',
                fontSize: '14px',
                padding: '12px 16px',
              },
              success: {
                iconTheme: {
                  primary: '#2EC4B6',
                  secondary: '#FDFFFC',
                },
              },
              error: {
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#FDFFFC',
                },
              },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </ErrorBoundary>
  )
}
