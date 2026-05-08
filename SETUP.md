# Malir Mangoes - Setup Guide

## Getting Started

### 1. Supabase Setup

1. Create a free project at [supabase.com](https://supabase.com)
2. Go to **Project Settings → API**
3. Copy your `Project URL` and `anon (public) key`

### 2. Configure Environment

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Database Setup

Run these SQL queries in Supabase SQL Editor to create tables:

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  phone TEXT,
  name TEXT,
  address TEXT,
  city TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Policy: users can update own profile
CREATE POLICY "Users can update own profile"
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Policy: anyone can read profiles
CREATE POLICY "Anyone can read profiles"
  ON public.users FOR SELECT
  USING (true);

-- Mango varieties table
CREATE TABLE public.mango_varieties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price_per_kg NUMERIC NOT NULL,
  image_url TEXT,
  available BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.mango_varieties ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read varieties
CREATE POLICY "Anyone can read varieties"
  ON public.mango_varieties FOR SELECT
  USING (true);

-- Policy: admins/sellers can manage varieties
CREATE POLICY "Admins can manage varieties"
  ON public.mango_varieties FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'seller')
    )
  );

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.users(id),
  items JSONB NOT NULL,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'shipped', 'delivered', 'cancelled')),
  delivery_address TEXT NOT NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Policy: users see own orders
CREATE POLICY "Users see own orders"
  ON public.orders FOR SELECT
  USING (
    user_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'seller')
    )
  );

-- Policy: authenticated users can create orders
CREATE POLICY "Users can create orders"
  ON public.orders FOR INSERT
  WITH CHECK (true);

-- Policy: admins/sellers can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role IN ('admin', 'seller')
    )
  );

-- Messages table for chat
CREATE TABLE public.messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id),
  sender_id UUID REFERENCES public.users(id),
  receiver_id UUID REFERENCES public.users(id),
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT false
);

-- Enable RLS
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policy: users see messages for their orders
CREATE POLICY "Users see own messages"
  ON public.messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR receiver_id = auth.uid()
  );

-- Policy: users can send messages
CREATE POLICY "Users can send messages"
  ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid()
  );

-- Storage bucket for mango images
INSERT INTO storage.buckets (id, name, public)
VALUES ('mango-images', 'mango-images', true);

-- Policy: anyone can view images
CREATE POLICY "Public can view images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'mango-images');

-- Policy: admins can upload images
CREATE POLICY "Admins can upload images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'mango-images'
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Site settings table
CREATE TABLE public.site_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name TEXT DEFAULT 'Malir Mangoes',
  logo_url TEXT,
  hero_title TEXT DEFAULT 'Premium Pakistani Mangoes',
  hero_subtitle TEXT DEFAULT 'Fresh from orchards to your doorstep',
  hero_image TEXT,
  footer_text TEXT DEFAULT 'Fresh mangoes delivered all over Pakistan',
  contact_phone TEXT DEFAULT '+923283181163',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Policy: anyone can read settings
CREATE POLICY "Anyone can read settings"
  ON public.site_settings FOR SELECT
  USING (true);

-- Policy: only admins can update settings
CREATE POLICY "Admins can update settings"
  ON public.site_settings FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );
```

### 4. Set Up Admin User

After signing up through the website, update your role in Supabase SQL Editor:

```sql
UPDATE public.users
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

### 5. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000`

## Features

- **User Mode**: Browse mangoes, add to cart, order via website or WhatsApp
- **Seller Mode**: Process orders, update status, chat with customers
- **Admin Mode**: Add/edit/delete varieties, manage content, full access

## WhatsApp Ordering

When users click "WhatsApp Order", they're redirected to:
`https://wa.me/923283181163?text=...`

With pre-filled order details including items, address, and contact info.

## Deployment

Deploy to Vercel (free):
```bash
npm install -g vercel
vercel
```

Add environment variables in Vercel dashboard.