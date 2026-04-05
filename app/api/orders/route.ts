import { NextResponse, NextRequest } from 'next/server'
import { Product } from '@/types'
import { generateOrderId } from '@/lib/utils'
import { verifyAuth } from '@/lib/auth-server'
import { adminRtdb } from '@/lib/firebase-admin'
import { z } from 'zod'

function sanitizeString(str: string, maxLength: number = 200): string {
  if (typeof str !== 'string') return ''
  return str.trim().slice(0, maxLength).replace(/[<>]/g, '')
}

const orderRequestSchema = z.object({
  items: z.array(z.object({
    productId: z.string().min(1),
    qty: z.number().int().min(1).max(1000),
  })).min(1, 'Cart is empty'),
  totalPrice: z.number().positive('Invalid amount'),
  name: z.string().min(2).max(100),
  email: z.string().email(),
  phone: z.string().min(10).max(20),
  street: z.string().min(5).max(200),
  address: z.string().optional(),
  city: z.string().min(2).max(100),
  state: z.string().min(2).max(100),
  zip: z.string().min(4).max(20),
})

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await verifyAuth(req)
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    let validatedData
    try {
      validatedData = orderRequestSchema.parse(data)
    } catch {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    const { items, totalPrice, name, email, phone, street, address, city, state, zip } = validatedData
    const userId = user.uid

    const safeCustomer = {
      name: sanitizeString(name),
      email: sanitizeString(email),
      phone: sanitizeString(phone),
      address: sanitizeString(address || street),
      city: sanitizeString(city),
      state: sanitizeString(state),
      zip: sanitizeString(zip, 20)
    }

    // Fetch and validate all products, calculate total
    let calculatedTotal = 0
    const processedItems: Array<{ productId: string; qty: number; name: string; price: number; image: string; total: number }> = []

    for (const item of items) {
      const snap = await adminRtdb.ref(`products/${item.productId}`).get()
      if (!snap.exists()) {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 })
      }

      const product = snap.val() as Product

      if (product.isActive === false) {
        return NextResponse.json({ error: 'Product is no longer available' }, { status: 410 })
      }

      if (!product.stock || product.stock < item.qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.name || 'item'}` },
          { status: 409 }
        )
      }

      const unitPrice = product.salePrice || product.price
      const itemTotal = unitPrice * item.qty
      calculatedTotal += itemTotal

      processedItems.push({
        productId: item.productId,
        qty: item.qty,
        name: sanitizeString(product.name),
        price: unitPrice,
        image: product.images?.[0]?.webp || product.images?.[0]?.original || '',
        total: itemTotal
      })
    }

    if (Math.abs(calculatedTotal - totalPrice) > 1) {
      return NextResponse.json(
        { error: 'Price verification failed. Please refresh and try again.' },
        { status: 400 }
      )
    }

    // Use RTDB transaction for atomic stock deduction + order creation
    const orderId = generateOrderId()
    const now = new Date().toISOString()

    const orderData = {
      id: orderId,
      userId,
      customerSnapshot: {
        name: safeCustomer.name,
        email: safeCustomer.email,
        phone: safeCustomer.phone,
        address: {
          label: 'Shipping Address',
          street: safeCustomer.address,
          city: safeCustomer.city,
          state: safeCustomer.state,
          zip: safeCustomer.zip
        }
      },
      items: processedItems.map(item => ({
        productId: item.productId,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
        total: item.total
      })),
      total: calculatedTotal,
      status: 'pending',
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: 'COD',
      createdAt: now,
      updatedAt: now,
    }

    // Atomic multi-path update with stock check
    const updates: Record<string, unknown> = {}
    updates[`orders/all/${orderId}`] = orderData
    updates[`orders/byUser/${userId}/${orderId}`] = orderData

    for (const item of processedItems) {
      const stockRef = adminRtdb.ref(`products/${item.productId}/stock`)
      const stockSnap = await stockRef.get()
      const currentStock = (stockSnap.val() as number) || 0

      if (currentStock < item.qty) {
        return NextResponse.json(
          { error: `Insufficient stock for an item` },
          { status: 409 }
        )
      }

      updates[`products/${item.productId}/stock`] = currentStock - item.qty
    }

    await adminRtdb.ref().update(updates)

    // Update user profile (non-critical, best effort)
    try {
      const userSnap = await adminRtdb.ref(`users/${userId}`).get()
      if (userSnap.exists()) {
        const userData = userSnap.val()
        const profileUpdates: Record<string, unknown> = {
          [`users/${userId}/lastOrderId`]: orderId,
          [`users/${userId}/lastOrderAt`]: now,
        }

        const existingAddresses = userData.addresses || []
        const isDuplicate = existingAddresses.some(
          (a: { street: string; city: string }) =>
            a.street === safeCustomer.address && a.city === safeCustomer.city
        )

        if (!isDuplicate) {
          profileUpdates[`users/${userId}/addresses`] = [
            ...existingAddresses,
            {
              label: `Home (${safeCustomer.city})`,
              street: safeCustomer.address,
              city: safeCustomer.city,
              state: safeCustomer.state,
              zip: safeCustomer.zip
            }
          ]
        }

        await adminRtdb.ref().update(profileUpdates)
      }
    } catch {
      // Profile sync failure is non-critical
    }

    return NextResponse.json({ success: true, orderId })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Internal Server Error'

    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }

    return NextResponse.json({ error: 'Failed to create order. Please try again.' }, { status: 500 })
  }
}
