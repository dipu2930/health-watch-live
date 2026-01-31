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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      alerts: {
        Row: {
          acknowledged_at: string | null
          acknowledged_by: string | null
          created_at: string
          description: string | null
          disease_id: string | null
          district_id: string | null
          id: string
          is_active: boolean | null
          outbreak_report_id: string | null
          state_id: string | null
          title: string
          type: string
        }
        Insert: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          description?: string | null
          disease_id?: string | null
          district_id?: string | null
          id?: string
          is_active?: boolean | null
          outbreak_report_id?: string | null
          state_id?: string | null
          title: string
          type: string
        }
        Update: {
          acknowledged_at?: string | null
          acknowledged_by?: string | null
          created_at?: string
          description?: string | null
          disease_id?: string | null
          district_id?: string | null
          id?: string
          is_active?: boolean | null
          outbreak_report_id?: string | null
          state_id?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "alerts_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_outbreak_report_id_fkey"
            columns: ["outbreak_report_id"]
            isOneToOne: false
            referencedRelation: "outbreak_reports"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alerts_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      case_details: {
        Row: {
          contact_traced: boolean | null
          contacts_identified: number | null
          created_at: string
          hospitalized: boolean | null
          icu_required: boolean | null
          id: string
          lab_result: string | null
          lab_test_date: string | null
          lab_test_type: string | null
          outbreak_report_id: string
          outcome: string | null
          patient_age: number | null
          patient_gender: string | null
          symptom_onset_date: string | null
          symptoms: string[] | null
        }
        Insert: {
          contact_traced?: boolean | null
          contacts_identified?: number | null
          created_at?: string
          hospitalized?: boolean | null
          icu_required?: boolean | null
          id?: string
          lab_result?: string | null
          lab_test_date?: string | null
          lab_test_type?: string | null
          outbreak_report_id: string
          outcome?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          symptom_onset_date?: string | null
          symptoms?: string[] | null
        }
        Update: {
          contact_traced?: boolean | null
          contacts_identified?: number | null
          created_at?: string
          hospitalized?: boolean | null
          icu_required?: boolean | null
          id?: string
          lab_result?: string | null
          lab_test_date?: string | null
          lab_test_type?: string | null
          outbreak_report_id?: string
          outcome?: string | null
          patient_age?: number | null
          patient_gender?: string | null
          symptom_onset_date?: string | null
          symptoms?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "case_details_outbreak_report_id_fkey"
            columns: ["outbreak_report_id"]
            isOneToOne: false
            referencedRelation: "outbreak_reports"
            referencedColumns: ["id"]
          },
        ]
      }
      diseases: {
        Row: {
          category: string | null
          created_at: string
          icd_code: string | null
          id: string
          incubation_days_max: number | null
          incubation_days_min: number | null
          is_notifiable: boolean | null
          name: string
          symptoms: string[] | null
          transmission_type: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          icd_code?: string | null
          id?: string
          incubation_days_max?: number | null
          incubation_days_min?: number | null
          is_notifiable?: boolean | null
          name: string
          symptoms?: string[] | null
          transmission_type?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          icd_code?: string | null
          id?: string
          incubation_days_max?: number | null
          incubation_days_min?: number | null
          is_notifiable?: boolean | null
          name?: string
          symptoms?: string[] | null
          transmission_type?: string | null
        }
        Relationships: []
      }
      districts: {
        Row: {
          created_at: string
          health_facilities_count: number | null
          id: string
          name: string
          population: number | null
          state_id: string
        }
        Insert: {
          created_at?: string
          health_facilities_count?: number | null
          id?: string
          name: string
          population?: number | null
          state_id: string
        }
        Update: {
          created_at?: string
          health_facilities_count?: number | null
          id?: string
          name?: string
          population?: number | null
          state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "districts_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      nlp_signals: {
        Row: {
          content: string
          created_at: string
          detected_at: string
          disease_keywords: string[] | null
          id: string
          language: string
          location_detected: string | null
          relevance_score: number | null
          sentiment: string | null
          source: string
          source_url: string | null
          state_id: string | null
          translated_content: string | null
          verified: boolean | null
        }
        Insert: {
          content: string
          created_at?: string
          detected_at?: string
          disease_keywords?: string[] | null
          id?: string
          language: string
          location_detected?: string | null
          relevance_score?: number | null
          sentiment?: string | null
          source: string
          source_url?: string | null
          state_id?: string | null
          translated_content?: string | null
          verified?: boolean | null
        }
        Update: {
          content?: string
          created_at?: string
          detected_at?: string
          disease_keywords?: string[] | null
          id?: string
          language?: string
          location_detected?: string | null
          relevance_score?: number | null
          sentiment?: string | null
          source?: string
          source_url?: string | null
          state_id?: string | null
          translated_content?: string | null
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "nlp_signals_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      outbreak_reports: {
        Row: {
          case_count: number
          created_at: string
          death_count: number | null
          disease_id: string
          district_id: string | null
          hospitalized_count: number | null
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          recovered_count: number | null
          report_date: string
          reported_by: string | null
          severity: string | null
          state_id: string
          status: string | null
          updated_at: string
        }
        Insert: {
          case_count?: number
          created_at?: string
          death_count?: number | null
          disease_id: string
          district_id?: string | null
          hospitalized_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          recovered_count?: number | null
          report_date?: string
          reported_by?: string | null
          severity?: string | null
          state_id: string
          status?: string | null
          updated_at?: string
        }
        Update: {
          case_count?: number
          created_at?: string
          death_count?: number | null
          disease_id?: string
          district_id?: string | null
          hospitalized_count?: number | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          recovered_count?: number | null
          report_date?: string
          reported_by?: string | null
          severity?: string | null
          state_id?: string
          status?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "outbreak_reports_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbreak_reports_district_id_fkey"
            columns: ["district_id"]
            isOneToOne: false
            referencedRelation: "districts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "outbreak_reports_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      predictions: {
        Row: {
          accuracy_score: number | null
          confidence_lower: number | null
          confidence_upper: number | null
          created_at: string
          disease_id: string
          id: string
          model_version: string | null
          predicted_cases: number
          prediction_date: string
          state_id: string
        }
        Insert: {
          accuracy_score?: number | null
          confidence_lower?: number | null
          confidence_upper?: number | null
          created_at?: string
          disease_id: string
          id?: string
          model_version?: string | null
          predicted_cases: number
          prediction_date: string
          state_id: string
        }
        Update: {
          accuracy_score?: number | null
          confidence_lower?: number | null
          confidence_upper?: number | null
          created_at?: string
          disease_id?: string
          id?: string
          model_version?: string | null
          predicted_cases?: number
          prediction_date?: string
          state_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "predictions_disease_id_fkey"
            columns: ["disease_id"]
            isOneToOne: false
            referencedRelation: "diseases"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "predictions_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          department: string | null
          designation: string | null
          district: string | null
          full_name: string
          id: string
          phone: string | null
          state_code: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          district?: string | null
          full_name: string
          id?: string
          phone?: string | null
          state_code?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          department?: string | null
          designation?: string | null
          district?: string | null
          full_name?: string
          id?: string
          phone?: string | null
          state_code?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      states: {
        Row: {
          area_sqkm: number | null
          capital: string | null
          code: string
          created_at: string
          health_facilities_count: number | null
          id: string
          name: string
          population: number | null
        }
        Insert: {
          area_sqkm?: number | null
          capital?: string | null
          code: string
          created_at?: string
          health_facilities_count?: number | null
          id?: string
          name: string
          population?: number | null
        }
        Update: {
          area_sqkm?: number | null
          capital?: string | null
          code?: string
          created_at?: string
          health_facilities_count?: number | null
          id?: string
          name?: string
          population?: number | null
        }
        Relationships: []
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
          role?: Database["public"]["Enums"]["app_role"]
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
      weather_data: {
        Row: {
          air_quality_index: number | null
          created_at: string
          humidity_percent: number | null
          id: string
          rainfall_mm: number | null
          record_date: string
          state_id: string
          temperature_avg: number | null
          temperature_max: number | null
          temperature_min: number | null
        }
        Insert: {
          air_quality_index?: number | null
          created_at?: string
          humidity_percent?: number | null
          id?: string
          rainfall_mm?: number | null
          record_date: string
          state_id: string
          temperature_avg?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
        }
        Update: {
          air_quality_index?: number | null
          created_at?: string
          humidity_percent?: number | null
          id?: string
          rainfall_mm?: number | null
          record_date?: string
          state_id?: string
          temperature_avg?: number | null
          temperature_max?: number | null
          temperature_min?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "weather_data_state_id_fkey"
            columns: ["state_id"]
            isOneToOne: false
            referencedRelation: "states"
            referencedColumns: ["id"]
          },
        ]
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
      user_in_state_jurisdiction: {
        Args: { _state_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "officer"
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
      app_role: ["admin", "officer"],
    },
  },
} as const
