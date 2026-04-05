export interface ChatMessage {
  id: string
  text: string
  sender: 'user' | 'admin'
  timestamp: number
  productId?: string
  productName?: string
  seen?: boolean
  imageUrl?: string
  imageThumbnail?: string
  imagePublicId?: string
}

export interface ChatMetadata {
  userId: string
  userName: string
  userEmail: string
  userPhotoURL?: string
  lastMessage: string
  lastMessageTime: number
  unreadByUser: number
  unreadByAdmin: number
  status: 'active' | 'closed'
  contextProductId?: string
  contextProductSlug?: string
  contextProductName?: string
  contextProductImage?: string
  createdAt: number
}

export interface ChatConversation {
  userId: string
  metadata: ChatMetadata
  messages: ChatMessage[]
}

export interface TypingStatus {
  userId: string
  isUserTyping: boolean
  isAdminTyping: boolean
  timestamp: number
}

export interface ChatWithUserInfo {
  userId: string
  user: {
    name: string
    email: string
    photoURL?: string
  }
  metadata: ChatMetadata
  messages: ChatMessage[]
}
