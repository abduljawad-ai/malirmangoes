'use client'

import React, { useState, useRef } from 'react'
import { useSettings } from '@/hooks/useSettings'
import { Upload, ImageIcon, Type, Phone, Mail, MapPin, Globe, Share2, Save, Loader2, X } from 'lucide-react'
import Button from '@/components/ui/Button'

interface CarouselModalProps {
  isOpen: boolean
  currentName: string
  currentTagline: string
  onConfirm: (name: string, tagline: string) => void
  onCancel: () => void
}

function CarouselModal({ isOpen, currentName, currentTagline, onConfirm, onCancel }: CarouselModalProps) {
  const [name, setName] = useState(currentName)
  const [tagline, setTagline] = useState(currentTagline)

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md p-6 m-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Carousel Image Details</h3>
          <button onClick={onCancel} className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Mango Variety Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Chaunsa Premium"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. King of Mangoes"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            />
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="ghost" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={() => onConfirm(name, tagline)}>
            Save
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function AdminSettingsPage() {
  const { settings, loading, saving, updateSetting, updateHeroImage, updateLogo, updateCarouselImage } = useSettings()
  const [activeTab, setActiveTab] = useState('general')
  const [editForm, setEditForm] = useState<Record<string, string>>({})
  const [carouselModal, setCarouselModal] = useState<{
    isOpen: boolean
    index: number
    file: File | null
  }>({ isOpen: false, index: -1, file: null })
  
  const heroFileRefs = useRef<(HTMLInputElement | null)[]>([])
  const logoFileRef = useRef<HTMLInputElement>(null)
  const carouselFileRefs = useRef<(HTMLInputElement | null)[]>([])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    )
  }

  const handleTextChange = (key: string, value: string) => {
    setEditForm(prev => ({ ...prev, [key]: value }))
  }

  const saveTextSetting = async (key: string) => {
    if (editForm[key] !== undefined) {
      await updateSetting(key, editForm[key])
      setEditForm(prev => {
        const newForm = { ...prev }
        delete newForm[key]
        return newForm
      })
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'hero' | 'logo' | 'carousel', index?: number) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'hero' && index !== undefined) {
      try {
        await updateHeroImage(index, file)
      } catch (error) {
        console.error('Failed to update hero image:', error)
      }
    } else if (type === 'logo') {
      try {
        await updateLogo(file)
      } catch (error) {
        console.error('Failed to update logo:', error)
      }
    } else if (type === 'carousel' && index !== undefined) {
      // Open modal for carousel images
      setCarouselModal({ isOpen: true, index, file })
    }

    e.target.value = ''
  }

  const handleCarouselModalConfirm = async (name: string, tagline: string) => {
    if (carouselModal.file && carouselModal.index >= 0) {
      try {
        await updateCarouselImage(carouselModal.index, carouselModal.file, name, tagline)
      } catch (error) {
        console.error('Failed to update carousel image:', error)
      }
    }
    setCarouselModal({ isOpen: false, index: -1, file: null })
  }

  const handleCarouselModalCancel = () => {
    setCarouselModal({ isOpen: false, index: -1, file: null })
  }

  const tabs = [
    { id: 'general', label: 'General', icon: Type },
    { id: 'images', label: 'Images', icon: ImageIcon },
    { id: 'contact', label: 'Contact', icon: Phone },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Store Settings</h1>
        <p className="text-gray-500 mt-1">Manage your store content, images, and contact information</p>
      </div>

      <div className="flex gap-2 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-medium transition-colors ${
              activeTab === tab.id
                ? 'text-orange-600 border-b-2 border-orange-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'general' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Hero Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Title</label>
                <textarea
                  defaultValue={settings.heroTitle}
                  onChange={(e) => handleTextChange('heroTitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  rows={2}
                />
                {editForm.heroTitle !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('heroTitle')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Hero Description</label>
                <textarea
                  defaultValue={settings.heroDescription}
                  onChange={(e) => handleTextChange('heroDescription', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  rows={3}
                />
                {editForm.heroDescription !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('heroDescription')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Features Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Title</label>
                <input
                  type="text"
                  defaultValue={settings.featureTitle}
                  onChange={(e) => handleTextChange('featureTitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                {editForm.featureTitle !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('featureTitle')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Section Description</label>
                <textarea
                  defaultValue={settings.featureDescription}
                  onChange={(e) => handleTextChange('featureDescription', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  rows={2}
                />
                {editForm.featureDescription !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('featureDescription')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-sm font-semibold text-gray-500 mb-3">Feature Cards</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { n: 1, titleKey: 'feature1Title', descKey: 'feature1Desc' },
                    { n: 2, titleKey: 'feature2Title', descKey: 'feature2Desc' },
                    { n: 3, titleKey: 'feature3Title', descKey: 'feature3Desc' },
                    { n: 4, titleKey: 'feature4Title', descKey: 'feature4Desc' },
                  ].map(({ n, titleKey, descKey }) => (
                    <div key={n} className="space-y-2 p-3 rounded-lg border border-gray-100 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-400">Feature {n}</p>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Title</label>
                        <input
                          type="text"
                          defaultValue={settings[titleKey as keyof typeof settings] as string}
                          onChange={(e) => handleTextChange(titleKey, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm"
                        />
                        {editForm[titleKey] !== undefined && (
                          <div className="mt-1 flex justify-end">
                            <Button size="sm" onClick={() => saveTextSetting(titleKey)} disabled={saving}>
                              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              Save
                            </Button>
                          </div>
                        )}
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
                        <textarea
                          defaultValue={settings[descKey as keyof typeof settings] as string}
                          onChange={(e) => handleTextChange(descKey, e.target.value)}
                          className="w-full px-3 py-1.5 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 text-sm resize-none"
                          rows={2}
                        />
                        {editForm[descKey] !== undefined && (
                          <div className="mt-1 flex justify-end">
                            <Button size="sm" onClick={() => saveTextSetting(descKey)} disabled={saving}>
                              {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                              Save
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Why Choose Us Cards</h2>
            <div className="space-y-6">
              {[
                { num: 1, titleKey: 'whyUs1Title', descKey: 'whyUs1Desc' },
                { num: 2, titleKey: 'whyUs2Title', descKey: 'whyUs2Desc' },
                { num: 3, titleKey: 'whyUs3Title', descKey: 'whyUs3Desc' },
              ].map(({ num, titleKey, descKey }) => (
                <div key={num} className="border-b border-gray-100 last:border-0 pb-5 last:pb-0">
                  <p className="text-sm font-semibold text-gray-500 mb-3">Card {num}</p>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                      <input
                        type="text"
                        defaultValue={settings[titleKey as keyof typeof settings] as string}
                        onChange={(e) => handleTextChange(titleKey, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                      />
                      {editForm[titleKey] !== undefined && (
                        <div className="mt-1.5 flex justify-end">
                          <Button size="sm" onClick={() => saveTextSetting(titleKey)} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                      <textarea
                        defaultValue={settings[descKey as keyof typeof settings] as string}
                        onChange={(e) => handleTextChange(descKey, e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                        rows={2}
                      />
                      {editForm[descKey] !== undefined && (
                        <div className="mt-1.5 flex justify-end">
                          <Button size="sm" onClick={() => saveTextSetting(descKey)} disabled={saving}>
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">CTA Section</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Title</label>
                <input
                  type="text"
                  defaultValue={settings.ctaTitle}
                  onChange={(e) => handleTextChange('ctaTitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                {editForm.ctaTitle !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('ctaTitle')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">CTA Description</label>
                <textarea
                  defaultValue={settings.ctaDescription}
                  onChange={(e) => handleTextChange('ctaDescription', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  rows={3}
                />
                {editForm.ctaDescription !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('ctaDescription')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">SEO Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Title</label>
                <input
                  type="text"
                  defaultValue={settings.siteTitle}
                  onChange={(e) => handleTextChange('siteTitle', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                />
                {editForm.siteTitle !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('siteTitle')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
                <textarea
                  defaultValue={settings.siteDescription}
                  onChange={(e) => handleTextChange('siteDescription', e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
                  rows={2}
                />
                {editForm.siteDescription !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('siteDescription')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'images' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Logo</h2>
            <div className="flex items-center gap-6">
              <img src={settings.logoUrl} alt="Current Logo" className="w-24 h-24 object-contain border border-gray-200 rounded-lg" />
              <div>
                <input ref={logoFileRef} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo')} className="hidden" />
                <Button variant="outline" onClick={() => logoFileRef.current?.click()} disabled={saving}>
                  <Upload className="w-4 h-4 mr-2" />
                  {saving ? 'Uploading...' : 'Change Logo'}
                </Button>
                <p className="text-xs text-gray-500 mt-2">Recommended: PNG with transparent background</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Hero Images</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {settings.heroImages.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image} alt={`Hero ${index + 1}`} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                    <input ref={el => { heroFileRefs.current[index] = el }} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'hero', index)} className="hidden" />
                    <Button size="sm" variant="outline" className="bg-white" onClick={() => heroFileRefs.current[index]?.click()} disabled={saving}>
                      <Upload className="w-4 h-4 mr-1" />
                      Replace
                    </Button>
                  </div>
                  <span className="absolute bottom-2 left-2 text-xs font-medium text-white bg-black/50 px-2 py-1 rounded">Image {index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Carousel Images</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {settings.carouselImages.map((image, index) => (
                <div key={index} className="space-y-2">
                  <div className="relative group">
                    <img src={image.src} alt={image.name} className="w-full aspect-square object-cover rounded-lg border border-gray-200" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                      <input ref={el => { carouselFileRefs.current[index] = el }} type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'carousel', index)} className="hidden" />
                      <Button size="sm" variant="outline" className="bg-white" onClick={() => carouselFileRefs.current[index]?.click()} disabled={saving}>
                        <Upload className="w-4 h-4 mr-1" />
                        Replace
                      </Button>
                    </div>
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{image.name}</p>
                    <p className="text-gray-500 text-xs">{image.tagline}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Contact Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Phone className="w-4 h-4 inline mr-2" />Phone Number</label>
                <input type="text" defaultValue={settings.phone} onChange={(e) => handleTextChange('phone', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                {editForm.phone !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('phone')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Mail className="w-4 h-4 inline mr-2" />Email Address</label>
                <input type="email" defaultValue={settings.email} onChange={(e) => handleTextChange('email', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" />
                {editForm.email !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('email')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><MapPin className="w-4 h-4 inline mr-2" />Address</label>
                <textarea defaultValue={settings.address} onChange={(e) => handleTextChange('address', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" rows={2} />
                {editForm.address !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('address')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Social Links</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Globe className="w-4 h-4 inline mr-2" />WhatsApp Number</label>
                <input type="text" defaultValue={settings.whatsapp} onChange={(e) => handleTextChange('whatsapp', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="+92 300 1234567" />
                {editForm.whatsapp !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('whatsapp')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Share2 className="w-4 h-4 inline mr-2" />Facebook URL</label>
                <input type="url" defaultValue={settings.facebook} onChange={(e) => handleTextChange('facebook', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="https://facebook.com/yourpage" />
                {editForm.facebook !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('facebook')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2"><Share2 className="w-4 h-4 inline mr-2" />Instagram URL</label>
                <input type="url" defaultValue={settings.instagram} onChange={(e) => handleTextChange('instagram', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500" placeholder="https://instagram.com/yourhandle" />
                {editForm.instagram !== undefined && (
                  <div className="mt-2 flex justify-end">
                    <Button size="sm" onClick={() => saveTextSetting('instagram')} disabled={saving}>
                      {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      
      <CarouselModal
        isOpen={carouselModal.isOpen}
        currentName={carouselModal.index >= 0 ? settings.carouselImages[carouselModal.index]?.name || '' : ''}
        currentTagline={carouselModal.index >= 0 ? settings.carouselImages[carouselModal.index]?.tagline || '' : ''}
        onConfirm={handleCarouselModalConfirm}
        onCancel={handleCarouselModalCancel}
      />
    </div>
  )
}
