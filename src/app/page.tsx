'use client'

import { useState, useEffect } from 'react'
import { supabase, MangoVariety, OrderItem, SiteSettings } from '@/lib/supabase'
import { useAuth } from '@/context/AuthContext'
import {
  ShoppingCart, User, MessageCircle, X, Minus, Plus,
  MapPin, Phone, Check, Loader, Star, Truck, Shield,
  Leaf, ArrowRight, Menu, Instagram, Facebook, Mail,
  Zap, Clock, Globe, ChevronRight, Play, Quote
} from 'lucide-react'
import Link from 'next/link'

const defaultSettings: SiteSettings = {
  site_name: 'Malir Mangoes',
  logo_url: '',
  hero_title: 'Premium Pakistani Mangoes',
  hero_subtitle: 'Fresh from orchards to your doorstep',
  hero_image: '',
  footer_text: 'Fresh mangoes delivered all over Pakistan',
  contact_phone: '+923283181163',
}

const defaultVarieties: MangoVariety[] = [
  { id: '1', name: 'Sindhri', description: 'The King of mangoes - sweet & juicy with golden hue', price_per_kg: 450, available: true, image_url: '', created_at: '' },
  { id: '2', name: 'Chaunsa', description: 'Premium aromatic flavor loved worldwide', price_per_kg: 550, available: true, image_url: '', created_at: '' },
  { id: '3', name: 'Langra', description: 'Famous for its fiberless, melt-in-mouth flesh', price_per_kg: 400, available: true, image_url: '', created_at: '' },
  { id: '4', name: 'Dasheri', description: 'Sweet & deliciously rich with royal heritage', price_per_kg: 420, available: true, image_url: '', created_at: '' },
  { id: '5', name: 'Anwar Ratol', description: 'Small but incredibly sweet - the fruit lover\'s choice', price_per_kg: 600, available: true, image_url: '', created_at: '' },
]

const features = [
  { icon: Truck, title: 'Express Delivery', description: 'Farm-fresh mangoes at your doorstep within 24-48 hours across Pakistan', badge: 'Fast' },
  { icon: Shield, title: 'Quality Guaranteed', description: 'Every mango is hand-picked, graded, and inspected before shipping', badge: 'Premium' },
  { icon: Leaf, title: '100% Organic', description: 'Grown naturally without harmful pesticides or artificial ripening agents', badge: 'Organic' },
  { icon: Zap, title: 'Easy Ordering', description: 'Order in seconds via our platform or WhatsApp - whichever you prefer', badge: 'Simple' },
  { icon: Globe, title: 'Farm Direct', description: 'Cut out middlemen. Direct from orchards to you at the best prices', badge: 'Direct' },
  { icon: Clock, title: 'Season Fresh', description: 'Available only during peak season for the freshest taste experience', badge: 'Seasonal' },
]

const howItWorks = [
  { step: '01', title: 'Browse Varieties', description: 'Explore our curated selection of premium Pakistani mangoes' },
  { step: '02', title: 'Add to Cart', description: 'Choose your varieties and select the quantity you need' },
  { step: '03', title: 'Checkout', description: 'Enter your delivery details and confirm your order' },
  { step: '04', title: 'Enjoy Fresh', description: 'Receive farm-fresh mangoes at your doorstep within 48 hours' },
]

const testimonials = [
  { name: 'Ahmed Khan', role: 'Karachi', text: 'Best Chaunsa I have ever tasted. The quality and freshness is unmatched. Will definitely order again!', rating: 5 },
  { name: 'Fatima Ali', role: 'Lahore', text: 'Ordered Sindhri for my family in Lahore. Everyone loved it. Packaging was excellent and delivery was on time.', rating: 5 },
  { name: 'Bilal Ahmed', role: 'Islamabad', text: 'The Anwar Ratol was absolutely divine. Small but packed with flavor. This is now my go-to mango supplier.', rating: 5 },
]

const pricingPlans = [
  {
    name: 'Starter Box',
    price: 1500,
    description: 'Perfect for trying out our mangoes',
    features: ['2kg mixed varieties', 'Free delivery in Karachi', 'Fresh packed', 'Order tracking'],
    cta: 'Order Now',
    popular: false,
  },
  {
    name: 'Family Pack',
    price: 3500,
    description: 'Best value for mango lovers',
    features: ['5kg premium selection', 'Free delivery nationwide', 'Priority packing', 'WhatsApp support', 'Gift wrapping'],
    cta: 'Order Now',
    popular: true,
  },
  {
    name: 'Bulk Order',
    price: 8000,
    description: 'For events and gifting',
    features: ['15kg assorted box', 'Free delivery nationwide', 'Express packing', 'Dedicated support', 'Custom gift cards', 'Corporate invoicing'],
    cta: 'Contact Us',
    popular: false,
  },
]

export default function Home() {
  const { user, signIn, signUp } = useAuth()
  const [cart, setCart] = useState<OrderItem[]>([])
  const [showCart, setShowCart] = useState(false)
  const [showAuth, setShowAuth] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authName, setAuthName] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const [authError, setAuthError] = useState('')
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [selectedCity, setSelectedCity] = useState('')
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [customerName, setCustomerName] = useState('')
  const [customerPhone, setCustomerPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSettings)
  const [varieties, setVarieties] = useState<MangoVariety[]>(defaultVarieties)
  const [showOrderModal, setShowOrderModal] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (user?.name) setCustomerName(user.name)
    if (user?.address) setDeliveryAddress(user.address)
    if (user?.city) setSelectedCity(user.city)
    if (user?.phone) setCustomerPhone(user.phone)
  }, [user])

  async function fetchData() {
    setLoading(true)
    try {
      const settingsRes = await supabase.from('site_settings').select('*').limit(1).single()
      const varietiesRes = await supabase.from('mango_varieties').select('*').order('name')

      if (!settingsRes.error && settingsRes.data) {
        setSiteSettings({
          site_name: settingsRes.data.site_name || defaultSettings.site_name,
          logo_url: settingsRes.data.logo_url || '',
          hero_title: settingsRes.data.hero_title || defaultSettings.hero_title,
          hero_subtitle: settingsRes.data.hero_subtitle || defaultSettings.hero_subtitle,
          hero_image: settingsRes.data.hero_image || '',
          footer_text: settingsRes.data.footer_text || defaultSettings.footer_text,
          contact_phone: settingsRes.data.contact_phone || defaultSettings.contact_phone,
        })
      }

      if (!varietiesRes.error && varietiesRes.data && varietiesRes.data.length > 0) {
        setVarieties(varietiesRes.data)
      }
    } catch (err) {
      console.log('Using fallback data (Supabase not connected)')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = (variety: MangoVariety) => {
    const qty = quantities[variety.id] || 1
    const existing = cart.find(item => item.variety_id === variety.id)
    if (existing) {
      setCart(cart.map(item =>
        item.variety_id === variety.id
          ? { ...item, quantity: item.quantity + qty }
          : item
      ))
    } else {
      setCart([...cart, {
        variety_id: variety.id,
        variety_name: variety.name,
        quantity: qty,
        price_per_kg: variety.price_per_kg,
      }])
    }
    setQuantities({ ...quantities, [variety.id]: 1 })
  }

  const updateQuantity = (variety_id: string, delta: number) => {
    setQuantities(prev => {
      const newQty = Math.max(1, (prev[variety_id] || 1) + delta)
      return { ...prev, [variety_id]: newQty }
    })
  }

  const removeFromCart = (variety_id: string) => {
    setCart(cart.filter(item => item.variety_id !== variety_id))
  }

  const cartTotal = cart.reduce((sum, item) => sum + (item.quantity * item.price_per_kg), 0)

  const handleWhatsAppOrder = () => {
    if (cart.length === 0) return
    const address = deliveryAddress || user?.address || ''
    const name = customerName || user?.name || ''
    const city = selectedCity || user?.city || ''

    let message = `*New Order - ${siteSettings.site_name}*\n\n`
    cart.forEach(item => {
      message += `  ${item.variety_name}: ${item.quantity}kg x Rs.${item.price_per_kg}/kg = Rs.${item.quantity * item.price_per_kg}\n`
    })
    message += `\n*Total: Rs.${cartTotal}*`
    message += `\n\n Delivery Address:\n${name}\n${address}\n${city}`
    message += `\n\n Contact: ${customerPhone || user?.phone || 'Not provided'}`

    const encodedMessage = encodeURIComponent(message)
    const phone = siteSettings.contact_phone.replace('+', '')
    window.open(`https://wa.me/${phone}?text=${encodedMessage}`, '_blank')
  }

  const handleWebsiteOrder = async () => {
    if (!user) {
      setShowAuth(true)
      return
    }
    if (!deliveryAddress || !selectedCity) {
      return
    }

    const { error } = await supabase.from('orders').insert({
      user_id: user.id,
      items: cart,
      total_amount: cartTotal,
      delivery_address: `${deliveryAddress}, ${selectedCity}`,
      customer_name: user.name,
      customer_phone: user.phone || '',
      status: 'pending',
    })

    if (!error) {
      setCart([])
      alert('Order placed successfully! We will contact you soon.')
    }
  }

  const handleAuth = async () => {
    setAuthLoading(true)
    setAuthError('')

    if (isLogin) {
      const { error } = await signIn(authEmail, authPassword)
      if (error) setAuthError(error.message)
    } else {
      const { error } = await signUp(authEmail, authPassword, authName)
      if (error) setAuthError(error.message)
    }
    setAuthLoading(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-mango-cream flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4">
            <svg viewBox="0 0 100 100" className="w-full h-full animate-spin" style={{ animationDuration: '2s' }}>
              <circle cx="50" cy="50" r="40" stroke="#FED7AA" strokeWidth="8" fill="none" />
              <path d="M50 10 L50 50 L70 30" stroke="#F97316" strokeWidth="6" fill="none" strokeLinecap="round" />
            </svg>
          </div>
          <p className="text-mango-600 font-medium">Loading fresh mangoes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-4 left-4 right-4 z-50 max-w-7xl mx-auto">
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl border border-gray-100 shadow-sm px-4 md:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-mango-500 to-mango-gold rounded-xl flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-bold text-gray-900">{siteSettings.site_name}</span>
            </div>

            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-mango-600 transition-colors cursor-pointer">Features</a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-mango-600 transition-colors cursor-pointer">How It Works</a>
              <a href="#varieties" className="text-sm text-gray-600 hover:text-mango-600 transition-colors cursor-pointer">Varieties</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-mango-600 transition-colors cursor-pointer">Pricing</a>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowCart(true)}
                className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="View cart"
              >
                <ShoppingCart className="w-5 h-5 text-gray-700" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-mango-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                    {cart.length}
                  </span>
                )}
              </button>

              {user ? (
                <Link href="/dashboard" className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer">
                  <User className="w-4 h-4 text-gray-700" />
                  <span className="text-sm font-medium text-gray-700">Dashboard</span>
                </Link>
              ) : (
                <button
                  onClick={() => setShowAuth(true)}
                  className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-xl bg-mango-500 hover:bg-mango-600 text-white text-sm font-semibold transition-colors cursor-pointer"
                >
                  Get Started
                </button>
              )}

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
                aria-label="Toggle menu"
              >
                <Menu className="w-5 h-5 text-gray-700" />
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden pt-4 pb-2 border-t border-gray-100 mt-3 space-y-2">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium cursor-pointer">Features</a>
              <a href="#how-it-works" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium cursor-pointer">How It Works</a>
              <a href="#varieties" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium cursor-pointer">Varieties</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-gray-600 font-medium cursor-pointer">Pricing</a>
              {!user && (
                <button onClick={() => { setMobileMenuOpen(false); setShowAuth(true); }} className="w-full btn-primary mt-2 cursor-pointer">
                  Get Started
                </button>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 badge-success mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Season is live - Order now
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Premium Pakistani
              <span className="text-gradient"> Mangoes</span>
              <br />
              Delivered Fresh
            </h1>

            <p className="text-lg md:text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Experience the authentic taste of Pakistan&apos;s finest mangoes. Handpicked from orchards, delivered to your doorstep within 48 hours.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <a href="#varieties" className="btn-primary flex items-center justify-center gap-2 cursor-pointer">
                Browse Varieties
                <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#how-it-works" className="btn-secondary flex items-center justify-center gap-2 cursor-pointer">
                <Play className="w-4 h-4" />
                See How It Works
              </a>
            </div>

            {/* Social Proof */}
            <div className="flex flex-wrap items-center justify-center gap-6 pt-8 border-t border-gray-100">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-mango-200 to-mango-300 border-2 border-white flex items-center justify-center text-xs font-bold text-mango-700">
                    {String.fromCharCode(64 + i)}
                  </div>
                ))}
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-mango-gold text-mango-gold" />
                  ))}
                </div>
                <p className="text-sm text-gray-600">Trusted by <span className="font-semibold text-gray-900">10,000+</span> customers</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4">Features</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why customers choose us
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              From farm selection to your doorstep, every step is optimized for quality and freshness.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-mango-200 hover:shadow-lg transition-all duration-200 cursor-pointer group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-mango-50 rounded-xl flex items-center justify-center group-hover:bg-mango-100 transition-colors">
                    <feature.icon className="w-6 h-6 text-mango-600" />
                  </div>
                  <span className="badge-primary">{feature.badge}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4">Process</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple ordering, fresh delivery
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Four easy steps from browsing to enjoying the finest Pakistani mangoes.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, index) => (
              <div key={index} className="relative">
                {index < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-px bg-gradient-to-r from-mango-200 to-transparent" />
                )}
                <div className="w-16 h-16 bg-mango-500 rounded-2xl flex items-center justify-center mb-4">
                  <span className="text-xl font-bold text-white">{item.step}</span>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Varieties */}
      <section id="varieties" className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4">Catalog</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Premium mango varieties
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Each variety offers a unique taste experience, hand-picked from the finest orchards.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {varieties.filter(v => v.available).map((variety) => (
              <div
                key={variety.id}
                className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:border-mango-200 transition-all duration-200 group"
              >
                <div className="h-40 bg-gradient-to-br from-mango-200 via-mango-100 to-orange-100 flex items-center justify-center relative">
                  <svg viewBox="0 0 80 80" className="w-16 h-16 group-hover:scale-110 transition-transform duration-300">
                    <ellipse cx="40" cy="45" rx="28" ry="32" fill="url(#mangoGrad)" />
                    <defs>
                      <linearGradient id="mangoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#FFD700" />
                        <stop offset="100%" stopColor="#FF8C00" />
                      </linearGradient>
                    </defs>
                    <ellipse cx="32" cy="32" rx="8" ry="6" fill="rgba(255,255,255,0.25)" />
                  </svg>
                  {variety.name === 'Sindhri' && (
                    <span className="absolute top-3 right-3 bg-mango-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Popular
                    </span>
                  )}
                </div>

                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{variety.name}</h3>
                  <p className="text-gray-500 text-sm mb-3 line-clamp-2">{variety.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-bold text-mango-600">Rs.{variety.price_per_kg}</span>
                      <span className="text-gray-400 text-sm">/kg</span>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star key={star} className="w-3 h-3 fill-mango-gold text-mango-gold" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center bg-gray-100 rounded-lg">
                      <button
                        onClick={() => updateQuantity(variety.id, -1)}
                        className="p-2 hover:bg-gray-200 rounded-l-lg cursor-pointer transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 text-center font-semibold text-sm">{quantities[variety.id] || 1}</span>
                      <button
                        onClick={() => updateQuantity(variety.id, 1)}
                        className="p-2 hover:bg-gray-200 rounded-r-lg cursor-pointer transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => addToCart(variety)}
                      className="flex-1 btn-primary py-2 text-sm flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4">Pricing</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Choose your box
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Curated boxes for every need. All include free delivery and our quality guarantee.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`rounded-2xl p-6 ${
                  plan.popular
                    ? 'bg-mango-500 text-white shadow-xl scale-105 border-2 border-mango-400'
                    : 'bg-white border border-gray-200 hover:border-mango-200 hover:shadow-lg'
                } transition-all duration-200 relative`}
              >
                {plan.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white text-mango-600 text-xs font-bold px-4 py-1 rounded-full shadow-md">
                    Most Popular
                  </span>
                )}

                <h3 className={`text-lg font-bold mb-2 ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                  {plan.name}
                </h3>
                <p className={`text-sm mb-4 ${plan.popular ? 'text-white/80' : 'text-gray-500'}`}>
                  {plan.description}
                </p>

                <div className="mb-6">
                  <span className={`text-4xl font-bold ${plan.popular ? 'text-white' : 'text-gray-900'}`}>
                    Rs.{plan.price}
                  </span>
                  <span className={`text-sm ${plan.popular ? 'text-white/70' : 'text-gray-500'}`}>/box</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <Check className={`w-4 h-4 ${plan.popular ? 'text-white' : 'text-mango-500'}`} />
                      <span className={`text-sm ${plan.popular ? 'text-white/90' : 'text-gray-600'}`}>
                        {feature}
                      </span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => {
                    if (plan.popular) setShowOrderModal(true)
                    else if (index === 2) window.open(`https://wa.me/${siteSettings.contact_phone.replace('+', '')}?text=Hi! I'm interested in the ${plan.name}`, '_blank')
                    else setShowOrderModal(true)
                  }}
                  className={`w-full py-3 rounded-xl font-semibold transition-all cursor-pointer ${
                    plan.popular
                      ? 'bg-white text-mango-600 hover:bg-gray-100'
                      : 'bg-mango-500 text-white hover:bg-mango-600'
                  }`}
                >
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 bg-gray-50/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="badge-primary mb-4">Testimonials</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by customers
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don&apos;t just take our word for it. Here&apos;s what our customers say.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-200">
                <Quote className="w-8 h-8 text-mango-200 mb-4" />
                <p className="text-gray-700 mb-6 leading-relaxed">{testimonial.text}</p>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-bold text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: testimonial.rating }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-mango-gold text-mango-gold" />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-mango-500 via-mango-500 to-mango-gold rounded-3xl p-8 md:p-16 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Ready to taste the best?
              </h2>
              <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
                Order now and experience the authentic taste of premium Pakistani mangoes delivered fresh to your doorstep.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#varieties" className="bg-white text-mango-600 hover:bg-gray-100 py-3 px-8 rounded-xl font-semibold transition-all cursor-pointer">
                  Browse Varieties
                </a>
                <a
                  href={`https://wa.me/${siteSettings.contact_phone.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-green-500 text-white hover:bg-green-600 py-3 px-8 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <MessageCircle className="w-5 h-5" />
                  WhatsApp Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-mango-500 to-mango-gold rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">{siteSettings.site_name}</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md">
                {siteSettings.footer_text}. We deliver premium Pakistani mangoes to cities across Pakistan.
              </p>
              <div className="flex gap-3">
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-mango-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer" aria-label="Instagram">
                  <Instagram className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-mango-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer" aria-label="Facebook">
                  <Facebook className="w-5 h-5" />
                </a>
                <a href="#" className="w-10 h-10 bg-gray-800 hover:bg-mango-500 rounded-lg flex items-center justify-center transition-colors cursor-pointer" aria-label="WhatsApp">
                  <MessageCircle className="w-5 h-5" />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><a href="#varieties" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Our Varieties</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white transition-colors cursor-pointer">How It Works</a></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Pricing</a></li>
                <li><a href="#features" className="text-gray-400 hover:text-white transition-colors cursor-pointer">Features</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-bold mb-4">Contact</h4>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-mango-500" />
                  <a href={`tel:${siteSettings.contact_phone}`} className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                    {siteSettings.contact_phone}
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MapPin className="w-5 h-5 text-mango-500" />
                  <span className="text-gray-400">Sindh, Pakistan</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-mango-500" />
                  <span className="text-gray-400">info@malirmangoes.com</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm">
              © 2025 {siteSettings.site_name}. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-gray-500 text-sm">
              <Shield className="w-4 h-4" />
              Secure Payments • Quality Guaranteed
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Cart - Mobile */}
      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-2xl p-4 md:hidden">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setShowCart(true)}
              className="relative p-3 bg-mango-100 rounded-xl cursor-pointer"
              aria-label="View cart"
            >
              <ShoppingCart className="w-6 h-6 text-mango-600" />
              <span className="absolute -top-1 -right-1 bg-mango-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {cart.length}
              </span>
            </button>
            <div className="flex-1">
              <div className="text-sm text-gray-500">Total</div>
              <div className="text-xl font-bold text-gray-900">Rs.{cartTotal}</div>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="btn-primary flex items-center gap-2 py-3 px-6 cursor-pointer"
            >
              Checkout
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {showCart && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end md:items-center justify-center" onClick={(e) => { if (e.target === e.currentTarget) setShowCart(false) }}>
          <div className="bg-white w-full md:max-w-md md:rounded-2xl max-h-[85vh] overflow-hidden shadow-2xl">
            <div className="p-4 md:p-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-bold text-xl text-gray-900">Your Cart</h3>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" aria-label="Close cart">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 md:p-6 overflow-y-auto max-h-[50vh]">
              {cart.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-20 h-20 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-gray-400" />
                  </div>
                  <p className="text-gray-500">Your cart is empty</p>
                  <button onClick={() => setShowCart(false)} className="btn-ghost mt-4 cursor-pointer">
                    Browse Varieties
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map(item => (
                    <div key={item.variety_id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-xl">
                      <div className="w-12 h-12 bg-gradient-to-br from-mango-200 to-orange-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">🥭</span>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">{item.variety_name}</p>
                        <p className="text-sm text-gray-500">{item.quantity}kg × Rs.{item.price_per_kg}/kg</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-mango-600">Rs.{item.quantity * item.price_per_kg}</span>
                        <button
                          onClick={() => removeFromCart(item.variety_id)}
                          className="p-1 hover:bg-red-100 rounded-lg cursor-pointer transition-colors"
                          aria-label={`Remove ${item.variety_name}`}
                        >
                          <X className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-4 md:p-6 border-t border-gray-100 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-mango-600">Rs.{cartTotal}</span>
                </div>

                <div className="space-y-3 mb-4">
                  <input
                    type="text"
                    placeholder="Your Name"
                    value={customerName}
                    onChange={e => setCustomerName(e.target.value)}
                    className="input-field"
                  />
                  <input
                    type="tel"
                    placeholder="Phone Number"
                    value={customerPhone}
                    onChange={e => setCustomerPhone(e.target.value)}
                    className="input-field"
                  />
                  <select
                    value={selectedCity}
                    onChange={e => setSelectedCity(e.target.value)}
                    className="input-field"
                  >
                    <option value="">Select City</option>
                    <option value="Karachi">Karachi</option>
                    <option value="Lahore">Lahore</option>
                    <option value="Islamabad">Islamabad</option>
                    <option value="Peshawar">Peshawar</option>
                    <option value="Quetta">Quetta</option>
                    <option value="Faisalabad">Faisalabad</option>
                    <option value="Multan">Multan</option>
                    <option value="Rawalpindi">Rawalpindi</option>
                    <option value="Hyderabad">Hyderabad</option>
                    <option value="Sukkur">Sukkur</option>
                    <option value="Other">Other</option>
                  </select>
                  <input
                    type="text"
                    placeholder="Delivery Address"
                    value={deliveryAddress}
                    onChange={e => setDeliveryAddress(e.target.value)}
                    className="input-field"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={handleWebsiteOrder}
                    className="flex-1 btn-primary flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Check className="w-5 h-5" />
                    Order on Website
                  </button>
                  <button
                    onClick={handleWhatsAppOrder}
                    className="flex-1 bg-green-500 text-white hover:bg-green-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <MessageCircle className="w-5 h-5" />
                    WhatsApp
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Auth Modal */}
      {showAuth && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowAuth(false) }}>
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-900">{isLogin ? 'Welcome Back' : 'Create Account'}</h3>
              <button onClick={() => setShowAuth(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              {!isLogin && (
                <input
                  type="text"
                  placeholder="Your Name"
                  value={authName}
                  onChange={e => setAuthName(e.target.value)}
                  className="input-field"
                />
              )}
              <input
                type="email"
                placeholder="Email"
                value={authEmail}
                onChange={e => setAuthEmail(e.target.value)}
                className="input-field"
              />
              <input
                type="password"
                placeholder="Password"
                value={authPassword}
                onChange={e => setAuthPassword(e.target.value)}
                className="input-field"
              />
              {authError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-600 text-sm">{authError}</p>
                </div>
              )}
              <button
                onClick={handleAuth}
                disabled={authLoading}
                className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
              >
                {authLoading ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Please wait...
                  </>
                ) : (
                  isLogin ? 'Login' : 'Create Account'
                )}
              </button>
            </div>

            <p className="text-center mt-6 text-gray-600">
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-mango-600 font-bold hover:text-mango-700 cursor-pointer"
              >
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </div>
        </div>
      )}

      {/* Order Modal (from pricing) */}
      {showOrderModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => { if (e.target === e.currentTarget) setShowOrderModal(false) }}>
          <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-xl text-gray-900">Quick Order</h3>
              <button onClick={() => setShowOrderModal(false)} className="p-2 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors" aria-label="Close">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-gray-600 text-sm mb-4">Select your preferred order method:</p>

            <div className="space-y-3">
              <button
                onClick={() => { setShowOrderModal(false); setShowCart(true) }}
                className="w-full btn-primary flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" />
                Order via Cart
              </button>
              <a
                href={`https://wa.me/${siteSettings.contact_phone.replace('+', '')}?text=Hi! I'd like to place an order.`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-500 text-white hover:bg-green-600 py-3 px-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5" />
                Order via WhatsApp
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
