export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  pgbouncer: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_auth: {
        Args: { p_usename: string }
        Returns: {
          password: string
          username: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      contribute_posts: {
        Row: {
          activity_type: string | null
          author: string | null
          common_room_activity_url: string | null
          content: string | null
          external_activity_url: string | null
          id: string
          kind: string | null
          raw: Json | null
          service_name: string | null
          skipped: boolean
          skipped_at: string | null
          skipped_reason: string | null
          source_id: string | null
          tags: Json | null
          thread_key: string | null
          title: string | null
          topics: Json | null
          ts: string | null
        }
        Insert: {
          activity_type?: string | null
          author?: string | null
          common_room_activity_url?: string | null
          content?: string | null
          external_activity_url?: string | null
          id: string
          kind?: string | null
          raw?: Json | null
          service_name?: string | null
          skipped?: boolean
          skipped_at?: string | null
          skipped_reason?: string | null
          source_id?: string | null
          tags?: Json | null
          thread_key?: string | null
          title?: string | null
          topics?: Json | null
          ts?: string | null
        }
        Update: {
          activity_type?: string | null
          author?: string | null
          common_room_activity_url?: string | null
          content?: string | null
          external_activity_url?: string | null
          id?: string
          kind?: string | null
          raw?: Json | null
          service_name?: string | null
          skipped?: boolean
          skipped_at?: string | null
          skipped_reason?: string | null
          source_id?: string | null
          tags?: Json | null
          thread_key?: string | null
          title?: string | null
          topics?: Json | null
          ts?: string | null
        }
        Relationships: []
      }
      contribute_thread_triage: {
        Row: {
          actions: Json
          analyzed_at: string
          contribute_thread_id: string
          id: string
          model_version: string
          prompt_version: string
          similar_solved_threads: Json | null
          status: string
          thread_key: string
        }
        Insert: {
          actions: Json
          analyzed_at?: string
          contribute_thread_id: string
          id?: string
          model_version: string
          prompt_version: string
          similar_solved_threads?: Json | null
          status?: string
          thread_key: string
        }
        Update: {
          actions?: Json
          analyzed_at?: string
          contribute_thread_id?: string
          id?: string
          model_version?: string
          prompt_version?: string
          similar_solved_threads?: Json | null
          status?: string
          thread_key?: string
        }
        Relationships: [
          {
            foreignKeyName: "contribute_thread_triage_contribute_thread_id_fkey"
            columns: ["contribute_thread_id"]
            referencedRelation: "contribute_inbox_triage"
            referencedColumns: ["thread_row_id"]
          },
          {
            foreignKeyName: "contribute_thread_triage_contribute_thread_id_fkey"
            columns: ["contribute_thread_id"]
            referencedRelation: "contribute_threads"
            referencedColumns: ["id"]
          },
        ]
      }
      contribute_threads: {
        Row: {
          author: string
          category: string | null
          conversation: string
          created_at: string | null
          entities: string[] | null
          external_activity_url: string | null
          first_msg_time: string | null
          id: string
          issue_embedding: string | null
          labels: string[] | null
          last_msg_time: string | null
          main_issue: string | null
          message_count: number | null
          metadata: Json | null
          processed_at: string | null
          product_areas: string[] | null
          proposed_solution: string | null
          resolved_by: string | null
          sentiment: string | null
          source: string | null
          stack: string[] | null
          status: string | null
          sub_category: string | null
          subject: string | null
          subject_embedding: string | null
          summary: string | null
          support_analyzed_at: string | null
          symptoms: string[] | null
          thread_id: string
          thread_key: string | null
          title: string
          topic: string | null
          topic_embedding: string | null
          topic_id: string | null
          updated_at: string | null
        }
        Insert: {
          author: string
          category?: string | null
          conversation: string
          created_at?: string | null
          entities?: string[] | null
          external_activity_url?: string | null
          first_msg_time?: string | null
          id?: string
          issue_embedding?: string | null
          labels?: string[] | null
          last_msg_time?: string | null
          main_issue?: string | null
          message_count?: number | null
          metadata?: Json | null
          processed_at?: string | null
          product_areas?: string[] | null
          proposed_solution?: string | null
          resolved_by?: string | null
          sentiment?: string | null
          source?: string | null
          stack?: string[] | null
          status?: string | null
          sub_category?: string | null
          subject?: string | null
          subject_embedding?: string | null
          summary?: string | null
          support_analyzed_at?: string | null
          symptoms?: string[] | null
          thread_id: string
          thread_key?: string | null
          title: string
          topic?: string | null
          topic_embedding?: string | null
          topic_id?: string | null
          updated_at?: string | null
        }
        Update: {
          author?: string
          category?: string | null
          conversation?: string
          created_at?: string | null
          entities?: string[] | null
          external_activity_url?: string | null
          first_msg_time?: string | null
          id?: string
          issue_embedding?: string | null
          labels?: string[] | null
          last_msg_time?: string | null
          main_issue?: string | null
          message_count?: number | null
          metadata?: Json | null
          processed_at?: string | null
          product_areas?: string[] | null
          proposed_solution?: string | null
          resolved_by?: string | null
          sentiment?: string | null
          source?: string | null
          stack?: string[] | null
          status?: string | null
          sub_category?: string | null
          subject?: string | null
          subject_embedding?: string | null
          summary?: string | null
          support_analyzed_at?: string | null
          symptoms?: string[] | null
          thread_id?: string
          thread_key?: string | null
          title?: string
          topic?: string | null
          topic_embedding?: string | null
          topic_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      octolens_posts: {
        Row: {
          action: string | null
          author: string | null
          author_avatar_url: string | null
          author_profile_link: string | null
          body: string | null
          bookmarked: boolean | null
          created_at: string | null
          id: string
          image_url: string | null
          keyword: string | null
          keywords: Json | null
          language: string | null
          raw: Json | null
          relevance_comment: string | null
          relevance_score: string | null
          sentiment_label: string | null
          source: string | null
          source_id: string
          subreddit: string | null
          tags: Json | null
          title: string | null
          ts: string | null
          url: string | null
          view_id: number | null
          view_keywords: Json | null
          view_name: string | null
        }
        Insert: {
          action?: string | null
          author?: string | null
          author_avatar_url?: string | null
          author_profile_link?: string | null
          body?: string | null
          bookmarked?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          keyword?: string | null
          keywords?: Json | null
          language?: string | null
          raw?: Json | null
          relevance_comment?: string | null
          relevance_score?: string | null
          sentiment_label?: string | null
          source?: string | null
          source_id: string
          subreddit?: string | null
          tags?: Json | null
          title?: string | null
          ts?: string | null
          url?: string | null
          view_id?: number | null
          view_keywords?: Json | null
          view_name?: string | null
        }
        Update: {
          action?: string | null
          author?: string | null
          author_avatar_url?: string | null
          author_profile_link?: string | null
          body?: string | null
          bookmarked?: boolean | null
          created_at?: string | null
          id?: string
          image_url?: string | null
          keyword?: string | null
          keywords?: Json | null
          language?: string | null
          raw?: Json | null
          relevance_comment?: string | null
          relevance_score?: string | null
          sentiment_label?: string | null
          source?: string | null
          source_id?: string
          subreddit?: string | null
          tags?: Json | null
          title?: string | null
          ts?: string | null
          url?: string | null
          view_id?: number | null
          view_keywords?: Json | null
          view_name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      contribute_inbox_triage: {
        Row: {
          actions: Json | null
          analyzed_at: string | null
          author: string | null
          external_activity_url: string | null
          first_msg_time: string | null
          last_msg_time: string | null
          message_count: number | null
          model_version: string | null
          product_areas: string[] | null
          prompt_version: string | null
          sentiment: string | null
          source: string | null
          subject: string | null
          summary: string | null
          thread_id: string | null
          thread_key: string | null
          thread_row_id: string | null
          thread_status: string | null
          title: string | null
          triage_status: string | null
        }
        Relationships: []
      }
      v_contribute_pending_posts_to_threads: {
        Row: {
          activity_type: string | null
          author: string | null
          common_room_activity_url: string | null
          content: string | null
          external_activity_url: string | null
          id: string | null
          kind: string | null
          raw: Json | null
          service_name: string | null
          source_id: string | null
          tags: Json | null
          thread_key: string | null
          title: string | null
          topics: Json | null
          ts: string | null
        }
        Relationships: []
      }
      v_contribute_stats_by_user: {
        Row: {
          platform: string | null
          solved_issues: number | null
          total_posts: number | null
          total_questions: number | null
          total_replies: number | null
          username: string | null
        }
        Relationships: []
      }
      v_contribute_threads: {
        Row: {
          author: string | null
          category: string | null
          conversation: string | null
          created_at: string | null
          external_activity_url: string | null
          first_msg_time: string | null
          message_count: number | null
          product_areas: string[] | null
          source: string | null
          stack: string[] | null
          status: string | null
          sub_category: string | null
          subject: string | null
          summary: string | null
          thread_id: string | null
          thread_key: string | null
        }
        Insert: {
          author?: string | null
          category?: string | null
          conversation?: string | null
          created_at?: string | null
          external_activity_url?: string | null
          first_msg_time?: string | null
          message_count?: number | null
          product_areas?: string[] | null
          source?: string | null
          stack?: string[] | null
          status?: string | null
          sub_category?: string | null
          subject?: string | null
          summary?: string | null
          thread_id?: string | null
          thread_key?: string | null
        }
        Update: {
          author?: string | null
          category?: string | null
          conversation?: string | null
          created_at?: string | null
          external_activity_url?: string | null
          first_msg_time?: string | null
          message_count?: number | null
          product_areas?: string[] | null
          source?: string | null
          stack?: string[] | null
          status?: string | null
          sub_category?: string | null
          subject?: string | null
          summary?: string | null
          thread_id?: string | null
          thread_key?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      find_similar_solved_threads: {
        Args: { p_issue_embedding: string; p_limit?: number }
        Returns: {
          external_activity_url: string
          main_issue: string
          proposed_solution: string
          similarity: number
          thread_key: string
        }[]
      }
      get_leaderboard: {
        Args: { period: string }
        Returns: {
          author: string
          reply_count: number
        }[]
      }
      reprocess_stale_threads: { Args: never; Returns: undefined }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          start_after?: string
        }
        Returns: {
          id: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search:
        | {
            Args: {
              bucketname: string
              levels?: number
              limits?: number
              offsets?: number
              prefix: string
            }
            Returns: {
              created_at: string
              id: string
              last_accessed_at: string
              metadata: Json
              name: string
              updated_at: string
            }[]
          }
        | {
            Args: {
              bucketname: string
              levels?: number
              limits?: number
              offsets?: number
              prefix: string
              search?: string
              sortcolumn?: string
              sortorder?: string
            }
            Returns: {
              created_at: string
              id: string
              last_accessed_at: string
              metadata: Json
              name: string
              updated_at: string
            }[]
          }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
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
  graphql_public: {
    Enums: {},
  },
  pgbouncer: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const
