-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  password TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Chats table
CREATE TABLE IF NOT EXISTS chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  visibility TEXT DEFAULT 'private' CHECK (visibility IN ('private', 'public')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_context JSONB
);

-- Messages table
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant')),
  parts JSONB NOT NULL DEFAULT '[]',
  attachments JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Votes table
CREATE TABLE IF NOT EXISTS votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('up', 'down')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(message_id) -- One vote per message
);

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  kind TEXT NOT NULL,
  content TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Suggestions table
CREATE TABLE IF NOT EXISTS suggestions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  original_text TEXT NOT NULL,
  suggested_text TEXT NOT NULL,
  description TEXT,
  is_resolved BOOLEAN DEFAULT FALSE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Streams table
CREATE TABLE IF NOT EXISTS streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chats_user_id ON chats(user_id);
CREATE INDEX IF NOT EXISTS idx_chats_created_at ON chats(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_votes_chat_id ON votes(chat_id);
CREATE INDEX IF NOT EXISTS idx_votes_message_id ON votes(message_id);
CREATE INDEX IF NOT EXISTS idx_documents_user_id ON documents(user_id);
CREATE INDEX IF NOT EXISTS idx_suggestions_document_id ON suggestions(document_id);
CREATE INDEX IF NOT EXISTS idx_streams_chat_id ON streams(chat_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE suggestions ENABLE ROW LEVEL SECURITY;
ALTER TABLE streams ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid()::text = id::text);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid()::text = id::text);

-- Chats policies
CREATE POLICY "Users can view own chats" ON chats FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can insert own chats" ON chats FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);
CREATE POLICY "Users can update own chats" ON chats FOR UPDATE USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can delete own chats" ON chats FOR DELETE USING (user_id::text = auth.uid()::text);

-- Messages policies
CREATE POLICY "Users can view messages from own chats" ON messages FOR SELECT USING (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert messages to own chats" ON messages FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = messages.chat_id AND chats.user_id::text = auth.uid()::text)
);

-- Votes policies
CREATE POLICY "Users can view votes from own chats" ON votes FOR SELECT USING (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = votes.chat_id AND chats.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert votes to own chats" ON votes FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = votes.chat_id AND chats.user_id::text = auth.uid()::text)
);

-- Documents policies
CREATE POLICY "Users can view own documents" ON documents FOR SELECT USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can insert own documents" ON documents FOR INSERT WITH CHECK (user_id::text = auth.uid()::text);
CREATE POLICY "Users can update own documents" ON documents FOR UPDATE USING (user_id::text = auth.uid()::text);
CREATE POLICY "Users can delete own documents" ON documents FOR DELETE USING (user_id::text = auth.uid()::text);

-- Suggestions policies
CREATE POLICY "Users can view suggestions for own documents" ON suggestions FOR SELECT USING (
  EXISTS (SELECT 1 FROM documents WHERE documents.id = suggestions.document_id AND documents.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert suggestions for own documents" ON suggestions FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM documents WHERE documents.id = suggestions.document_id AND documents.user_id::text = auth.uid()::text)
);

-- Streams policies
CREATE POLICY "Users can view streams from own chats" ON streams FOR SELECT USING (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = streams.chat_id AND chats.user_id::text = auth.uid()::text)
);
CREATE POLICY "Users can insert streams to own chats" ON streams FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM chats WHERE chats.id = streams.chat_id AND chats.user_id::text = auth.uid()::text)
);