-- Simple approach: Delete old trial user and create fresh admin
-- Run these ONE BY ONE:

-- Step 1: Delete if exists
DELETE FROM auth.users WHERE email = 'jawad@malirmangoes.com';

-- Step 2: Create new user (use any email you want)
INSERT INTO auth.users (id, email, encrypted_password, created_at, email_confirmed_at)
VALUES (
  gen_random_uuid(),
  'jawad@malirmangoes.com',
  '$2a$10$abcdefghijklmnopqrstuv',  -- placeholder
  NOW(),
  NOW()
);

-- Step 3: Get the ID and create profile
INSERT INTO public.users (id, email, name, role)
SELECT id, email, 'Admin', 'admin'
FROM auth.users 
WHERE email = 'jawad@malirmangoes.com';