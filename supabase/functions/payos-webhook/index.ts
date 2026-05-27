import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const webhookBody = await req.json();
    const payosChecksumKey = Deno.env.get("PAYOS_CHECKSUM_KEY");
    if (!payosChecksumKey) throw new Error("PayOS not configured");

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { orderCode, code, desc, data } = webhookBody;
    if (code !== "00") {
      console.error("PayOS webhook error:", desc);
      return new Response(JSON.stringify({ error: desc }), { status: 400, headers: corsHeaders });
    }

    const paymentLinkId = data?.paymentLinkId;
    const status = data?.status;
    const amount = data?.amount;

    if (!paymentLinkId) throw new Error("Missing paymentLinkId");

    const { data: payments } = await supabase
      .from("payments")
      .select("id, user_id, status, amount")
      .eq("provider_payment_id", String(paymentLinkId))
      .limit(1);

    const payment = payments?.[0];
    if (!payment) throw new Error("Payment not found");

    if (status === "PAID") {
      const { data: plan } = await supabase
        .from("plans")
        .select("*")
        .order("sort_order")
        .limit(1);

      const defaultPlan = plan?.[0];
      if (!defaultPlan) throw new Error("No plan found");

      await supabase.from("payments").update({
        status: "completed",
        paid_at: new Date().toISOString(),
      }).eq("id", payment.id);

      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(endDate.getMonth() + 1);

      const { data: existingSub } = await supabase
        .from("subscriptions")
        .select("id")
        .eq("user_id", payment.user_id)
        .maybeSingle();

      if (existingSub) {
        await supabase.from("subscriptions").update({
          plan_id: defaultPlan.id,
          status: "active",
          current_period_end: endDate.toISOString(),
          updated_at: now.toISOString(),
        }).eq("id", existingSub.id);
      } else {
        await supabase.from("subscriptions").insert({
          user_id: payment.user_id,
          plan_id: defaultPlan.id,
          status: "active",
          billing_cycle: "monthly",
          current_period_start: now.toISOString(),
          current_period_end: endDate.toISOString(),
        });
      }

      const { data: credits } = await supabase
        .from("user_credits")
        .select("id, balance")
        .eq("user_id", payment.user_id)
        .maybeSingle();

      if (credits) {
        await supabase.from("user_credits").update({
          balance: (credits.balance ?? 0) + (defaultPlan.credits_per_month || 0),
          lifetime_earned: (credits.lifetime_earned ?? 0) + (defaultPlan.credits_per_month || 0),
        }).eq("id", credits.id);
      }

      await supabase.from("credit_transactions").insert({
        user_id: payment.user_id,
        amount: defaultPlan.credits_per_month || 0,
        type: "purchase",
        reference_type: "subscription",
        description: `Subscription credits for ${defaultPlan.name}`,
      });

      await supabase.from("billing_events").insert({
        user_id: payment.user_id,
        event_type: "payment_success",
        data: { amount, provider: "payos", payment_link_id: paymentLinkId },
      });
    } else if (["CANCELLED", "EXPIRED"].includes(status)) {
      await supabase.from("payments").update({
        status: "failed",
      }).eq("id", payment.id);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
