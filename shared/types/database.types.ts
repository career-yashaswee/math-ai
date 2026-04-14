// ─────────────────────────────────────────────────────────────
// Database Types — Supabase SDK v2 compatible format
// Includes Relationships, Functions, CompositeTypes as required
// Run: npx supabase gen types typescript --local > shared/types/database.types.ts
// ─────────────────────────────────────────────────────────────

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          class: number;
          xp: number;
          coins: number;
          points: number;
          streak: number;
          last_attempt_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          class?: number;
          xp?: number;
          coins?: number;
          points?: number;
          streak?: number;
          last_attempt_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          full_name?: string | null;
          avatar_url?: string | null;
          class?: number;
          xp?: number;
          coins?: number;
          points?: number;
          streak?: number;
          last_attempt_date?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      chapters: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          class: number;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          class?: number;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          description?: string | null;
          class?: number;
          order_index?: number;
          is_active?: boolean;
        };
        Relationships: [];
      };
      topics: {
        Row: {
          id: string;
          chapter_id: string;
          name: string;
          description: string | null;
          order_index: number;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          chapter_id: string;
          name: string;
          description?: string | null;
          order_index?: number;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          chapter_id?: string;
          name?: string;
          description?: string | null;
          order_index?: number;
          is_active?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "topics_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapters";
            referencedColumns: ["id"];
          },
        ];
      };
      questions: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          body: string;
          correct_answer: string;
          difficulty: "easy" | "medium" | "hard";
          marks: number;
          hint: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          topic_id: string;
          title: string;
          body: string;
          correct_answer: string;
          difficulty?: "easy" | "medium" | "hard";
          marks?: number;
          hint?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          topic_id?: string;
          title?: string;
          body?: string;
          correct_answer?: string;
          difficulty?: "easy" | "medium" | "hard";
          marks?: number;
          hint?: string | null;
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey";
            columns: ["topic_id"];
            isOneToOne: false;
            referencedRelation: "topics";
            referencedColumns: ["id"];
          },
        ];
      };
      attempts: {
        Row: {
          id: string;
          user_id: string;
          question_id: string;
          student_answer: string | null;
          started_at: string;
          submitted_at: string | null;
          time_taken_s: number | null;
          status: "in_progress" | "submitted" | "analysed";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          question_id: string;
          student_answer?: string | null;
          started_at?: string;
          submitted_at?: string | null;
          time_taken_s?: number | null;
          status?: "in_progress" | "submitted" | "analysed";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          student_answer?: string | null;
          submitted_at?: string | null;
          time_taken_s?: number | null;
          status?: "in_progress" | "submitted" | "analysed";
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "attempts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "attempts_question_id_fkey";
            columns: ["question_id"];
            isOneToOne: false;
            referencedRelation: "questions";
            referencedColumns: ["id"];
          },
        ];
      };
      analysis: {
        Row: {
          id: string;
          attempt_id: string;
          user_id: string;
          exact_match_score: number;
          gemini_score: number;
          final_score: number;
          approach_breakdown: string | null;
          feedback: string | null;
          correct_answer_hint: string | null;
          gemini_raw_response: Json | null;
          xp_awarded: number;
          coins_awarded: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          attempt_id: string;
          user_id: string;
          exact_match_score?: number;
          gemini_score?: number;
          final_score?: number;
          approach_breakdown?: string | null;
          feedback?: string | null;
          correct_answer_hint?: string | null;
          gemini_raw_response?: Json | null;
          xp_awarded?: number;
          coins_awarded?: number;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [
          {
            foreignKeyName: "analysis_attempt_id_fkey";
            columns: ["attempt_id"];
            isOneToOne: true;
            referencedRelation: "attempts";
            referencedColumns: ["id"];
          },
        ];
      };
      audit_logs: {
        Row: {
          id: string;
          user_id: string | null;
          event_type: string;
          entity_type: string | null;
          entity_id: string | null;
          metadata: Json | null;
          ip_address: string | null;
          user_agent: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          event_type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          metadata?: Json | null;
          ip_address?: string | null;
          user_agent?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: {
      questions_safe: {
        Row: {
          id: string;
          topic_id: string;
          title: string;
          body: string;
          difficulty: "easy" | "medium" | "hard";
          marks: number;
          hint: string | null;
          is_active: boolean;
          created_at: string;
        };
        Relationships: [];
      };
      leaderboard: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          points: number;
          xp: number;
          streak: number;
          rank: number;
        };
        Relationships: [];
      };
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      difficulty_level: "easy" | "medium" | "hard";
      attempt_status: "in_progress" | "submitted" | "analysed";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];

export type TablesInsert<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];

export type TablesUpdate<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"];
