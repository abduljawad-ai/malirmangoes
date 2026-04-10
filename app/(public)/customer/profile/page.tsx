'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { MapPin, Plus, Trash2, User } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import { Address } from '@/types'
import toast from 'react-hot-toast'

function ProfileContent() {
  const { user, loading: authLoading, updateUserData } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const [profileForm, setProfileForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    photoURL: user?.photoURL || '',
  })

  const [addresses, setAddresses] = useState<Address[]>(user?.addresses || [])

  useEffect(() => {
    if (user) {
      setProfileForm({
        name: user.name || '',
        phone: user.phone || '',
        photoURL: user.photoURL || '',
      })
      setAddresses(user.addresses || [])
    }
  }, [user])

  const handleUpdateProfile = async () => {
    setIsSaving(true)
    try {
      await updateUserData({ ...profileForm, addresses })
      toast.success('Profile updated')
      setIsEditing(false)
    } catch (err) {
      toast.error('Failed to update profile')
    } finally {
      setIsSaving(false)
    }
  }

  const handleAddAddress = () => {
    setAddresses([...addresses, { label: 'New Address', street: '', city: '', state: '', zip: '' }])
  }

  const handleUpdateAddress = (index: number, field: keyof Address, value: string) => {
    const updated = [...addresses]
    updated[index] = { ...updated[index], [field]: value }
    setAddresses(updated)
  }

  const handleRemoveAddress = (index: number) => {
    setAddresses(addresses.filter((_, i) => i !== index))
  }

  if (authLoading) {
    return <div className="animate-spin rounded-full h-10 w-10 border-2 border-slate-200 border-t-mango mx-auto" />
  }

  if (!user) {
    return <p className="text-sm text-slate-500">Please sign in to view your profile.</p>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-slate-900">Profile</h1>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>Edit</Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(false)}>Cancel</Button>
            <Button size="sm" onClick={handleUpdateProfile} loading={isSaving}>Save</Button>
          </div>
        )}
      </div>

      {/* Profile Info */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 bg-slate-100 rounded-full overflow-hidden relative flex-shrink-0">
            {user.photoURL ? (
              <img src={getValidImageUrl(user.photoURL)} alt={user.name || ''} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-lg font-medium text-slate-500">
                {user.name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">{user.name || 'User'}</p>
            <p className="text-xs text-slate-500">{user.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Input
            label="Name"
            value={profileForm.name}
            onChange={(e) => setProfileForm(prev => ({ ...prev, name: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Phone"
            value={profileForm.phone}
            onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
            disabled={!isEditing}
          />
          <Input
            label="Email"
            value={user.email}
            disabled
          />
        </div>
      </div>

      {/* Addresses */}
      <div className="bg-white border border-slate-200 rounded-lg p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Addresses
          </h2>
          {isEditing && (
            <Button variant="outline" size="sm" onClick={handleAddAddress}>
              <Plus className="w-3.5 h-3.5 mr-1" /> Add
            </Button>
          )}
        </div>

        {addresses.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">No addresses saved</p>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr, idx) => (
              <div key={idx} className="p-4 bg-slate-50 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  {isEditing ? (
                    <input
                      value={addr.label}
                      onChange={(e) => handleUpdateAddress(idx, 'label', e.target.value)}
                      className="text-sm font-medium bg-white border border-slate-200 rounded px-2 py-0.5 focus:outline-none focus:border-mango"
                    />
                  ) : (
                    <p className="text-sm font-medium text-slate-900">{addr.label}</p>
                  )}
                  {isEditing && (
                    <button onClick={() => handleRemoveAddress(idx)} className="p-1 text-slate-400 hover:text-danger transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {(['street', 'city', 'state', 'zip'] as const).map(field => (
                    <input
                      key={field}
                      value={addr[field]}
                      onChange={(e) => handleUpdateAddress(idx, field, e.target.value)}
                      disabled={!isEditing}
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      className="text-xs bg-white border border-slate-200 rounded px-2 py-1.5 focus:outline-none focus:border-mango disabled:bg-slate-100 disabled:text-slate-500"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return <ProfileContent />
}
