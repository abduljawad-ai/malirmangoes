import ChatInterface from '@/components/chat/ChatInterface'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Chat with Us | Malir Mangoes',
  description: 'Get in touch with our support team for any questions about our premium mangoes',
}

interface ChatPageProps {
  searchParams: Promise<{ product?: string; name?: string; image?: string; price?: string }>
}

export default async function ChatPage({ searchParams }: ChatPageProps) {
  const resolvedParams = await searchParams
  const productInfo = resolvedParams.product
    ? {
        id: resolvedParams.product,
        name: resolvedParams.name || 'Unknown Product',
        image: resolvedParams.image,
        price: resolvedParams.price ? parseInt(resolvedParams.price) : undefined
      }
    : undefined

  return (
    <div className="fixed inset-0 bg-cream/40 z-40 p-4 sm:p-6 lg:p-8">
      <ChatInterface productInfo={productInfo} />
    </div>
  )
}
