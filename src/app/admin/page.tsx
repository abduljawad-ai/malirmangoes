'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase, MangoVariety } from '@/lib/supabase'
import { Package, Plus, X, Edit, Trash2, Save, Image, LogOut, Users, ShoppingBag, MessageCircle, Settings, Globe, Upload } from 'lucide-react'
import Link from 'next/link'

interface SiteSettings {
  site_name: string
  logo_url: string
  hero_title: string
  hero_subtitle: string
  hero_image: string
  footer_text: string
  contact_phone: string
}

export default function AdminPage() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [varieties, setVarieties] = useState<MangoVariety[]>([])
  const [activeTab, setActiveTab] = useState('products')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({ name: '', description: '', price_per_kg: '', available: true })
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    site_name: 'Malir Mangoes',
    logo_url: '',
    hero_title: 'Premium Pakistani Mangoes',
    hero_subtitle: 'Fresh from orchards to your doorstep',
    hero_image: '',
    footer_text: 'Fresh mangoes delivered all over Pakistan',
    contact_phone: '+923283181163',
  })
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const [heroImageFile, setHeroImageFile] = useState<File | null>(null)

  useEffect(() => {
    if (!loading && (!user || user.role === 'user')) {
      router.push('/')
    }
  }, [user, loading])

  useEffect(() => {
    if (user && (user.role === 'admin' || user.role === 'seller')) {
      fetchVarieties()
      fetchSiteSettings()
    }
  }, [user])

  async function fetchVarieties() {
    const { data } = await supabase.from('mango_varieties').select('*').order('name')
    if (data) setVarieties(data)
  }

  async function fetchSiteSettings() {
    const { data } = await supabase.from('site_settings').select('*').limit(1).single()
    if (data) {
      setSiteSettings({
        site_name: data.site_name || 'Malir Mangoes',
        logo_url: data.logo_url || '',
        hero_title: data.hero_title || 'Premium Pakistani Mangoes',
        hero_subtitle: data.hero_subtitle || 'Fresh from orchards to your doorstep',
        hero_image: data.hero_image || '',
        footer_text: data.footer_text || 'Fresh mangoes delivered all over Pakistan',
        contact_phone: data.contact_phone || '+923283181163',
      })
    }
  }

  async function handleSaveProduct() {
    setUploading(true)
    let image_url = ''

    if (imageFile) {
      const fileName = `products/${Date.now()}-${imageFile.name}`
      const { data, error } = await supabase.storage.from('mango-images').upload(fileName, imageFile)
      if (!error) {
        const { data: urlData } = supabase.storage.from('mango-images').getPublicUrl(fileName)
        image_url = urlData.publicUrl
      }
    }

    const payload = {
      name: formData.name,
      description: formData.description,
      price_per_kg: Number(formData.price_per_kg),
      available: formData.available,
      image_url,
    }

    if (editingId) {
      await supabase.from('mango_varieties').update(payload).eq('id', editingId)
    } else {
      await supabase.from('mango_varieties').insert(payload)
    }

    setEditingId(null)
    setFormData({ name: '', description: '', price_per_kg: '', available: true })
    setImageFile(null)
    setUploading(false)
    fetchVarieties()
  }

  async function handleSaveSettings() {
    setUploading(true)
    let logo_url = siteSettings.logo_url
    let hero_image_url = ''

    // Upload logo
    if (logoFile) {
      const fileName = `logo/${Date.now()}-${logoFile.name}`
      const { error } = await supabase.storage.from('mango-images').upload(fileName, logoFile)
      if (!error) {
        const { data: urlData } = supabase.storage.from('mango-images').getPublicUrl(fileName)
        logo_url = urlData.publicUrl
      }
    }

    // Upload hero image
    if (heroImageFile) {
      const fileName = `hero/${Date.now()}-${heroImageFile.name}`
      const { error } = await supabase.storage.from('mango-images').upload(fileName, heroImageFile)
      if (!error) {
        const { data: urlData } = supabase.storage.from('mango-images').getPublicUrl(fileName)
        hero_image_url = urlData.publicUrl
      }
    }

    // Check if settings exist
    const { data: existing } = await supabase.from('site_settings').select('id').limit(1).single()

    const payload = {
      site_name: siteSettings.site_name,
      logo_url: logo_url || siteSettings.logo_url,
      hero_title: siteSettings.hero_title,
      hero_subtitle: siteSettings.hero_subtitle,
      hero_image: hero_image_url || siteSettings.hero_image,
      footer_text: siteSettings.footer_text,
      contact_phone: siteSettings.contact_phone,
    }

    if (existing) {
      await supabase.from('site_settings').update(payload).eq('id', existing.id)
    } else {
      await supabase.from('site_settings').insert(payload)
    }

    setLogoFile(null)
    setHeroImageFile(null)
    setUploading(false)
    alert('Settings saved!')
  }

  async function handleDelete(id: string) {
    if (confirm('Are you sure you want to delete this variety?')) {
      await supabase.from('mango_varieties').delete().eq('id', id)
      fetchVarieties()
    }
  }

  function startEdit(variety: MangoVariety) {
    setEditingId(variety.id)
    setFormData({
      name: variety.name,
      description: variety.description || '',
      price_per_kg: String(variety.price_per_kg),
      available: variety.available,
    })
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  if (loading || !user || user.role === 'user') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-500">Manage Products & Content</p>
          </div>
          <button onClick={handleSignOut} className="p-2 text-gray-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto flex">
          <button
            onClick={() => setActiveTab('products')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${
              activeTab === 'products'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500'
            }`}
          >
            <Package className="w-4 h-4" />
            Products
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${
              activeTab === 'settings'
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500'
            }`}
          >
            <Settings className="w-4 h-4" />
            Site Settings
          </button>
        </div>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div className="max-w-md mx-auto p-4">
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-4">{editingId ? 'Edit Variety' : 'Add New Variety'}</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="Variety Name"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="input-field"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="input-field min-h-[80px]"
              />
              <input
                type="number"
                placeholder="Price per kg (Rs.)"
                value={formData.price_per_kg}
                onChange={e => setFormData({ ...formData, price_per_kg: e.target.value })}
                className="input-field"
              />
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="available"
                  checked={formData.available}
                  onChange={e => setFormData({ ...formData, available: e.target.checked })}
                  className="w-4 h-4"
                />
                <label htmlFor="available" className="text-sm">Available for sale</label>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex-1 cursor-pointer border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Image className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-sm text-gray-500">
                    {imageFile ? imageFile.name : 'Product Image'}
                  </span>
                </label>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveProduct}
                  disabled={uploading || !formData.name || !formData.price_per_kg}
                  className="flex-1 btn-primary flex items-center justify-center gap-2"
                >
                  <Save className="w-4 h-4" />
                  {uploading ? 'Saving...' : 'Save'}
                </button>
                {editingId && (
                  <button
                    onClick={() => {
                      setEditingId(null)
                      setFormData({ name: '', description: '', price_per_kg: '', available: true })
                    }}
                    className="px-4 py-3 border border-gray-300 rounded-lg"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>

          <h3 className="font-semibold mb-4">Manage Varieties</h3>
          <div className="space-y-3">
            {varieties.map(variety => (
              <div key={variety.id} className="bg-white rounded-xl p-4 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center flex-shrink-0">
                    {variety.image_url ? (
                      <img src={variety.image_url} alt={variety.name} className="w-full h-full object-cover rounded-lg" />
                    ) : (
                      <span className="text-2xl">🥭</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold">{variety.name}</h4>
                        <p className="text-sm text-gray-500">{variety.description}</p>
                      </div>
                      <span className="text-orange-600 font-bold">Rs.{variety.price_per_kg}/kg</span>
                    </div>
                    <div className="flex items-center gap-2 mt-3">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        variety.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}>
                        {variety.available ? 'Available' : 'Unavailable'}
                      </span>
                      <button
                        onClick={() => startEdit(variety)}
                        className="ml-auto p-2 text-gray-500 hover:text-orange-600"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(variety.id)}
                        className="p-2 text-gray-500 hover:text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Site Settings Tab */}
      {activeTab === 'settings' && (
        <div className="max-w-md mx-auto p-4">
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-4">Site Logo & Branding</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-xl bg-orange-100 flex items-center justify-center overflow-hidden">
                  {logoFile ? (
                    <img src={URL.createObjectURL(logoFile)} alt="Logo" className="w-full h-full object-cover" />
                  ) : siteSettings.logo_url ? (
                    <img src={siteSettings.logo_url} alt="Logo" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-3xl">🥭</span>
                  )}
                </div>
                <label className="flex-1 cursor-pointer border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setLogoFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-sm text-gray-500">
                    {logoFile ? logoFile.name : 'Upload Logo'}
                  </span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Site Name"
                value={siteSettings.site_name}
                onChange={e => setSiteSettings({ ...siteSettings, site_name: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-4">Hero Section</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-lg bg-gradient-to-br from-orange-300 to-orange-400 flex items-center justify-center overflow-hidden">
                  {heroImageFile ? (
                    <img src={URL.createObjectURL(heroImageFile)} alt="Hero" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-2xl">🥭</span>
                  )}
                </div>
                <label className="flex-1 cursor-pointer border border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={e => setHeroImageFile(e.target.files?.[0] || null)}
                    className="hidden"
                  />
                  <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                  <span className="text-sm text-gray-500">
                    {heroImageFile ? heroImageFile.name : 'Hero Image'}
                  </span>
                </label>
              </div>
              <input
                type="text"
                placeholder="Hero Title"
                value={siteSettings.hero_title}
                onChange={e => setSiteSettings({ ...siteSettings, hero_title: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Hero Subtitle"
                value={siteSettings.hero_subtitle}
                onChange={e => setSiteSettings({ ...siteSettings, hero_subtitle: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <h3 className="font-semibold mb-4">Contact Info</h3>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="WhatsApp Number (with country code)"
                value={siteSettings.contact_phone}
                onChange={e => setSiteSettings({ ...siteSettings, contact_phone: e.target.value })}
                className="input-field"
              />
              <input
                type="text"
                placeholder="Footer Text"
                value={siteSettings.footer_text}
                onChange={e => setSiteSettings({ ...siteSettings, footer_text: e.target.value })}
                className="input-field"
              />
            </div>
          </div>

          <button
            onClick={handleSaveSettings}
            disabled={uploading}
            className="w-full btn-primary flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            {uploading ? 'Saving...' : 'Save All Settings'}
          </button>
        </div>
      )}

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto flex">
          <Link href="/dashboard" className="flex-1 flex flex-col items-center py-3 text-gray-400">
            <ShoppingBag className="w-5 h-5" />
            <span className="text-xs mt-1">Orders</span>
          </Link>
          <button onClick={() => setActiveTab('products')} className="flex-1 flex flex-col items-center py-3 text-orange-600">
            <Package className="w-5 h-5" />
            <span className="text-xs mt-1">Products</span>
          </button>
          <button onClick={() => setActiveTab('settings')} className="flex-1 flex flex-col items-center py-3 text-gray-400">
            <Settings className="w-5 h-5" />
            <span className="text-xs mt-1">Settings</span>
          </button>
        </div>
      </nav>
    </div>
  )
}