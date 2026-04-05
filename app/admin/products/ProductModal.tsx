'use client'

import React, { useState, useEffect } from 'react'
import { X, Save, Package } from 'lucide-react'
import { Product } from '@/types'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Textarea from '@/components/ui/Textarea'
import ImageUpload from '@/components/ui/ImageUpload'
import { ref, set, push, update } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import toast from 'react-hot-toast'

interface ProductModalProps {
  product?: Product | null
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function ProductModal({ product, isOpen, onClose, onSuccess }: ProductModalProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    slug: '',
    price: 0,
    salePrice: 0,
    description: '',
    category: 'chaunsa',
    stock: 0,
    weightKg: 10,
    isActive: true,
    isFeatured: false,
    images: [{ original: '', webp: '', thumbnail: '' }],
    deliveryCities: ['Lahore', 'Karachi', 'Islamabad'],
    tags: ['fresh', 'premium'],
    seoTitle: '',
    seoDescription: '',
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    } else {
      setFormData({
        name: '',
        slug: '',
        price: 0,
        description: '',
        category: 'chaunsa',
        stock: 0,
        weightKg: 10,
        isActive: true,
        isFeatured: false,
        images: [{ original: '', webp: '', thumbnail: '' }],
        deliveryCities: ['Lahore', 'Karachi', 'Islamabad'],
        tags: ['fresh', 'premium'],
        seoTitle: '',
        seoDescription: '',
      })
    }
  }, [product, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name?.trim()) {
      toast.error('Product name is required')
      return
    }
    if (!formData.slug?.trim()) {
      toast.error('Slug is required')
      return
    }
    if (!formData.price || formData.price <= 0) {
      toast.error('Price must be greater than 0')
      return
    }
    if (formData.stock === undefined || formData.stock < 0) {
      toast.error('Stock must be 0 or greater')
      return
    }
    if (!formData.description?.trim()) {
      toast.error('Description is required')
      return
    }

    setLoading(true)
    try {
      const now = new Date().toISOString()
      const data = {
        ...formData,
        updatedAt: now,
        price: Number(formData.price),
        salePrice: formData.salePrice ? Number(formData.salePrice) : null,
        stock: Number(formData.stock),
      }

      if (product?.id) {
        await update(ref(rtdb, `products/${product.id}`), data)
        toast.success('Product updated')
      } else {
        const newProductRef = push(ref(rtdb, 'products'))
        await set(newProductRef, { ...data, createdAt: now, id: newProductRef.key })
        toast.success('Product created')
      }
      onSuccess()
      onClose()
    } catch (error) {
      toast.error('Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const handleImageChange = (url: string) => {
    const newImages = [{ original: url, webp: url, thumbnail: url }]
    setFormData({ ...formData, images: newImages })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
        {/* Header */}
        <div className="sticky top-0 bg-white px-5 py-4 border-b border-slate-100 flex items-center justify-between z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-mango-50 rounded-md flex items-center justify-center">
              <Package className="w-4 h-4 text-mango" />
            </div>
            <h2 className="text-base font-semibold text-slate-900">
              {product ? 'Edit Product' : 'Add Product'}
            </h2>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600 rounded-md hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Left: Basic Info */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Basic Info</h3>
              <Input
                label="Product Name"
                required
                value={formData.name}
                onChange={(e) => {
                  const name = e.target.value
                  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
                  setFormData({ ...formData, name, slug })
                }}
                placeholder="e.g. Chaunsa Premium"
              />
              <Input
                label="Slug"
                required
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="chaunsa-premium"
              />
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Price (Rs.)"
                  required
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                />
                <Input
                  label="Sale Price (optional)"
                  type="number"
                  value={formData.salePrice || ''}
                  onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value) })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Category</label>
                <select
                  className="w-full h-10 px-3 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="chaunsa">Chaunsa</option>
                  <option value="sindhri">Sindhri</option>
                  <option value="anwar-ratol">Anwar Ratol</option>
                  <option value="langra">Langra</option>
                  <option value="dasheri">Dasheri</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  label="Stock (kg)"
                  required
                  type="number"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                />
                <Input
                  label="Box Weight (kg)"
                  required
                  type="number"
                  value={formData.weightKg}
                  onChange={(e) => setFormData({ ...formData, weightKg: Number(e.target.value) })}
                />
              </div>
              <Textarea
                label="Description"
                required
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the taste, quality, origin..."
              />
            </div>

            {/* Right: Image + Settings */}
            <div className="space-y-4">
              <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Product Image</h3>
              <ImageUpload
                value={formData.images?.[0]?.webp}
                onChange={handleImageChange}
                label="Main Product Image"
              />

              <div className="pt-4 border-t border-slate-100 space-y-3">
                <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Settings</h3>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-mango focus:ring-mango/20"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  />
                  <span className="text-sm text-slate-700">Visible on store</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-slate-300 text-mango focus:ring-mango/20"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span className="text-sm text-slate-700">Feature on homepage</span>
                </label>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" loading={loading}>
              {product ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
