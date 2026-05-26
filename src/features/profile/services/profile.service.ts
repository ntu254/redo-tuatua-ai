import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";

export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  avatar_url: string | null;
  style_dna: Record<string, number> | null;
  favorite_colors: string[] | null;
  quiz_completed: boolean;
  is_banned: boolean;
  ban_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface ProfileUpdate {
  display_name?: string;
  avatar_url?: string;
  style_dna?: Record<string, number>;
  favorite_colors?: string[];
  quiz_completed?: boolean;
}

export const profileService = {
  getProfile: async (userId: string) => {
    if (apiConfig.useMockApi) {
      return apiClient.get<Profile>("/api/profile");
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();
    if (error) throw error;
    return data as Profile;
  },

  updateProfile: async (userId: string, updates: ProfileUpdate) => {
    if (apiConfig.useMockApi) {
      return apiClient.patch<Profile>("/api/profile", { json: updates });
    }
    const { data, error } = await supabase
      .from("profiles")
      .update(updates)
      .eq("id", userId)
      .select()
      .single();
    if (error) throw error;
    return data as Profile;
  },

  updateStylePreferences: async (userId: string, styleDna: Record<string, number>, favoriteColors: string[]) => {
    if (apiConfig.useMockApi) {
      return apiClient.patch<Profile>("/api/profile/style-preferences", { json: { styleDna, favoriteColors } });
    }
    return profileService.updateProfile(userId, { style_dna: styleDna, favorite_colors: favoriteColors });
  },

  completeQuiz: async (userId: string, styleDna: Record<string, number>) => {
    if (apiConfig.useMockApi) {
      return apiClient.post<Profile>("/api/profile/quiz-complete", { json: { styleDna } });
    }
    return profileService.updateProfile(userId, { style_dna: styleDna, quiz_completed: true });
  },
};
