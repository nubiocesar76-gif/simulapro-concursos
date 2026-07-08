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
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      exam_catalog: {
        Row: {
          answer_key_available: boolean
          approved_questions: number
          board_id: string
          contest: string
          created_at: string
          id: string
          imported_questions: number
          notes: string | null
          organization: string
          pdf_available: boolean
          position_id: string
          published_questions: number
          slug: string
          status: Database["public"]["Enums"]["exam_catalog_status"]
          storage_folder: string
          updated_at: string
          verified: boolean
          year: number | null
        }
        Insert: {
          answer_key_available?: boolean
          approved_questions?: number
          board_id: string
          contest: string
          created_at?: string
          id?: string
          imported_questions?: number
          notes?: string | null
          organization: string
          pdf_available?: boolean
          position_id: string
          published_questions?: number
          slug: string
          status?: Database["public"]["Enums"]["exam_catalog_status"]
          storage_folder: string
          updated_at?: string
          verified?: boolean
          year?: number | null
        }
        Update: {
          answer_key_available?: boolean
          approved_questions?: number
          board_id?: string
          contest?: string
          created_at?: string
          id?: string
          imported_questions?: number
          notes?: string | null
          organization?: string
          pdf_available?: boolean
          position_id?: string
          published_questions?: number
          slug?: string
          status?: Database["public"]["Enums"]["exam_catalog_status"]
          storage_folder?: string
          updated_at?: string
          verified?: boolean
          year?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "exam_catalog_board_id_fkey"
            columns: ["board_id"]
            isOneToOne: false
            referencedRelation: "boards"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "exam_catalog_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      exam_files: {
        Row: {
          created_at: string
          exam_catalog_id: string
          filename: string
          id: string
          mime_type: string | null
          size: number | null
          storage_path: string
          type: Database["public"]["Enums"]["exam_file_type"]
        }
        Insert: {
          created_at?: string
          exam_catalog_id: string
          filename: string
          id?: string
          mime_type?: string | null
          size?: number | null
          storage_path: string
          type: Database["public"]["Enums"]["exam_file_type"]
        }
        Update: {
          created_at?: string
          exam_catalog_id?: string
          filename?: string
          id?: string
          mime_type?: string | null
          size?: number | null
          storage_path?: string
          type?: Database["public"]["Enums"]["exam_file_type"]
        }
        Relationships: [
          {
            foreignKeyName: "exam_files_exam_catalog_id_fkey"
            columns: ["exam_catalog_id"]
            isOneToOne: false
            referencedRelation: "exam_catalog"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_architectures: {
        Row: {
          course_id: string
          created_at: string
          description: string | null
          engine_version: string
          id: string
          is_active: boolean
          name: string
          position_id: string
          slug: string
          status: Database["public"]["Enums"]["editorial_architecture_status"]
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          engine_version?: string
          id?: string
          is_active?: boolean
          name: string
          position_id: string
          slug: string
          status?: Database["public"]["Enums"]["editorial_architecture_status"]
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          engine_version?: string
          id?: string
          is_active?: boolean
          name?: string
          position_id?: string
          slug?: string
          status?: Database["public"]["Enums"]["editorial_architecture_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_architectures_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_architectures_position_id_fkey"
            columns: ["position_id"]
            isOneToOne: false
            referencedRelation: "positions"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_disciplines: {
        Row: {
          architecture_id: string
          code: string | null
          confidence: number
          created_at: string
          description: string | null
          evidence_count: number
          frequency_percent: number | null
          id: string
          name: string
          notes: string | null
          priority: Database["public"]["Enums"]["editorial_priority"] | null
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["editorial_record_status"]
          updated_at: string
        }
        Insert: {
          architecture_id: string
          code?: string | null
          confidence?: number
          created_at?: string
          description?: string | null
          evidence_count?: number
          frequency_percent?: number | null
          id?: string
          name: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["editorial_priority"] | null
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["editorial_record_status"]
          updated_at?: string
        }
        Update: {
          architecture_id?: string
          code?: string | null
          confidence?: number
          created_at?: string
          description?: string | null
          evidence_count?: number
          frequency_percent?: number | null
          id?: string
          name?: string
          notes?: string | null
          priority?: Database["public"]["Enums"]["editorial_priority"] | null
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["editorial_record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_disciplines_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_topics: {
        Row: {
          architecture_id: string
          code: string | null
          confidence: number
          created_at: string
          description: string | null
          discipline_id: string
          evidence_count: number
          id: string
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["editorial_record_status"]
          updated_at: string
        }
        Insert: {
          architecture_id: string
          code?: string | null
          confidence?: number
          created_at?: string
          description?: string | null
          discipline_id: string
          evidence_count?: number
          id?: string
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["editorial_record_status"]
          updated_at?: string
        }
        Update: {
          architecture_id?: string
          code?: string | null
          confidence?: number
          created_at?: string
          description?: string | null
          discipline_id?: string
          evidence_count?: number
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["editorial_record_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_topics_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_topics_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "editorial_disciplines"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_keywords: {
        Row: {
          architecture_id: string
          code: string | null
          created_at: string
          id: string
          keyword_type: Database["public"]["Enums"]["editorial_keyword_type"]
          status: Database["public"]["Enums"]["editorial_record_status"]
          subtopic_id: string | null
          term: string
          topic_id: string
          updated_at: string
          weight: number
        }
        Insert: {
          architecture_id: string
          code?: string | null
          created_at?: string
          id?: string
          keyword_type?: Database["public"]["Enums"]["editorial_keyword_type"]
          status?: Database["public"]["Enums"]["editorial_record_status"]
          subtopic_id?: string | null
          term: string
          topic_id: string
          updated_at?: string
          weight?: number
        }
        Update: {
          architecture_id?: string
          code?: string | null
          created_at?: string
          id?: string
          keyword_type?: Database["public"]["Enums"]["editorial_keyword_type"]
          status?: Database["public"]["Enums"]["editorial_record_status"]
          subtopic_id?: string | null
          term?: string
          topic_id?: string
          updated_at?: string
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "editorial_keywords_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_keywords_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "editorial_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_rules: {
        Row: {
          architecture_id: string
          code: string | null
          confidence_percent: number
          created_at: string
          discipline_id: string | null
          engine_version: string | null
          id: string
          notes: string | null
          status: Database["public"]["Enums"]["editorial_record_status"]
          subtopic_id: string | null
          topic_id: string | null
          trigger_terms: string[]
          updated_at: string
        }
        Insert: {
          architecture_id: string
          code?: string | null
          confidence_percent?: number
          created_at?: string
          discipline_id?: string | null
          engine_version?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["editorial_record_status"]
          subtopic_id?: string | null
          topic_id?: string | null
          trigger_terms?: string[]
          updated_at?: string
        }
        Update: {
          architecture_id?: string
          code?: string | null
          confidence_percent?: number
          created_at?: string
          discipline_id?: string | null
          engine_version?: string | null
          id?: string
          notes?: string | null
          status?: Database["public"]["Enums"]["editorial_record_status"]
          subtopic_id?: string | null
          topic_id?: string | null
          trigger_terms?: string[]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_rules_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_rules_discipline_id_fkey"
            columns: ["discipline_id"]
            isOneToOne: false
            referencedRelation: "editorial_disciplines"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_rules_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "editorial_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_subtopics: {
        Row: {
          architecture_id: string
          code: string | null
          confidence: number
          created_at: string
          description: string | null
          evidence_count: number
          id: string
          name: string
          slug: string
          sort_order: number
          status: Database["public"]["Enums"]["editorial_record_status"]
          topic_id: string
          updated_at: string
        }
        Insert: {
          architecture_id: string
          code?: string | null
          confidence?: number
          created_at?: string
          description?: string | null
          evidence_count?: number
          id?: string
          name: string
          slug: string
          sort_order?: number
          status?: Database["public"]["Enums"]["editorial_record_status"]
          topic_id: string
          updated_at?: string
        }
        Update: {
          architecture_id?: string
          code?: string | null
          confidence?: number
          created_at?: string
          description?: string | null
          evidence_count?: number
          id?: string
          name?: string
          slug?: string
          sort_order?: number
          status?: Database["public"]["Enums"]["editorial_record_status"]
          topic_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_subtopics_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_subtopics_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "editorial_topics"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_changelog: {
        Row: {
          architecture_id: string
          change_type: string
          created_at: string
          entity_code: string | null
          entity_id: string | null
          entity_type: string
          id: string
          import_log_id: string | null
          new_snapshot: Json | null
          previous_snapshot: Json | null
        }
        Insert: {
          architecture_id: string
          change_type: string
          created_at?: string
          entity_code?: string | null
          entity_id?: string | null
          entity_type: string
          id?: string
          import_log_id?: string | null
          new_snapshot?: Json | null
          previous_snapshot?: Json | null
        }
        Update: {
          architecture_id?: string
          change_type?: string
          created_at?: string
          entity_code?: string | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          import_log_id?: string | null
          new_snapshot?: Json | null
          previous_snapshot?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "editorial_changelog_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "editorial_changelog_import_log_id_fkey"
            columns: ["import_log_id"]
            isOneToOne: false
            referencedRelation: "editorial_import_logs"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_import_logs: {
        Row: {
          architecture_id: string | null
          architecture_version: string
          created_at: string
          duration_ms: number
          engine_version: string
          error_message: string | null
          id: string
          imported_files: Json
          package_path: string
          record_counts: Json
          status: string
          user_id: string
        }
        Insert: {
          architecture_id?: string | null
          architecture_version: string
          created_at?: string
          duration_ms?: number
          engine_version: string
          error_message?: string | null
          id?: string
          imported_files?: Json
          package_path: string
          record_counts?: Json
          status?: string
          user_id: string
        }
        Update: {
          architecture_id?: string | null
          architecture_version?: string
          created_at?: string
          duration_ms?: number
          engine_version?: string
          error_message?: string | null
          id?: string
          imported_files?: Json
          package_path?: string
          record_counts?: Json
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "editorial_import_logs_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
        ]
      }
      editorial_evidence: {
        Row: {
          architecture_id: string
          created_at: string
          description: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["editorial_entity_type"]
          evidence_type: Database["public"]["Enums"]["editorial_evidence_type"]
          id: string
          source_ref: string | null
          weight: number
        }
        Insert: {
          architecture_id: string
          created_at?: string
          description?: string | null
          entity_id: string
          entity_type: Database["public"]["Enums"]["editorial_entity_type"]
          evidence_type: Database["public"]["Enums"]["editorial_evidence_type"]
          id?: string
          source_ref?: string | null
          weight?: number
        }
        Update: {
          architecture_id?: string
          created_at?: string
          description?: string | null
          entity_id?: string
          entity_type?: Database["public"]["Enums"]["editorial_entity_type"]
          evidence_type?: Database["public"]["Enums"]["editorial_evidence_type"]
          id?: string
          source_ref?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "editorial_evidence_architecture_id_fkey"
            columns: ["architecture_id"]
            isOneToOne: false
            referencedRelation: "editorial_architectures"
            referencedColumns: ["id"]
          },
        ]
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
          slug: string
          updated_at: string
        }
        Insert: {
          course_id: string
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          course_id?: string
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
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
      editorial_architecture_status:
        | "PROPOSTO"
        | "EM_REVISAO"
        | "APROVADO"
        | "PUBLICADO"
        | "DEPRECIADO"
      editorial_entity_type: "DISCIPLINE" | "TOPIC" | "SUBTOPIC" | "KEYWORD" | "RULE"
      editorial_evidence_type:
        | "CONFIRMACAO"
        | "CONTRADICAO"
        | "REVISAO_HUMANA"
        | "SUGESTAO_IA"
      editorial_keyword_type: "PRINCIPAL" | "SECUNDARIA" | "FRACA"
      editorial_priority: "ALTA" | "MEDIA" | "BAIXA"
      editorial_record_status:
        | "PROPOSTO"
        | "EM_REVISAO"
        | "APROVADO"
        | "PUBLICADO"
        | "DEPRECIADO"
        | "MESCLADO"
      exam_catalog_status:
        | "PLANNED"
        | "DOWNLOADED"
        | "PROCESSING"
        | "REVIEW"
        | "APPROVED"
        | "IMPORTED"
        | "PUBLISHED"
      exam_file_type:
        | "PROVA"
        | "GABARITO"
        | "EDITAL"
        | "RAW"
        | "QUESTIONS_RAW"
        | "QUESTIONS"
        | "METADATA"
        | "STATUS"
        | "REVIEW"
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
      editorial_architecture_status: [
        "PROPOSTO",
        "EM_REVISAO",
        "APROVADO",
        "PUBLICADO",
        "DEPRECIADO",
      ],
      editorial_entity_type: ["DISCIPLINE", "TOPIC", "SUBTOPIC", "KEYWORD", "RULE"],
      editorial_evidence_type: [
        "CONFIRMACAO",
        "CONTRADICAO",
        "REVISAO_HUMANA",
        "SUGESTAO_IA",
      ],
      editorial_keyword_type: ["PRINCIPAL", "SECUNDARIA", "FRACA"],
      editorial_priority: ["ALTA", "MEDIA", "BAIXA"],
      editorial_record_status: [
        "PROPOSTO",
        "EM_REVISAO",
        "APROVADO",
        "PUBLICADO",
        "DEPRECIADO",
        "MESCLADO",
      ],
      exam_catalog_status: [
        "PLANNED",
        "DOWNLOADED",
        "PROCESSING",
        "REVIEW",
        "APPROVED",
        "IMPORTED",
        "PUBLISHED",
      ],
      exam_file_type: [
        "PROVA",
        "GABARITO",
        "EDITAL",
        "RAW",
        "QUESTIONS_RAW",
        "QUESTIONS",
        "METADATA",
        "STATUS",
        "REVIEW",
      ],
      package_status: ["ACTIVE", "INACTIVE", "ARCHIVED"],
      package_version_status: ["DRAFT", "READY", "PUBLISHED", "ARCHIVED"],
      study_mode: ["STUDY", "EXAM", "REVIEW", "FAVORITES", "WRONG_ONLY"],
      study_session_status: ["IN_PROGRESS", "PAUSED", "FINISHED"],
      subscription_status: ["ACTIVE", "INACTIVE"],
    },
  },
} as const
