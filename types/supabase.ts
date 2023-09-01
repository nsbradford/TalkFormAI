export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      forms: {
        Row: {
          created_at: string | null
          description: string | null
          fields_guidance: string
          fields_schema: Json
          id: string
          is_open: boolean
          name: string
          raw_instructions: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          fields_guidance: string
          fields_schema: Json
          id: string
          is_open: boolean
          name: string
          raw_instructions: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          fields_guidance?: string
          fields_schema?: Json
          id?: string
          is_open?: boolean
          name?: string
          raw_instructions?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      responses: {
        Row: {
          created_at: string | null
          fields: Json
          form_id: string
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          fields: Json
          form_id: string
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          fields?: Json
          form_id?: string
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
