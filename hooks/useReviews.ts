'use client'

import { useState, useEffect, useCallback } from 'react'
import { ref, onValue, push, set } from 'firebase/database'
import { rtdb } from '@/lib/firebase'
import { Review } from '@/types'
import { useAuth } from './useAuth'
import toast from 'react-hot-toast'

export function useReviews(productId: string) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [averageRating, setAverageRating] = useState(0)
  const { user } = useAuth()

  useEffect(() => {
    if (!productId) return

    const reviewsRef = ref(rtdb, `reviews/${productId}`)
    const unsubscribe = onValue(reviewsRef, (snapshot) => {
      const data = snapshot.val()
      if (data) {
        const reviewsList: Review[] = Object.entries(data).map(([id, value]) => ({
          ...(value as Review),
          id
        }))
        // Sort by newest first
        reviewsList.sort((a, b) => {
          const dateA = new Date(a.createdAt).getTime()
          const dateB = new Date(b.createdAt).getTime()
          return dateB - dateA
        })
        setReviews(reviewsList)

        // Calculate average
        const total = reviewsList.reduce((acc, curr) => acc + curr.rating, 0)
        setAverageRating(Number((total / reviewsList.length).toFixed(1)))
      } else {
        setReviews([])
        setAverageRating(0)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [productId])

  const submitReview = useCallback(async (rating: number, comment: string) => {
    if (!user) {
      toast.error('You must be logged in to leave a review')
      return false
    }

    if (rating < 1 || rating > 5) {
      toast.error('Please select a rating')
      return false
    }

    if (!comment.trim()) {
      toast.error('Please add a comment')
      return false
    }

    // Check if user already reviewed
    const existingReview = reviews.find(r => r.userId === user.uid)
    if (existingReview) {
      toast.error('You have already reviewed this product')
      return false
    }

    try {
      const reviewsRef = ref(rtdb, `reviews/${productId}`)
      const newReviewRef = push(reviewsRef)
      
      const newReview: Partial<Review> = {
        productId,
        userId: user.uid,
        userName: user.name,
        rating,
        comment: comment.trim(),
        verifiedPurchase: false,
        isVisible: true,
        createdAt: new Date().toISOString()
      }

      await set(newReviewRef, newReview)
      toast.success('Thank you for your feedback!')
      return true
    } catch (error) {
      toast.error('Failed to submit review')
      return false
    }
  }, [productId, user, reviews])

  return { reviews, loading, averageRating, submitReview }
}
