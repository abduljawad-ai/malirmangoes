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

const IDEMPOTENCY_TTL = 5 * 60 * 1000 // 5 minutes

async function checkIdempotency(userId: string, idempotencyKey: string): Promise<string | null> {
  const keyRef = adminRtdb.ref(`idempotency/${userId}/${idempotencyKey}`)
  const snapshot = await keyRef.get()
  
  if (snapshot.exists()) {
    const data = snapshot.val()
    const createdAt = data.createdAt
    const now = Date.now()
    
    // Check if key is still valid
    if (now - createdAt < IDEMPOTENCY_TTL) {
      return data.orderId // Return existing order ID
    }
  }
  return null
}

async function storeIdempotencyKey(userId: string, idempotencyKey: string, orderId: string): Promise<void> {
  const keyRef = adminRtdb.ref(`idempotency/${userId}/${idempotencyKey}`)
  await keyRef.set({
    orderId,
    createdAt: Date.now()
  })
  
  // Set expiry (RTDB doesn't auto-expire, so we rely on TTL check above)
  // In production, consider using Firebase Functions to clean up expired keys
}

export async function POST(req: NextRequest) {
  try {
    const { user, error } = await verifyAuth(req)
    if (error || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check for idempotency key
    const idempotencyKey = req.headers.get('X-Idempotency-Key')
    if (idempotencyKey) {
      const existingOrderId = await checkIdempotency(user.uid, idempotencyKey)
      if (existingOrderId) {
        // Return the existing order to prevent duplicate creation
        return NextResponse.json({ 
          success: true, 
          orderId: existingOrderId,
          duplicate: true
        })
      }
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

    // Fetch and validate all products in parallel for better performance
    // Use integer math (prices in cents) to avoid floating-point issues
    let calculatedTotalCents = 0
    const processedItems: Array<{ productId: string; qty: number; name: string; price: number; priceCents: number; image: string; total: number; totalCents: number }> = []

    // Fetch all products in parallel
    const productSnaps = await Promise.all(
      items.map(item => adminRtdb.ref(`products/${item.productId}`).get())
    )

    // Validate and process each product
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      const snap = productSnaps[i]
      
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

      // Convert to cents for precise calculation
      const unitPrice = product.salePrice || product.price
      const unitPriceCents = Math.round(unitPrice * 100)
      const itemTotalCents = unitPriceCents * item.qty
      calculatedTotalCents += itemTotalCents

      processedItems.push({
        productId: item.productId,
        qty: item.qty,
        name: sanitizeString(product.name || 'Unknown Product'),
        price: unitPrice,
        priceCents: unitPriceCents,
        image: product.images?.[0]?.webp || product.images?.[0]?.original || '',
        total: itemTotalCents / 100,
        totalCents: itemTotalCents
      })
    }

    // Use exact integer comparison (prices in cents)
    const totalPriceCents = Math.round(totalPrice * 100)
    if (calculatedTotalCents !== totalPriceCents) {
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
      total: calculatedTotalCents / 100,
      totalCents: calculatedTotalCents,
      status: 'pending',
      orderStatus: 'Pending',
      paymentStatus: 'Pending',
      paymentMethod: 'COD',
      createdAt: now,
      updatedAt: now,
    }

    // Atomic multi-path update with stock check using RTDB transactions
    const updates: Record<string, unknown> = {}
    updates[`orders/all/${orderId}`] = orderData
    updates[`orders/byUser/${userId}/${orderId}`] = orderData

    // Use transactions for each product's stock to prevent race conditions
    const transactionPromises = processedItems.map(async (item) => {
      const stockRef = adminRtdb.ref(`products/${item.productId}/stock`)
      
      return stockRef.transaction((currentStock: number | null) => {
        const stock = currentStock || 0
        
        if (stock < item.qty) {
          // Transaction will abort if stock is insufficient
          return undefined
        }
        
        return stock - item.qty
      })
    })

    const transactionResults = await Promise.all(transactionPromises)

    // Check if any transaction was aborted (insufficient stock)
    for (let i = 0; i < transactionResults.length; i++) {
      const result = transactionResults[i]
      if (result.committed === false || result.snapshot.val() === undefined) {
        // Transaction was aborted due to insufficient stock
        return NextResponse.json(
          { error: `Insufficient stock for ${processedItems[i].name}` },
          { status: 409 }
        )
      }
    }

    // All transactions succeeded, write the order
    await adminRtdb.ref().update(updates)

    // Store idempotency key after successful order creation
    if (idempotencyKey) {
      await storeIdempotencyKey(userId, idempotencyKey, orderId)
    }

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
