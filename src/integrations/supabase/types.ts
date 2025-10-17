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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      medical_rep_profiles: {
        Row: {
          cnic_number: string
          company_name: string
          contact_number: string
          coverage_area: string
          created_at: string | null
          full_name: string
          id: string
          profile_picture_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          cnic_number: string
          company_name: string
          contact_number: string
          coverage_area: string
          created_at?: string | null
          full_name: string
          id?: string
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          cnic_number?: string
          company_name?: string
          contact_number?: string
          coverage_area?: string
          created_at?: string | null
          full_name?: string
          id?: string
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "medical_rep_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      order_booker_profiles: {
        Row: {
          cnic_number: string
          contact_number: string
          coverage_area: string
          created_at: string | null
          full_name: string
          id: string
          profile_picture_url: string | null
          updated_at: string | null
          user_id: string
          working_for: string
        }
        Insert: {
          cnic_number: string
          contact_number: string
          coverage_area: string
          created_at?: string | null
          full_name: string
          id?: string
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id: string
          working_for: string
        }
        Update: {
          cnic_number?: string
          contact_number?: string
          coverage_area?: string
          created_at?: string | null
          full_name?: string
          id?: string
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id?: string
          working_for?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_booker_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          account_type: Database["public"]["Enums"]["account_type"] | null
          created_at: string | null
          email: string
          id: string
          language: Database["public"]["Enums"]["language_preference"] | null
          onboarding_completed: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          created_at?: string | null
          email: string
          id: string
          language?: Database["public"]["Enums"]["language_preference"] | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          account_type?: Database["public"]["Enums"]["account_type"] | null
          created_at?: string | null
          email?: string
          id?: string
          language?: Database["public"]["Enums"]["language_preference"] | null
          onboarding_completed?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      supplier_profiles: {
        Row: {
          address: string
          company_name: string
          contact_number: string
          created_at: string | null
          id: string
          item_categories: Database["public"]["Enums"]["item_category"][] | null
          license_picture_url: string | null
          owner_name: string
          payment_methods:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          profile_picture_url: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          company_name: string
          contact_number: string
          created_at?: string | null
          id?: string
          item_categories?:
            | Database["public"]["Enums"]["item_category"][]
            | null
          license_picture_url?: string | null
          owner_name: string
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          company_name?: string
          contact_number?: string
          created_at?: string | null
          id?: string
          item_categories?:
            | Database["public"]["Enums"]["item_category"][]
            | null
          license_picture_url?: string | null
          owner_name?: string
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          profile_picture_url?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supplier_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      trader_profiles: {
        Row: {
          address: string
          availability_status:
            | Database["public"]["Enums"]["availability_status"]
            | null
          contact_number: string
          created_at: string | null
          id: string
          item_categories: Database["public"]["Enums"]["item_category"][] | null
          license_picture_url: string | null
          open_hours: string | null
          owner_name: string
          payment_methods:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          profile_picture_url: string | null
          shop_name: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          availability_status?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          contact_number: string
          created_at?: string | null
          id?: string
          item_categories?:
            | Database["public"]["Enums"]["item_category"][]
            | null
          license_picture_url?: string | null
          open_hours?: string | null
          owner_name: string
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          profile_picture_url?: string | null
          shop_name: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          availability_status?:
            | Database["public"]["Enums"]["availability_status"]
            | null
          contact_number?: string
          created_at?: string | null
          id?: string
          item_categories?:
            | Database["public"]["Enums"]["item_category"][]
            | null
          license_picture_url?: string | null
          open_hours?: string | null
          owner_name?: string
          payment_methods?:
            | Database["public"]["Enums"]["payment_method"][]
            | null
          profile_picture_url?: string | null
          shop_name?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trader_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      account_type:
        | "trader"
        | "supplier"
        | "medical_representative"
        | "medical_store_owner"
        | "order_booker"
        | "medical_rep"
      availability_status: "active" | "inactive"
      item_category: "multinational" | "net" | "surgical" | "homeopathic"
      language_preference: "english" | "urdu"
      payment_method: "easypaisa" | "jazzcash" | "bank_account"
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
      account_type: [
        "trader",
        "supplier",
        "medical_representative",
        "medical_store_owner",
        "order_booker",
        "medical_rep",
      ],
      availability_status: ["active", "inactive"],
      item_category: ["multinational", "net", "surgical", "homeopathic"],
      language_preference: ["english", "urdu"],
      payment_method: ["easypaisa", "jazzcash", "bank_account"],
    },
  },
} as const
