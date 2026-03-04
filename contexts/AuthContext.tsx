"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { createClient } from "@/lib/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

export type UserRole = "user" | "merchant";

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
}

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  tagline: string | null;
  description: string | null;
  logo_url: string | null;
  banner_url: string | null;
  phone: string | null;
  email: string | null;
  street: string | null;
  number: string | null;
  neighborhood: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  is_open: boolean;
  is_active: boolean;
  delivery_fee: number | null;
  min_order_value: number | null;
  delivery_time_min: number | null;
  delivery_time_max: number | null;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: Profile | null;
  store: Store | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isMerchant: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, metadata?: Record<string, unknown>) => Promise<{ error: Error | null; data: { user: User | null } | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  refreshStore: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Error fetching profile:", error);
      return null;
    }
    return data as Profile;
  }, [supabase]);

  const fetchStore = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from("stores")
      .select("*")
      .eq("owner_id", userId)
      .single();

    if (error && error.code !== "PGRST116") {
      console.error("Error fetching store:", error);
      return null;
    }
    return data as Store | null;
  }, [supabase]);

  const refreshProfile = useCallback(async () => {
    if (user) {
      const profileData = await fetchProfile(user.id);
      setProfile(profileData);
    }
  }, [user, fetchProfile]);

  const refreshStore = useCallback(async () => {
    if (user) {
      const storeData = await fetchStore(user.id);
      setStore(storeData);
    }
  }, [user, fetchStore]);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (currentSession?.user) {
          setSession(currentSession);
          setUser(currentSession.user);
          
          const profileData = await fetchProfile(currentSession.user.id);
          setProfile(profileData);
          
          if (profileData?.role === "merchant" || currentSession.user.user_metadata?.role === "merchant") {
            const storeData = await fetchStore(currentSession.user.id);
            setStore(storeData);
          }
        }
      } catch (error) {
        console.error("Error initializing auth:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (newSession?.user) {
        const profileData = await fetchProfile(newSession.user.id);
        setProfile(profileData);
        
        if (profileData?.role === "merchant" || newSession.user.user_metadata?.role === "merchant") {
          const storeData = await fetchStore(newSession.user.id);
          setStore(storeData);
        }
      } else {
        setProfile(null);
        setStore(null);
      }

      if (event === "SIGNED_OUT") {
        localStorage.removeItem("idrink_user_name");
        localStorage.removeItem("idrink_user_role");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase, fetchProfile, fetchStore]);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return { error: error as Error | null };
  };

  const signUp = async (email: string, password: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/auth/callback`,
        data: metadata,
      },
    });
    return { 
      error: error as Error | null, 
      data: data ? { user: data.user } : null 
    };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
    setStore(null);
  };

  const isAuthenticated = !!user || !!localStorage.getItem("idrink_user_name");
  const isMerchant = profile?.role === "merchant" || user?.user_metadata?.role === "merchant";

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        store,
        isLoading,
        isAuthenticated,
        isMerchant,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        refreshStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
