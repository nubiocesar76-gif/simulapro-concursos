export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      boards: {
        Row: {
          acronym: string | null
          created_at: string
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          acronym?: string | null
          created_at?: string
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          acronym?: string | null
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      content_distributions: {
        Row: {
          available_from: string | null
          available_until: string | null
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          package_version_id: string
          status: Database["public"]["Enums"]["distribution_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          package_version_id: string
          status?: Database["public"]["Enums"]["distribution_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          available_from?: string | null
          available_until?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          package_version_id?: string
          status?: Database["public"]["Enums"]["distribution_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "content_distributions_package_version_id_fkey"
            columns: ["package_version_id"]
            isOneToOne: false
            referencedRelation: "package_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      exams: {
        Row: {
          board_id: string
          created_at: string
          id: string
          name: string
          updated_at: string
          year: number | null
        }
        Insert: {
          board_id: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          year?: number | null
        }
        Update: {
          board_id?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exams_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
        ]
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          question_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          question_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      import_batches: {
        Row: {
          created_at: string
          created_by: string | null
          file_type: string | null
          filename: string | null
          id: string
          package_id: string | null
          package_version_id: string | null
          report: Json | null
          status: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          file_type?: string | null
          filename?: string | null
          id?: string
          package_id?: string | null
          package_version_id?: string | null
          report?: Json | null
          status?: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          file_type?: string | null
          filename?: string | null
          id?: string
          package_id?: string | null
          package_version_id?: string | null
          report?: Json | null
          status?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "import_batches_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "import_batches_package_version_id_fkey"
            columns: ["package_version_id"]
            isOneToOne: false
            referencedRelation: "package_versions"
            referencedColumns: ["id"]
          },
        ]
      }
      logs: {
        Row: {
          action: string
          created_at: string
          entity: string | null
          entity_id: string | null
          id: string
          metadata: Json | null
          user_id: string | null
        }
        Insert: {
          action: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Update: {
          action?: string
          created_at?: string
          entity?: string | null
          entity_id?: string | null
          id?: string
          metadata?: Json | null
          user_id?: string | null
        }
        Relationships: []
      }
      package_versions: {
        Row: {
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          notes: string | null
          package_id: string
          published: boolean
          published_at: string | null
          published_by: string | null
          release_notes: string | null
          status: Database["public"]["Enums"]["package_version_status"]
          updated_at: string
          updated_by: string | null
          version: string
          version_number: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          notes?: string | null
          package_id: string
          published?: boolean
          published_at?: string | null
          published_by?: string | null
          release_notes?: string | null
          status?: Database["public"]["Enums"]["package_version_status"]
          updated_at?: string
          updated_by?: string | null
          version: string
          version_number: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          notes?: string | null
          package_id?: string
          published?: boolean
          published_at?: string | null
          published_by?: string | null
          release_notes?: string | null
          status?: Database["public"]["Enums"]["package_version_status"]
          updated_at?: string
          updated_by?: string | null
          version?: string
          version_number?: string
        }
        Relationships: [
          {
            foreignKeyName: "package_versions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
        ]
      }
      packages: {
        Row: {
          course_id: string
          created_at: string
          created_by: string | null
          description: string | null
          id: string
          name: string
          slug: string
          status: Database["public"]["Enums"]["package_status"]
          updated_at: string
          updated_by: string | null
        }
        Insert: {
          course_id: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name: string
          slug: string
          status?: Database["public"]["Enums"]["package_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Update: {
          course_id?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          id?: string
          name?: string
          slug?: string
          status?: Database["public"]["Enums"]["package_status"]
          updated_at?: string
          updated_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "packages_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      positions: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "positions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
      }
      question_attempts: {
        Row: {
          answered_at: string
          chosen_answer: string | null
          id: string
          is_correct: boolean | null
          question_id: string
          user_id: string
        }
        Insert: {
          answered_at?: string
          chosen_answer?: string | null
          id?: string
          is_correct?: boolean | null
          question_id: string
          user_id: string
        }
        Update: {
          answered_at?: string
          chosen_answer?: string | null
          id?: string
          is_correct?: boolean | null
          question_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "question_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
        ]
      }
      questions: {
        Row: {
          alternatives: Json
          board_id: string | null
          correct_answer: string | null
          created_at: string
          difficulty: string | null
          exam_id: string | null
          explanation: string | null
          id: string
          metadata: Json | null
          package_id: string | null
          package_version_id: string | null
          position_id: string | null
          statement: string
          subject_id: string | null
          topic_id: string | null
          updated_at: string
          year: number | null
        }
        Insert: {
          alternatives?: Json
          board_id?: string | null
          correct_answer?: string | null
          created_at?: string
          difficulty?: string | null
          exam_id?: string | null
          explanation?: string | null
          id?: string
          metadata?: Json | null
          package_id?: string | null
          package_version_id?: string | null
          position_id?: string | null
          statement: string
          subject_id?: string | null
          topic_id?: string | null
          updated_at?: string
          year?: number | null
        }
        Update: {
          alternatives?: Json
          board_id?: string | null
          correct_answer?: string | null
          created_at?: string
          difficulty?: string | null
          exam_id?: string | null
          explanation?: string | null
          id?: string
          metadata?: Json | null
          package_id?: string | null
          package_version_id?: string | null
          position_id?: string | null
          statement?: string
          subject_id?: string | null
          topic_id?: string | null
          updated_at?: string
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_exam_id_fkey"
            columns: ["exam_id"]
            isOneToOne: false
            referencedRelation: "exams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_package_version_id_fkey"
            columns: ["package_version_id"]
            isOneToOne: false
            referencedRelation: "package_versions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      statistics: {
        Row: {
          id: string
          subject_id: string | null
          total_answered: number
          total_correct: number
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          subject_id?: string | null
          total_answered?: number
          total_correct?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          subject_id?: string | null
          total_answered?: number
          total_correct?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "statistics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      subjects: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          active: boolean
          course_id: string
          created_at: string
          created_by: string | null
          distribution_id: string | null
          ends_at: string | null
          expires_at: string | null
          id: string
          package_id: string | null
          starts_at: string
          status: Database["public"]["Enums"]["subscription_status"]
          updated_at: string
          updated_by: string | null
          user_id: string
        }
        Insert: {
          active?: boolean
          course_id?: string
          created_at?: string
          created_by?: string | null
          distribution_id?: string | null
          ends_at?: string | null
          expires_at?: string | null
          id?: string
          package_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          updated_by?: string | null
          user_id: string
        }
        Update: {
          active?: boolean
          course_id?: string
          created_at?: string
          created_by?: string | null
          distribution_id?: string | null
          ends_at?: string | null
          expires_at?: string | null
          id?: string
          package_id?: string | null
          starts_at?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          updated_at?: string
          updated_by?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_distribution_id_fkey"
            columns: ["distribution_id"]
            isOneToOne: false
            referencedRelation: "content_distributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      study_session_questions: {
        Row: {
          answered_at: string | null
          correct_answer: string | null
          favorite: boolean
          id: string
          is_correct: boolean | null
          question_id: string
          question_order: number
          response_time_seconds: number | null
          review_later: boolean
          selected_answer: string | null
          study_session_id: string
        }
        Insert: {
          answered_at?: string | null
          correct_answer?: string | null
          favorite?: boolean
          id?: string
          is_correct?: boolean | null
          question_id: string
          question_order: number
          response_time_seconds?: number | null
          review_later?: boolean
          selected_answer?: string | null
          study_session_id: string
        }
        Update: {
          answered_at?: string | null
          correct_answer?: string | null
          favorite?: boolean
          id?: string
          is_correct?: boolean | null
          question_id?: string
          question_order?: number
          response_time_seconds?: number | null
          review_later?: boolean
          selected_answer?: string | null
          study_session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_session_questions_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_session_questions_study_session_id_fkey"
            columns: ["study_session_id"]
            isOneToOne: false
            referencedRelation: "study_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      study_sessions: {
        Row: {
          created_at: string
          distribution_id: string
          duration_seconds: number | null
          finished_at: string | null
          id: string
          mode: Database["public"]["Enums"]["study_mode"]
          settings: Json
          started_at: string
          status: Database["public"]["Enums"]["study_session_status"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          distribution_id: string
          duration_seconds?: number | null
          finished_at?: string | null
          id?: string
          mode: Database["public"]["Enums"]["study_mode"]
          settings?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["study_session_status"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          distribution_id?: string
          duration_seconds?: number | null
          finished_at?: string | null
          id?: string
          mode?: Database["public"]["Enums"]["study_mode"]
          settings?: Json
          started_at?: string
          status?: Database["public"]["Enums"]["study_session_status"]
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_sessions_distribution_id_fkey"
            columns: ["distribution_id"]
            isOneToOne: false
            referencedRelation: "content_distributions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "study_sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          subject_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          subject_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          subject_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_subject_id_fkey"
            columns: ["subject_id"]
            isOneToOne: false
            referencedRelation: "subjects"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "student"
      distribution_status: "ACTIVE" | "INACTIVE" | "SCHEDULED" | "EXPIRED"
      package_status: "ACTIVE" | "INACTIVE" | "ARCHIVED"
      package_version_status: "DRAFT" | "READY" | "PUBLISHED" | "ARCHIVED"
      study_mode: "STUDY" | "EXAM" | "REVIEW" | "FAVORITES" | "WRONG_ONLY"
      study_session_status: "IN_PROGRESS" | "PAUSED" | "FINISHED"
      subscription_status: "ACTIVE" | "INACTIVE"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "student"],
      distribution_status: ["ACTIVE", "INACTIVE", "SCHEDULED", "EXPIRED"],
      package_status: ["ACTIVE", "INACTIVE", "ARCHIVED"],
      package_version_status: ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"],
      study_mode: ["STUDY", "EXAM", "REVIEW", "FAVORITES", "WRONG_ONLY"],
      study_session_status: ["IN_PROGRESS", "PAUSED", "FINISHED"],
      subscription_status: ["ACTIVE", "INACTIVE"],
    },
  },
} as const
