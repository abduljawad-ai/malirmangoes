'use client'

import { useState, useEffect, useCallback } from 'react'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '@/lib/firebase'
import toast from 'react-hot-toast'

export interface SiteSettings {
  // Hero Section
  heroTitle: string
  heroSubtitle: string
  heroDescription: string
  heroImages: string[]
  
  // Branding
  logoUrl: string
  faviconUrl: string
  
  // Contact Info
  phone: string
  email: string
  address: string
  
  // Social Links
  whatsapp: string
  facebook: string
  instagram: string
  
  // SEO
  siteTitle: string
  siteDescription: string
  
  // Features
  featureTitle: string
  featureDescription: string
  feature1Title: string
  feature1Desc: string
  feature2Title: string
  feature2Desc: string
  feature3Title: string
  feature3Desc: string
  feature4Title: string
  feature4Desc: string
  
  // CTA
  ctaTitle: string
  ctaDescription: string
  
  // Footer
  footerText: string

  // Why Choose Us (homepage section)
  whyUs1Title: string
  whyUs1Desc: string
  whyUs2Title: string
  whyUs2Desc: string
  whyUs3Title: string
  whyUs3Desc: string
  
  // Carousel
  carouselImages: { src: string; name: string; tagline: string; color: string }[]
}

const defaultSettings: SiteSettings = {
  heroTitle: 'Taste the Golden Standard of Mangoes',
  heroSubtitle: 'Premium Organic Harvest 2026',
  heroDescription: 'Experience the legendary sweetness of authentic Pakistani mangoes. Hand-selected from Multan\'s finest orchards, naturally ripened, and delivered fresh to your table.',
  heroImages: [
    'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/hero.jpg',
    'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/honey-mango.jpg',
    'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/mango-box.jpg',
    'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/premium_mango_box.jpg',
  ],
  logoUrl: '/logo.png',
  faviconUrl: '/favicon.ico',
  phone: '+92 300 1234567',
  email: 'hello@mangostore.pk',
  address: 'Mango District, Multan, Pakistan',
  whatsapp: '+92 300 1234567',
  facebook: 'https://facebook.com/mangostore',
  instagram: 'https://instagram.com/mangostore',
  siteTitle: 'MangoStore - Premium Pakistani Mangoes',
  siteDescription: 'Fresh Pakistani mangoes delivered to your door',
  featureTitle: 'Why Choose MangoStore?',
  featureDescription: 'We are committed to delivering the freshest, most flavorful mangoes right to your door.',
  feature1Title: 'Farm Fresh',
  feature1Desc: 'Hand-picked daily from our orchards',
  feature2Title: 'Fast Delivery',
  feature2Desc: 'Delivered within 24 hours',
  feature3Title: 'Quality Guarantee',
  feature3Desc: '100% fresh or full refund',
  feature4Title: 'Premium Quality',
  feature4Desc: 'Only the finest mangoes selected',
  ctaTitle: 'Ready to Taste the Best?',
  ctaDescription: 'Order now and experience the authentic flavor of premium Pakistani mangoes delivered fresh to your door. Limited harvest season!',
  footerText: 'Delivering the finest Chaunsa, Sindhri, and Anwar Ratol mangoes from our orchards in Pakistan directly to your doorstep.',
  whyUs1Title: 'Tree to Table Freshness',
  whyUs1Desc: "Hand-picked at peak ripeness, packed same day. You'll taste the difference from the first bite.",
  whyUs2Title: 'Authentic Pakistani Varieties',
  whyUs2Desc: "True Chaunsa, Sindhri, Dusehri and Langra — the real deal, not imitation varieties.",
  whyUs3Title: 'Hassle-Free Guarantee',
  whyUs3Desc: "Not happy with your order? We'll replace it or refund you, no questions asked.",
  carouselImages: [
    { src: 'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/hero.jpg', name: 'Premium Selection', tagline: 'Finest Quality', color: 'from-orange-500 to-amber-500' },
    { src: 'https://res.cloudinary.com/dzimmsjyx/image/upload/mangostore/mangostore/honey-mango.jpg', name: 'Chaunsa', tagline: 'King of Mangoes', color: 'from-amber-400 to-orange-500' },
    { src: '/images/mango-box.png', name: 'Sindhri', tagline: 'Honey Sweet', color: 'from-yellow-400 to-amber-500' },
    { src: '/images/premium_mango_box.png', name: 'Anwar Ratol', tagline: 'Extra Sweet', color: 'from-orange-400 to-red-400' },
  ],
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Fetch settings from Firestore
  const fetchSettings = useCallback(async () => {
    try {
      setLoading(true)
      const docRef = doc(db, 'settings', 'site')
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        const data = { ...defaultSettings, ...docSnap.data() as Partial<SiteSettings> }
        setSettings(data)
        // Cache to localStorage for offline use
        localStorage.setItem('siteSettings', JSON.stringify(data))
      } else {
        // Initialize with default settings
        try {
          await setDoc(docRef, defaultSettings)
        } catch (initError) {
        }
      }
    } catch {
      const cached = localStorage.getItem('siteSettings')
      if (cached) {
        try {
          setSettings({ ...defaultSettings, ...JSON.parse(cached) })
        } catch {
          setSettings(defaultSettings)
        }
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Update a single setting field
  const updateSetting = useCallback(async (key: string, value: unknown) => {
    try {
      setSaving(true)
      const docRef = doc(db, 'settings', 'site')
      await updateDoc(docRef, { [key]: value })
      setSettings(prev => ({ ...prev, [key]: value }))
      toast.success('Setting updated successfully')
    } catch (error) {
      toast.error('Failed to update setting')
    } finally {
      setSaving(false)
    }
  }, [])

  // Update multiple settings at once
  const updateSettings = useCallback(async (newSettings: Partial<SiteSettings>) => {
    try {
      setSaving(true)
      const docRef = doc(db, 'settings', 'site')
      await updateDoc(docRef, newSettings)
      setSettings(prev => ({ ...prev, ...newSettings }))
      toast.success('Settings updated successfully')
    } catch (error) {
      toast.error('Failed to update settings')
    } finally {
      setSaving(false)
    }
  }, [])

  // Upload image to Firebase Storage
  const uploadImage = useCallback(async (file: File, path: string): Promise<string> => {
    try {
      const storageRef = ref(storage, `site-images/${path}/${Date.now()}_${file.name}`)
      await uploadBytes(storageRef, file)
      const downloadUrl = await getDownloadURL(storageRef)
      return downloadUrl
    } catch (error) {
      toast.error('Failed to upload image')
      throw error
    }
  }, [])

  // Upload and update hero image
  const updateHeroImage = useCallback(async (index: number, file: File) => {
    try {
      const url = await uploadImage(file, 'hero')
      const newImages = [...settings.heroImages]
      newImages[index] = url
      await updateSetting('heroImages', newImages)
      return url
    } catch (error) {
      throw error
    }
  }, [settings.heroImages, updateSetting, uploadImage])

  // Upload and update logo
  const updateLogo = useCallback(async (file: File) => {
    try {
      const url = await uploadImage(file, 'logo')
      await updateSetting('logoUrl', url)
      return url
    } catch (error) {
      throw error
    }
  }, [updateSetting, uploadImage])

  // Upload and update carousel image
  const updateCarouselImage = useCallback(async (index: number, file: File, name: string, tagline: string) => {
    try {
      const url = await uploadImage(file, 'carousel')
      const newImages = [...settings.carouselImages]
      newImages[index] = { 
        ...newImages[index], 
        src: url,
        name: name || newImages[index].name,
        tagline: tagline || newImages[index].tagline
      }
      await updateSetting('carouselImages', newImages)
      return url
    } catch (error) {
      throw error
    }
  }, [settings.carouselImages, updateSetting, uploadImage])

  return {
    settings,
    loading,
    saving,
    updateSetting,
    updateSettings,
    updateHeroImage,
    updateLogo,
    updateCarouselImage,
    uploadImage,
    refreshSettings: fetchSettings,
  }
}
