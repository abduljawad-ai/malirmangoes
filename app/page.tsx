'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, Truck, Shield, Leaf, Star, Play } from 'lucide-react'
import ProductCard from '@/components/products/ProductCard'
import { useProducts } from '@/hooks/useProducts'
import { useSettings } from '@/hooks/useSettings'
import Button from '@/components/ui/Button'
import { ProductGridSkeleton } from '@/components/ui/Skeleton'

const defaultSlides = [
  {
    image: 'https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_1920/mangostore/mangostore/hero.jpg',
    tagline: 'Fresh Harvest 2026',
    title: 'Premium Pakistani',
    highlight: 'Mangoes',
    subtitle: 'Hand-picked from Multan\'s finest orchards, naturally ripened, and delivered fresh to your table.',
    cta: 'Shop Now',
  },
  {
    image: 'https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_1920/mangostore/mangostore/honey-mango.jpg',
    tagline: 'King of Mangoes',
    title: 'Authentic',
    highlight: 'Chaunsa',
    subtitle: 'Experience the legendary sweetness of Pakistan\'s most beloved mango variety.',
    cta: 'Order Chaunsa',
  },
  {
    image: 'https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_1920/mangostore/mangostore/mango-box.jpg',
    tagline: 'Gift Ready',
    title: 'Premium',
    highlight: 'Gift Boxes',
    subtitle: 'Beautifully packaged mango boxes perfect for gifting to your loved ones.',
    cta: 'View Boxes',
  },
  {
    image: 'https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_1920/mangostore/mangostore/premium_mango_box.jpg',
    tagline: 'Extra Sweet',
    title: 'Anwar',
    highlight: 'Ratol',
    subtitle: 'Small but incredibly sweet. The connoisseur\'s choice for true mango lovers.',
    cta: 'Shop Ratol',
  },
]

const features = [
  { icon: Leaf, title: 'Farm Fresh', desc: 'Hand-picked daily from our orchards' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Delivered within 24 hours' },
  { icon: Shield, title: 'Quality Guarantee', desc: '100% fresh or full refund' },
  { icon: Star, title: 'Premium Quality', desc: 'Only the finest mangoes selected' },
]

export default function HomePage() {
  const { products, loading } = useProducts()
  const { settings } = useSettings()
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const featured = products.filter(p => p.isFeatured).slice(0, 4)
  const allProducts = products.filter(p => p.isActive && !featured.find(f => f.id === p.id))

  const carouselSlides = !loading && settings.carouselImages && settings.carouselImages.length > 0
    ? settings.carouselImages.map((img, i) => ({
        image: img.src,
        tagline: img.tagline,
        title: img.name,
        highlight: '',
        subtitle: '',
        cta: 'Shop Now',
      }))
    : defaultSlides

  // Guard: if carouselSlides becomes empty somehow, use defaults
  const safeSlides = carouselSlides.length > 0 ? carouselSlides : defaultSlides

  // Reset to first slide when slides source changes
  useEffect(() => {
    setCurrentSlide(0)
  }, [safeSlides.length])

  // Auto-rotate carousel every 4 seconds
  useEffect(() => {
    if (safeSlides.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % safeSlides.length)
    }, 4000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [safeSlides.length])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    if (intervalRef.current) clearInterval(intervalRef.current)
    intervalRef.current = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % safeSlides.length)
    }, 4000)
  }

  const slide = safeSlides[currentSlide]

  return (
    <div>
      {/* Hero Carousel */}
      <section className="relative h-[70vh] md:h-[85vh] min-h-[500px] max-h-[800px] overflow-hidden bg-slate-900">
        {/* Background Images */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: [0.4, 0, 0.2, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.image}
              alt={slide.title}
              fill
              sizes="100vw"
              className="object-cover"
              priority
              loading="eager"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content */}
        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-sm border border-white/20 text-white/90 text-xs font-semibold rounded-full mb-6">
                  <Leaf className="w-3 h-3" />
                  {slide.tagline}
                </span>

                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.1] mb-4">
                  {slide.title}{' '}
                  {slide.highlight && <span className="text-mango">{slide.highlight}</span>}
                  {!slide.highlight && slide.tagline && <span className="text-mango">{slide.tagline}</span>}
                </h1>

                {slide.subtitle && (
                  <p className="text-base sm:text-lg text-white/80 leading-relaxed mb-8 max-w-md">
                    {slide.subtitle}
                  </p>
                )}

                <div className="flex flex-wrap gap-3">
                  <Button size="lg" asChild className="bg-mango hover:bg-mango-600 text-white">
                    <Link href="/products">
                      {slide.cta} <ArrowRight className="w-4 h-4 ml-1" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10 hover:border-white/50">
                    <Link href="/chat">Contact Us</Link>
                  </Button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex items-center gap-2">
          {safeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`transition-all duration-300 rounded-full ${
                index === currentSlide
                  ? 'w-8 h-2 bg-mango'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Slide Counter */}
        <div className="absolute bottom-8 right-8 z-10 hidden sm:block">
          <span className="text-white/60 text-sm font-medium">
            <span className="text-white font-bold">{String(currentSlide + 1).padStart(2, '0')}</span>
            {' / '}{String(safeSlides.length).padStart(2, '0')}
          </span>
        </div>
      </section>

      {/* Features */}
      <section className="border-b border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="flex items-start gap-3 p-4 rounded-lg"
              >
                <div className="w-10 h-10 bg-mango-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <f.icon className="w-5 h-5 text-mango" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-slate-900">{f.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <span className="text-xs font-semibold text-mango uppercase tracking-wider">Bestsellers</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Featured Products</h2>
              <p className="text-sm text-slate-500 mt-1">Our most popular picks</p>
            </div>
            <Link href="/products" className="flex items-center gap-1 text-sm font-medium text-mango hover:text-mango-600 transition-colors">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>

          {loading ? (
            <ProductGridSkeleton count={4} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {featured.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}
        </section>
      )}

      {/* Why Choose Us */}
      <section className="bg-slate-50 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <span className="text-xs font-semibold text-mango uppercase tracking-wider">Why Us</span>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">Why Choose MangoStore?</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                image: 'https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_600/mangostore/mangostore/farm_harvest.jpg',
                title: 'Direct from Farm',
                desc: 'We source directly from our own orchards in Multan, ensuring the freshest mangoes reach your doorstep within hours of harvest.',
              },
              {
                image: 'https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_600/mangostore/mangostore/honey-mango.jpg',
                title: 'Hand-Selected Quality',
                desc: 'Every mango is carefully hand-picked at peak ripeness by our experienced farmers. Only the best make it to your box.',
              },
              {
                image: 'https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_600/mangostore/mangostore/mango-box.jpg',
                title: 'Safe Delivery',
                desc: 'Our premium packaging ensures your mangoes arrive in perfect condition. Temperature-controlled shipping keeps them fresh.',
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="bg-white rounded-lg overflow-hidden border border-slate-200 group hover:border-slate-300 transition-colors"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-5">
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* All Products */}
      {allProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 sm:py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center justify-between mb-8"
          >
            <div>
              <span className="text-xs font-semibold text-mango uppercase tracking-wider">Shop</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">All Varieties</h2>
              <p className="text-sm text-slate-500 mt-1">{allProducts.length} products available</p>
            </div>
          </motion.div>

          {loading ? (
            <ProductGridSkeleton count={8} />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3"
            >
              {allProducts.slice(0, 8).map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </motion.div>
          )}


        </section>
      )}

      {/* CTA */}
      <section className="relative bg-slate-900 overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <Image
            src="https://res.cloudinary.com/dzimmsjyx/image/upload/f_auto,q_auto,w_1920/mangostore/mangostore/hero.jpg"
            alt=""
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 py-16 sm:py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3">
              Ready to Taste the Best?
            </h2>
            <p className="text-slate-400 max-w-md mx-auto mb-8">
              Order now and experience the authentic flavor of premium Pakistani mangoes delivered fresh to your door.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button size="lg" asChild className="bg-mango hover:bg-mango-600">
                <Link href="/products">
                  Start Shopping <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild className="border-white/30 text-white hover:bg-white/10">
                <Link href="/chat">Talk to Us</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
