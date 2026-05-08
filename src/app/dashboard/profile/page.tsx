'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'
import { User, Mail, Phone, MapPin, Save } from 'lucide-react'

interface ProfileData {
  name: string
  phone: string
  address: string
  city: string
}

export default function ProfilePage() {
  const { user, refreshUser } = useAuth()
  const [profile, setProfile] = useState<ProfileData>({
    name: '',
    phone: '',
     address: '',
     city: ''
  })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (user) {
      setProfile({
        name: user.name || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || ''
      })
    }
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      })
      if (res.ok) {
        setSaved(true)
        refreshUser()
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      console.error('Failed to update profile:', e)
    }
    setSaving(false)
  }

  return (
    <div className="p-4 lg:p-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">My Profile</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={profile.name}
              onChange={e => setProfile({ ...profile, name: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Your name"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={user?.email || ''}
              disabled
              className="w-full pl-10 pr-4 py-2 border rounded-lg bg-gray-50"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Phone</label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="tel"
              value={profile.phone}
              onChange={e => setProfile({ ...profile, phone: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="03XXXXXXXXX"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">City</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={profile.city}
              onChange={e => setProfile({ ...profile, city: e.target.value })}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
              placeholder="Your city"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address</label>
          <textarea
            value={profile.address}
            onChange={e => setProfile({ ...profile, address: e.target.value })}
            className="w-full px-4 py-2 border rounded-lg"
            rows={3}
            placeholder="Full delivery address"
          />
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-orange-500 text-white py-2 rounded-lg disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </button>
      </form>
    </div>
  )
}