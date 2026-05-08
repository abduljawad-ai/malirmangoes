'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { supabase, Order, OrderItem } from '@/lib/supabase'
import { Package, MessageCircle, Settings, LogOut, ShoppingBag, Send, X, MapPin, Phone, RotateCcw } from 'lucide-react'
import Link from 'next/link'

export default function Dashboard() {
  const { user, signOut, loading } = useAuth()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('orders')
  const [orders, setOrders] = useState<Order[]>([])
  const [messages, setMessages] = useState<any[]>([])
  const [orderItems, setOrderItems] = useState<Record<string, OrderItem[]>>({})
  const [newMessage, setNewMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [refreshing, setRefreshing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/')
    }
  }, [user, loading])

  useEffect(() => {
    if (user) {
      fetchOrders()
      fetchMessages()
    }
  }, [user])

  // Auto-refresh chat every 10 seconds when on chat tab
  useEffect(() => {
    if (activeTab !== 'chat' || !user) return
    
    const interval = setInterval(() => {
      fetchMessages()
    }, 10000) // 10 seconds
    
    return () => clearInterval(interval)
  }, [activeTab, user])

  async function fetchOrders() {
    if (!user) return
    
    let query = supabase.from('orders').select('*').order('created_at', { ascending: false })
    
    if (user.role === 'user') {
      query = query.eq('user_id', user.id)
    }
    
    const { data } = await query
    if (data) {
      setOrders(data)
      const itemsMap: Record<string, OrderItem[]> = {}
      data.forEach(order => {
        itemsMap[order.id] = order.items as OrderItem[]
      })
      setOrderItems(itemsMap)
    }
  }

  async function fetchMessages() {
    if (!user) return
    
    const { data } = await supabase
      .from('messages')
      .select('*')
      .or(`sender_id.eq.${user.id},receiver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })
      
    if (data) setMessages(data)
  }

  async function sendMessage() {
    if (!newMessage.trim() || !user || sending) return
    setSending(true)
    
    const { data: admins } = await supabase
      .from('users')
      .select('id')
      .eq('role', 'admin')
      .limit(1)
    
    const adminId = admins?.[0]?.id
    
    if (adminId) {
      await supabase.from('messages').insert({
        sender_id: user.id,
        receiver_id: adminId,
        message: newMessage.trim(),
      })
      setNewMessage('')
      fetchMessages()
    }
    setSending(false)
  }

  async function refreshMessages() {
    setRefreshing(true)
    await fetchMessages()
    setRefreshing(false)
  }

  async function updateOrderStatus(orderId: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', orderId)
    fetchOrders()
  }

  async function handleSignOut() {
    await signOut()
    router.push('/')
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  const tabs = [
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'chat', label: 'Chat', icon: MessageCircle },
    { id: 'profile', label: 'Profile', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="flex items-center justify-between max-w-md mx-auto">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {user.role === 'admin' ? 'Admin Dashboard' : user.role === 'seller' ? 'Seller Dashboard' : 'My Dashboard'}
            </h1>
            <p className="text-sm text-gray-500">{user.name || user.email}</p>
          </div>
          <button onClick={handleSignOut} className="p-2 text-gray-500">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <div className="bg-white border-b border-gray-200">
        <div className="max-w-md mx-auto flex">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-medium ${
                activeTab === tab.id
                  ? 'text-orange-600 border-b-2 border-orange-600'
                  : 'text-gray-500'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md mx-auto p-4">
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No orders yet</p>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-500">#{order.id.slice(0, 8)}</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'confirmed' ? 'bg-blue-100 text-blue-700' :
                      order.status === 'shipped' ? 'bg-purple-100 text-purple-700' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                      'bg-red-100 text-red-700'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="space-y-2 mb-3">
                    {(orderItems[order.id] || []).map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.variety_name} × {item.quantity}kg</span>
                        <span>Rs.{item.quantity * item.price_per_kg}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between font-semibold mb-3">
                    <span>Total</span>
                    <span className="text-orange-600">Rs.{order.total_amount}</span>
                  </div>
                  <div className="text-sm text-gray-500 space-y-1">
                    <p className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {order.delivery_address}
                    </p>
                    <p className="flex items-center gap-1">
                      <Phone className="w-3 h-3" />
                      {order.customer_name} - {order.customer_phone}
                    </p>
                  </div>
                  {(user.role === 'admin' || user.role === 'seller') && (
                    <div className="flex gap-2 mt-4">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'confirmed')}
                          className="flex-1 btn-primary text-sm"
                        >
                          Confirm
                        </button>
                      )}
                      {order.status === 'confirmed' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'shipped')}
                          className="flex-1 btn-primary text-sm"
                        >
                          Ship
                        </button>
                      )}
                      {order.status === 'shipped' && (
                        <button
                          onClick={() => updateOrderStatus(order.id, 'delivered')}
                          className="flex-1 btn-primary text-sm"
                        >
                          Delivered
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'chat' && (
          <div className="space-y-4 pb-20">
            <div className="flex items-center justify-between px-2">
              <span className="text-sm text-gray-500">
                {messages.length} message{messages.length !== 1 ? 's' : ''}
              </span>
              <button
                onClick={refreshMessages}
                disabled={refreshing}
                className="flex items-center gap-1 text-sm text-orange-600 hover:text-orange-700 disabled:opacity-50"
              >
                <RotateCcw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                {refreshing ? 'Refreshing...' : 'Refresh'}
              </button>
            </div>
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-12">
                  <MessageCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">No messages yet</p>
                </div>
              ) : (
                messages.map(msg => (
                  <div
                    key={msg.id}
                    className={`bg-white rounded-xl p-4 shadow-sm ${
                      msg.sender_id === user.id ? 'ml-8' : 'mr-8'
                    }`}
                  >
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(msg.created_at).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
              <div className="max-w-md mx-auto flex gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  className="input-field"
                />
                <button 
                  onClick={sendMessage}
                  disabled={!newMessage.trim() || sending}
                  className="btn-primary"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold mb-4">Profile Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-gray-500">Name</label>
                  <p className="font-medium">{user.name || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Email</label>
                  <p className="font-medium">{user.email}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Phone</label>
                  <p className="font-medium">{user.phone || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">Address</label>
                  <p className="font-medium">{user.address || 'Not set'}</p>
                </div>
                <div>
                  <label className="text-sm text-gray-500">City</label>
                  <p className="font-medium">{user.city || 'Not set'}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="w-full py-3 text-red-600 border border-red-200 rounded-lg"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200">
        <div className="max-w-md mx-auto flex">
          <Link href="/dashboard" className="flex-1 flex flex-col items-center py-3 text-orange-600">
            <Package className="w-5 h-5" />
            <span className="text-xs mt-1">Home</span>
          </Link>
          {(user.role === 'admin' || user.role === 'seller') && (
            <Link href="/admin" className="flex-1 flex flex-col items-center py-3 text-gray-400">
              <Settings className="w-5 h-5" />
              <span className="text-xs mt-1">Admin</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  )
}