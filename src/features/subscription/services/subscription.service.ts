import { supabase } from "@/shared/lib";
import type { CheckoutResponse, Plan, SubscriptionInfo } from "../types";

export const subscriptionService = {
  getPlans: async (): Promise<Plan[]> => {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .eq("is_active", true)
      .order("sort_order");
    if (error) throw error;
    return data ?? [];
  },

  getSubscription: async (userId: string): Promise<SubscriptionInfo | null> => {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*, plans(*)")
      .eq("user_id", userId)
      .maybeSingle();
    if (error) throw error;
    return data;
  },

  createCheckout: async (planId: string, billingCycle: "monthly" | "yearly" = "monthly"): Promise<CheckoutResponse> => {
    const { data, error } = await supabase.functions.invoke("create-payment", {
      body: { planId, billingCycle },
    });
    if (error) throw error;
    return data;
  },

  cancelSubscription: async (subscriptionId: string): Promise<void> => {
    const { error } = await supabase
      .from("subscriptions")
      .update({
        status: "cancelled",
        cancelled_at: new Date().toISOString(),
      })
      .eq("id", subscriptionId);
    if (error) throw error;
  },
};
