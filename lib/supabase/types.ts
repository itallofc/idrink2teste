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
      profiles: {
        Row: {
          id: string
          full_name: string | null
          phone: string | null
          avatar_url: string | null
          role: 'customer' | 'merchant' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'merchant' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          full_name?: string | null
          phone?: string | null
          avatar_url?: string | null
          role?: 'customer' | 'merchant' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      stores: {
        Row: {
          id: string
          owner_id: string | null
          slug: string
          name: string
          tagline: string | null
          description: string | null
          logo_url: string | null
          banner_url: string | null
          rating: number
          total_reviews: number
          delivery_fee: number
          min_order_value: number
          delivery_time_min: number
          delivery_time_max: number
          is_open: boolean
          is_active: boolean
          address: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          latitude: number | null
          longitude: number | null
          phone: string | null
          whatsapp: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          owner_id?: string | null
          slug: string
          name: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          rating?: number
          total_reviews?: number
          delivery_fee?: number
          min_order_value?: number
          delivery_time_min?: number
          delivery_time_max?: number
          is_open?: boolean
          is_active?: boolean
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          whatsapp?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          owner_id?: string | null
          slug?: string
          name?: string
          tagline?: string | null
          description?: string | null
          logo_url?: string | null
          banner_url?: string | null
          rating?: number
          total_reviews?: number
          delivery_fee?: number
          min_order_value?: number
          delivery_time_min?: number
          delivery_time_max?: number
          is_open?: boolean
          is_active?: boolean
          address?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          latitude?: number | null
          longitude?: number | null
          phone?: string | null
          whatsapp?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          store_id: string
          name: string
          description: string | null
          image_url: string | null
          sort_order: number
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          name: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          sort_order?: number
          is_active?: boolean
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          store_id: string
          category_id: string | null
          name: string
          description: string | null
          price: number
          original_price: number | null
          image_url: string | null
          is_available: boolean
          is_featured: boolean
          stock_quantity: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          store_id: string
          category_id?: string | null
          name: string
          description?: string | null
          price: number
          original_price?: number | null
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          price?: number
          original_price?: number | null
          image_url?: string | null
          is_available?: boolean
          is_featured?: boolean
          stock_quantity?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string
          store_id: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee: number
          discount: number
          total: number
          payment_method: 'pix' | 'credit_card' | 'debit_card' | 'cash'
          payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
          delivery_address: string
          delivery_city: string
          delivery_state: string
          delivery_zip: string
          delivery_latitude: number | null
          delivery_longitude: number | null
          customer_notes: string | null
          estimated_delivery_at: string | null
          delivered_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          customer_id: string
          store_id: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee: number
          discount?: number
          total: number
          payment_method: 'pix' | 'credit_card' | 'debit_card' | 'cash'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          delivery_address: string
          delivery_city: string
          delivery_state: string
          delivery_zip: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          customer_notes?: string | null
          estimated_delivery_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string
          store_id?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal?: number
          delivery_fee?: number
          discount?: number
          total?: number
          payment_method?: 'pix' | 'credit_card' | 'debit_card' | 'cash'
          payment_status?: 'pending' | 'paid' | 'failed' | 'refunded'
          delivery_address?: string
          delivery_city?: string
          delivery_state?: string
          delivery_zip?: string
          delivery_latitude?: number | null
          delivery_longitude?: number | null
          customer_notes?: string | null
          estimated_delivery_at?: string | null
          delivered_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          unit_price: number
          total_price: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          product_name?: string
          quantity?: number
          unit_price?: number
          total_price?: number
          notes?: string | null
          created_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          user_id: string
          label: string
          street: string
          number: string
          complement: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          latitude: number | null
          longitude: number | null
          is_default: boolean
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label: string
          street: string
          number: string
          complement?: string | null
          neighborhood: string
          city: string
          state: string
          zip_code: string
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string
          street?: string
          number?: string
          complement?: string | null
          neighborhood?: string
          city?: string
          state?: string
          zip_code?: string
          latitude?: number | null
          longitude?: number | null
          is_default?: boolean
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          store_id: string
          user_id: string
          order_id: string | null
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          store_id: string
          user_id: string
          order_id?: string | null
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          store_id?: string
          user_id?: string
          order_id?: string | null
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
  }
}

// Helper types
export type Profile = Database['public']['Tables']['profiles']['Row']
export type Store = Database['public']['Tables']['stores']['Row']
export type Category = Database['public']['Tables']['categories']['Row']
export type Product = Database['public']['Tables']['products']['Row']
export type Order = Database['public']['Tables']['orders']['Row']
export type OrderItem = Database['public']['Tables']['order_items']['Row']
export type Address = Database['public']['Tables']['addresses']['Row']
export type Review = Database['public']['Tables']['reviews']['Row']

// Store with categories and products
export type StoreWithDetails = Store & {
  categories: (Category & {
    products: Product[]
  })[]
}
