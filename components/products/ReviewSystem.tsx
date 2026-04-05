'use client'

import React, { useState } from 'react'
import { Star, MessageSquare, ChevronRight, User } from 'lucide-react'
import { useReviews } from '@/hooks/useReviews'
import { useAuth } from '@/hooks/useAuth'
import Button from '@/components/ui/Button'
import Textarea from '@/components/ui/Textarea'
import { cn } from '@/lib/utils'

interface ReviewSystemProps {
  productId: string
}

export default function ReviewSystem({ productId }: ReviewSystemProps) {
  const { reviews, loading, averageRating, submitReview } = useReviews(productId)
  const { user, loginWithGoogle } = useAuth()
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const success = await submitReview(rating, comment)
    if (success) {
      setRating(0)
      setComment('')
    }
    setSubmitting(false)
  }

  const ratingsCount = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: reviews.filter(rev => rev.rating === r).length,
    percentage: reviews.length > 0 ? (reviews.filter(rev => rev.rating === r).length / reviews.length) * 100 : 0
  }))

  return (
    <div className="mt-24 pt-24 border-t border-border/50">
      <div className="flex flex-col lg:flex-row gap-16">
        {/* Left Side: Summary & Distribution */}
        <div className="lg:w-1/3 space-y-8">
          <div>
            <h2 className="text-3xl font-black text-dark mb-2">Customer Feedback</h2>
            <p className="text-muted font-medium">Real stories from our mango lovers</p>
          </div>

          <div className="p-8 bg-cream rounded-[40px] border border-mango/20 shadow-xl shadow-mango/5">
            <div className="flex items-end gap-4 mb-6">
              <span className="text-6xl font-black text-dark">{averageRating || '0.0'}</span>
              <div className="mb-2">
                <div className="flex text-mango mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star 
                      key={s} 
                      className={cn(
                        "w-5 h-5 fill-current",
                        s <= Math.round(averageRating) ? "text-mango" : "text-border"
                      )} 
                    />
                  ))}
                </div>
                <p className="text-xs font-bold text-muted uppercase tracking-widest">
                  Based on {reviews.length} Review{reviews.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              {ratingsCount.map((r) => (
                <div key={r.stars} className="flex items-center gap-4 text-sm font-bold">
                  <div className="flex items-center gap-1 w-6">
                    {r.stars} <Star className="w-3 h-3 fill-current text-border" />
                  </div>
                  <div className="flex-1 h-3 bg-white rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-mango transition-all duration-1000" 
                      style={{ width: `${r.percentage}%` }}
                    />
                  </div>
                  <div className="w-10 text-right text-muted">{Math.round(r.percentage)}%</div>
                </div>
              ))}
            </div>
          </div>

          {/* Review Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-6 bg-surface rounded-3xl border border-border/50">
              <div className="w-10 h-10 rounded-xl bg-leaf/10 flex items-center justify-center text-leaf mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-dark">{reviews.length}</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Total Feedback</p>
            </div>
            <div className="p-6 bg-surface rounded-3xl border border-border/50">
              <div className="w-10 h-10 rounded-xl bg-mango/10 flex items-center justify-center text-mango mb-3">
                <ChevronRight className="w-5 h-5" />
              </div>
              <p className="text-2xl font-black text-dark">98%</p>
              <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Recommended</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form & List */}
        <div className="flex-1 space-y-12">
          {/* Form */}
          <div className="p-10 bg-white rounded-[40px] border border-border shadow-2xl shadow-dark/5 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 text-mango/10 pointer-events-none transition-transform duration-500 group-hover:scale-110">
              <Star className="w-32 h-32 fill-current" />
            </div>

            {user ? (
              <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
                <div>
                  <h3 className="text-2xl font-black text-dark mb-2">Write a Review</h3>
                  <p className="text-muted font-medium mb-6">Share your experience with this variety</p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        className="transition-transform active:scale-95"
                        onMouseEnter={() => setHover(s)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(s)}
                        aria-label={`Rate ${s} stars`}
                      >
                        <Star 
                          className={cn(
                            "w-8 h-8 transition-all duration-200",
                            s <= (hover || rating) ? "text-mango fill-current" : "text-border"
                          )} 
                        />
                      </button>
                    ))}
                    <span className="ml-2 text-sm font-bold text-muted">
                      {rating > 0 ? `${rating} Stars` : 'Select rating'}
                    </span>
                  </div>

                  <Textarea 
                    placeholder="Tell others what you think about the taste, pulp quality, and delivery..."
                    rows={4}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                  />

                  <Button 
                    type="submit" 
                    loading={submitting}
                    disabled={rating === 0 || !comment.trim()}
                    className="w-full md:w-auto px-10 rounded-2xl shadow-xl shadow-leaf/20"
                  >
                    Post Review
                  </Button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8 relative z-10">
                <div className="w-16 h-16 bg-mango/10 rounded-full flex items-center justify-center text-mango mx-auto mb-6">
                  <User className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-black text-dark mb-2">Love these mangoes?</h3>
                <p className="text-muted font-medium mb-8">Sign in with Google to share your feedback with the community.</p>
                <Button 
                  onClick={loginWithGoogle}
                  className="rounded-2xl px-10 shadow-xl shadow-dark/5"
                >
                  Sign in to Review
                </Button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="space-y-8">
            <h3 className="text-xl font-bold text-dark flex items-center gap-3">
              Community Reviews
              <span className="px-2 py-0.5 bg-border/50 rounded-lg text-xs">{reviews.length}</span>
            </h3>

            {loading ? (
              <div className="space-y-4">
                {[1, 2].map(i => (
                  <div key={i} className="h-32 bg-cream animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : reviews.length > 0 ? (
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="p-8 bg-surface rounded-[32px] border border-border/50 hover:border-mango/30 transition-all group">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-mango/10 flex items-center justify-center text-mango font-black text-xl">
                          {review.userName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-dark">{review.userName}</p>
                          <div className="flex text-mango">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star 
                                key={s} 
                                className={cn(
                                  "w-3 h-3 fill-current",
                                  s <= review.rating ? "text-mango" : "text-border"
                                )} 
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      <p className="text-[10px] font-bold text-muted uppercase tracking-widest">
                        {new Date(review.createdAt as unknown as string).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                    <p className="text-dark/80 leading-relaxed font-medium">
                      {review.comment}
                    </p>
                    {review.verifiedPurchase && (
                      <div className="mt-4 flex items-center gap-1 text-[10px] font-black text-leaf uppercase tracking-widest">
                        <Star className="w-3 h-3 fill-current" />
                        Verified Purchase
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center bg-cream rounded-[40px] border-2 border-dashed border-border">
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl text-border">
                  <Star className="w-8 h-8" />
                </div>
                <p className="text-muted font-bold">No reviews yet. Be the first to share your experience!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
