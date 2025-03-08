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
      categories: {
        Row: {
          id: string
          name: string
          icon: string
          created_at: string
          user_id: string | null
        }
        Insert: {
          id?: string
          name: string
          icon: string
          created_at?: string
          user_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          icon?: string
          created_at?: string
          user_id?: string | null
        }
      }
      family_members: {
        Row: {
          id: string
          name: string
          avatar: string | null
          created_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name: string
          avatar?: string | null
          created_at?: string
          user_id: string
        }
        Update: {
          id?: string
          name?: string
          avatar?: string | null
          created_at?: string
          user_id?: string
        }
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          category_id: string | null
          status: 'pending' | 'in_progress' | 'completed'
          assigned_to: string | null
          deadline: string | null
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          category_id?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          assigned_to?: string | null
          deadline?: string | null
          created_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          category_id?: string | null
          status?: 'pending' | 'in_progress' | 'completed'
          assigned_to?: string | null
          deadline?: string | null
          created_at?: string
          updated_at?: string
          user_id?: string
        }
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
  }
}