-- Temporarily disable Row Level Security to get the app working
-- We'll re-enable it later with proper NextAuth integration

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE chats DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE documents DISABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions DISABLE ROW LEVEL SECURITY;
ALTER TABLE streams DISABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own profile" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Users can view own chats" ON chats;
DROP POLICY IF EXISTS "Users can insert own chats" ON chats;
DROP POLICY IF EXISTS "Users can update own chats" ON chats;
DROP POLICY IF EXISTS "Users can delete own chats" ON chats;
DROP POLICY IF EXISTS "Users can view messages from own chats" ON messages;
DROP POLICY IF EXISTS "Users can insert messages to own chats" ON messages;
DROP POLICY IF EXISTS "Users can view votes from own chats" ON votes;
DROP POLICY IF EXISTS "Users can insert votes to own chats" ON votes;
DROP POLICY IF EXISTS "Users can view own documents" ON documents;
DROP POLICY IF EXISTS "Users can insert own documents" ON documents;
DROP POLICY IF EXISTS "Users can update own documents" ON documents;
DROP POLICY IF EXISTS "Users can delete own documents" ON documents;
DROP POLICY IF EXISTS "Users can view suggestions for own documents" ON suggestions;
DROP POLICY IF EXISTS "Users can insert suggestions for own documents" ON suggestions;
DROP POLICY IF EXISTS "Users can view streams from own chats" ON streams;
DROP POLICY IF EXISTS "Users can insert streams to own chats" ON streams;