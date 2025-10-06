import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

// Create client with service role key for server-side operations
// This bypasses RLS since we're handling auth with NextAuth
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

// Database schema types (will be generated from Supabase)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          password?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string | null;
          created_at?: string;
        };
      };
      chats: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          visibility: "private" | "public";
          created_at: string;
          last_context: any | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          visibility?: "private" | "public";
          created_at?: string;
          last_context?: any | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          visibility?: "private" | "public";
          created_at?: string;
          last_context?: any | null;
        };
      };
      messages: {
        Row: {
          id: string;
          chat_id: string;
          role: "user" | "assistant";
          parts: any[];
          attachments: any[];
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          role: "user" | "assistant";
          parts: any[];
          attachments?: any[];
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          role?: "user" | "assistant";
          parts?: any[];
          attachments?: any[];
          created_at?: string;
        };
      };
      votes: {
        Row: {
          id: string;
          chat_id: string;
          message_id: string;
          type: "up" | "down";
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          message_id: string;
          type: "up" | "down";
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          message_id?: string;
          type?: "up" | "down";
          created_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          title: string;
          kind: string;
          content: string;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          kind: string;
          content: string;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          kind?: string;
          content?: string;
          user_id?: string;
          created_at?: string;
        };
      };
      suggestions: {
        Row: {
          id: string;
          document_id: string;
          original_text: string;
          suggested_text: string;
          description: string | null;
          is_resolved: boolean;
          user_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          document_id: string;
          original_text: string;
          suggested_text: string;
          description?: string | null;
          is_resolved?: boolean;
          user_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          document_id?: string;
          original_text?: string;
          suggested_text?: string;
          description?: string | null;
          is_resolved?: boolean;
          user_id?: string;
          created_at?: string;
        };
      };
      streams: {
        Row: {
          id: string;
          chat_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          chat_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          chat_id?: string;
          created_at?: string;
        };
      };
    };
  };
};
