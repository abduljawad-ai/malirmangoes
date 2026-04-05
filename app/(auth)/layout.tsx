'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { FloatingElement, SpringFade } from '@/components/motion'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Side - Branding (hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 xl:w-5/12 relative bg-gradient-to-br from-orange-500 via-amber-500 to-yellow-400 overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 left-0 w-[600px] h-[600px] bg-white/10 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2"
          />
          <motion.div
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-white/10 rounded-full blur-3xl translate-x-1/3 translate-y-1/3"
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-center w-full px-12 text-center">
          <FloatingElement amplitude={20} duration={5}>
            <Link href="/">
              <img 
                src="/logo.png" 
                alt="Malir Mangoes Logo"
                className="w-32 h-32 object-contain mb-8 drop-shadow-2xl"
              />
            </Link>
          </FloatingElement>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl xl:text-5xl font-extrabold text-white mb-4"
          >
            Malir Mangoes
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-white/90 max-w-md"
          >
            The purest taste of nature, delivered from our orchards to your doorstep.
          </motion.p>

          {/* Floating Mangoes */}
          <FloatingElement amplitude={15} duration={4} delay={0.5} className="absolute top-20 right-20 text-6xl opacity-30">
            🥭
          </FloatingElement>
          <FloatingElement amplitude={10} duration={3.5} delay={1} className="absolute bottom-32 left-20 text-4xl opacity-20">
            🌿
          </FloatingElement>
          <FloatingElement amplitude={12} duration={4.5} delay={1.5} className="absolute top-40 left-16 text-5xl opacity-20">
            🍃
          </FloatingElement>
        </div>

        {/* Wave Bottom */}
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          className="absolute bottom-0 left-0 w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 75C480 70 600 80 720 85C840 90 960 90 1080 85C1200 80 1320 70 1380 65L1440 60V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Right Side - Auth Form */}
      <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50 p-4 sm:p-8 lg:p-12 relative overflow-hidden">
        {/* Background Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-20 w-64 h-64 bg-orange-200/20 rounded-full blur-3xl" />
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-amber-200/20 rounded-full blur-3xl" />
        </div>

        <SpringFade className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8">
            <Link href="/" className="inline-block">
              <img 
                src="/logo.png" 
                alt="Malir Mangoes Logo"
                className="w-20 h-20 object-contain mx-auto drop-shadow-lg"
              />
            </Link>
            <h2 className="mt-4 text-2xl font-bold text-gray-900">Malir Mangoes</h2>
          </div>
          
          <div className="bg-white p-8 sm:p-10 rounded-3xl shadow-xl shadow-orange-500/10 border border-orange-100">
            {children}
          </div>
        </SpringFade>
      </div>
    </div>
  )
}
