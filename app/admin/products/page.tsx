'use client'

import React, { useState } from 'react'
import { Plus, Search, Edit3, Trash2, CheckCircle, XCircle, Package } from 'lucide-react'
import { useProducts } from '@/hooks/useProducts'
import { formatPKR, cn, getValidImageUrl } from '@/lib/utils'
import { ref, remove } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import Button from '@/components/ui/Button'
import Badge from '@/components/ui/Badge'
import Image from 'next/image'
import ProductModal from './ProductModal'
import { Product } from '@/types'
import toast from 'react-hot-toast'

export default function AdminProductsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  
  const { products, loading, refresh } = useProducts({ category: categoryFilter !== 'all' ? categoryFilter : undefined })

  const handleAddNew = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      await remove(ref(rtdb, `products/${id}`))
      toast.success('Product deleted')
      setConfirmDeleteId(null)
      refresh()
    } catch {
      toast.error('Failed to delete product')
    }
  }

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Products</h1>
          <p className="text-sm text-slate-500 mt-0.5">{products.length} total</p>
        </div>
        <Button size="sm" onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-1" />
          Add Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search products..."
            className="w-full pl-10 pr-3 h-10 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <select
          className="h-10 px-3 text-sm bg-white border border-slate-200 rounded-md focus:outline-none focus:ring-2 focus:ring-mango/20 focus:border-mango"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="all">All Categories</option>
          <option value="chaunsa">Chaunsa</option>
          <option value="sindhri">Sindhri</option>
          <option value="anwar-ratol">Anwar Ratol</option>
          <option value="langra">Langra</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Product</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500 hidden sm:table-cell">Category</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Price</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Stock</th>
                <th className="text-left px-4 py-2.5 text-xs font-medium text-slate-500">Status</th>
                <th className="text-right px-4 py-2.5 text-xs font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-200 rounded-md animate-pulse" />
                        <div className="space-y-1.5">
                          <div className="h-3 bg-slate-200 rounded w-24 animate-pulse" />
                          <div className="h-2 bg-slate-200 rounded w-16 animate-pulse" />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell"><div className="h-3 bg-slate-200 rounded w-16 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-12 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-10 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-12 animate-pulse" /></td>
                    <td className="px-4 py-3"><div className="h-3 bg-slate-200 rounded w-12 ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : filteredProducts.length > 0 ? (
                filteredProducts.map(p => (
                  <React.Fragment key={p.id}>
                    <tr className="border-b border-slate-50 last:border-0 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-slate-100 rounded-md overflow-hidden relative flex-shrink-0">
                            <Image src={getValidImageUrl(p.images[0]?.webp)} alt={p.name} fill sizes="40px" className="object-cover" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">{p.name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{p.slug}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <Badge variant="muted">{p.category}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <span className="font-semibold text-slate-900">{formatPKR(p.salePrice || p.price)}</span>
                        {p.salePrice && <span className="text-xs text-slate-400 line-through ml-1">{formatPKR(p.price)}</span>}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5">
                          <div className={cn(
                            'w-2 h-2 rounded-full',
                            p.stock > 50 ? 'bg-leaf' : p.stock > 10 ? 'bg-warning' : 'bg-danger'
                          )} />
                          <span className="text-sm text-slate-700">{p.stock} kg</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        {p.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-leaf">
                            <CheckCircle className="w-3 h-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-400">
                            <XCircle className="w-3 h-3" /> Disabled
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEdit(p)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(p.id)}
                            className="p-1.5 text-slate-400 hover:text-danger hover:bg-danger-50 rounded-md transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {confirmDeleteId === p.id && (
                      <tr className="bg-danger-50">
                        <td colSpan={6} className="px-4 py-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-danger">
                              Delete &quot;{p.name}&quot;? This cannot be undone.
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-3 py-1 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-md hover:bg-slate-50 transition-colors"
                              >
                                Cancel
                              </button>
                              <button
                                onClick={() => handleDelete(p.id)}
                                className="px-3 py-1 text-xs font-medium text-white bg-danger rounded-md hover:bg-danger/90 transition-colors"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-4 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center">
                        <Package className="w-5 h-5 text-slate-400" />
                      </div>
                      <p className="text-sm text-slate-500">No products found</p>
                      <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setCategoryFilter('all') }}>
                        Reset Filters
                      </Button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        {!loading && filteredProducts.length > 0 && (
          <div className="px-4 py-2.5 border-t border-slate-100 bg-slate-50">
            <p className="text-xs text-slate-500">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>
        )}
      </div>

      <ProductModal
        isOpen={isModalOpen}
        product={selectedProduct}
        onClose={() => setIsModalOpen(false)}
        onSuccess={refresh}
      />
    </div>
  )
}
