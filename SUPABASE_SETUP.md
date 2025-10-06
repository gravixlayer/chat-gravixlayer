# Supabase Database Setup

## Quick Setup Instructions

1. **Run the SQL Schema**: Copy the contents of `supabase-schema.sql` and run it in your Supabase SQL Editor
2. **Environment Variables**: Already configured in `.env.local`
3. **Database is Ready**: The application will automatically use Supabase when the environment variables are present

## What's Configured

✅ **Multi-user Support**: Each user has their own isolated data  
✅ **Row Level Security**: Users can only access their own chats and messages  
✅ **Concurrent Usage**: Multiple users can use the app simultaneously  
✅ **Rate Limiting**: Per-user rate limiting with persistent storage  
✅ **Real-time Ready**: Supabase supports real-time subscriptions if needed  

## Database Schema

The following tables are created:
- `users` - User accounts (email, password)
- `chats` - Chat conversations 
- `messages` - Individual messages in chats
- `votes` - Message voting (thumbs up/down)
- `documents` - Document storage for artifacts
- `suggestions` - AI suggestions for documents
- `streams` - Stream tracking for real-time features

## Security Features

- **Row Level Security (RLS)** enabled on all tables
- Users can only access their own data
- Guest users get temporary isolated accounts
- Proper foreign key relationships and cascading deletes

## Fallback Behavior

If Supabase is not available, the app automatically falls back to in-memory storage for development.

## Next Steps

1. Go to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy and paste the contents of `supabase-schema.sql`
4. Run the SQL to create all tables and security policies
5. Your app is now ready for multi-user production use!

The rate limiting will now work per-user and persist across sessions.