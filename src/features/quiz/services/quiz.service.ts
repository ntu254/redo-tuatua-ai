import { supabase } from "@/shared/lib";
import { apiClient } from "@/shared/api";
import { apiConfig } from "@/shared/api/config";

export interface QuizAnswers {
  gender?: string;
  styles: string[];
  occasions: string[];
  budget?: string;
  colors: string[];
}

const BUDGET_RANGES: Record<string, { min: number; max: number }> = {
  low: { min: 0, max: 200000 },
  mid: { min: 200000, max: 500000 },
  high: { min: 500000, max: 1000000 },
  premium: { min: 1000000, max: 99999999 },
};

const computeStyleDna = (styles: string[]): Record<string, number> => {
  const weights: Record<string, number> = {
    minimal: 70, casual: 60, streetwear: 50, office: 65, party: 45, athleisure: 40,
  };
  if (styles.length === 0) return { casual: 100 };
  const perStyle = Math.round(100 / styles.length);
  const dna: Record<string, number> = {};
  styles.forEach((s, i) => {
    dna[s] = i === styles.length - 1 ? 100 - Object.values(dna).reduce((a, b) => a + b, 0) : (weights[s] ?? perStyle);
  });
  return dna;
};

export const quizService = {
  completeQuiz: async (userId: string, answers: QuizAnswers) => {
    if (apiConfig.useMockApi) {
      return apiClient.post<{ success: boolean }>("/api/quiz/complete", { json: answers });
    }
    const budgetRange = answers.budget ? BUDGET_RANGES[answers.budget] : null;
    const { error } = await supabase
      .from("profiles")
      .update({
        style_dna: computeStyleDna(answers.styles),
        favorite_colors: answers.colors,
        preferred_styles: answers.styles,
        preferred_occasions: answers.occasions,
        budget_min: budgetRange?.min ?? null,
        budget_max: budgetRange?.max ?? null,
        quiz_completed: true,
      })
      .eq("id", userId);
    if (error) throw error;
    return { success: true };
  },
};
