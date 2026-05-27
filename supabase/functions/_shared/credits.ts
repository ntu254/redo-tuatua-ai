import { createClient } from "npm:@supabase/supabase-js@2";

export class CreditError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CreditError";
  }
}

export async function withCreditCheck<T>(
  supabase: ReturnType<typeof createClient>,
  userId: string,
  jobType: string,
  modelName: string,
  fn: () => Promise<T>,
): Promise<T> {
  const { data: credits } = await supabase
    .from("user_credits")
    .select("balance")
    .eq("user_id", userId)
    .maybeSingle();

  const balance = credits?.balance ?? 0;

  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan_id")
    .eq("user_id", userId)
    .maybeSingle();

  let limit = 5;
  let planName = "Free";
  if (sub?.plan_id) {
    const { data: plan } = await supabase
      .from("plans")
      .select("name, ai_generations_limit")
      .eq("id", sub.plan_id)
      .single();
    if (plan) {
      planName = plan.name;
      limit = plan.ai_generations_limit;
    }
  }

  if (limit !== 0 && balance <= 0) {
    throw new CreditError(
      `Bạn đã hết credit AI (gói ${planName}). Vui lòng nâng cấp gói tại /pricing để tiếp tục.`,
    );
  }

  const { data: job } = await supabase
    .from("ai_jobs")
    .insert({
      user_id: userId,
      job_type: jobType,
      model_name: modelName,
      status: "processing",
    })
    .select("id")
    .single();

  const startTime = Date.now();

  try {
    const result = await fn();
    const latency = Date.now() - startTime;

    await supabase
      .from("ai_jobs")
      .update({ status: "completed", completed_at: new Date().toISOString() })
      .eq("id", job.id);

    if (limit !== 0) {
      const { data: uc } = await supabase
        .from("user_credits")
        .select("balance, lifetime_spent")
        .eq("user_id", userId)
        .maybeSingle();
      if (uc) {
        await supabase
          .from("user_credits")
          .update({
            balance: (uc.balance ?? 0) - 1,
            lifetime_spent: (uc.lifetime_spent ?? 0) + 1,
          })
          .eq("user_id", userId);
      }
      await supabase.from("credit_transactions").insert({
        user_id: userId,
        amount: -1,
        type: "generation",
        reference_type: "ai_job",
        description: "Sử dụng AI generation",
      });
    }

    await supabase.from("ai_generation_logs").insert({
      user_id: userId,
      model_name: modelName,
      job_type: jobType,
      latency_ms: latency,
      status: "success",
    });

    return result;
  } catch (err) {
    const latency = Date.now() - startTime;
    await supabase
      .from("ai_jobs")
      .update({
        status: "failed",
        error_message: (err as Error).message,
        completed_at: new Date().toISOString(),
      })
      .eq("id", job.id);

    await supabase.from("ai_generation_logs").insert({
      user_id: userId,
      model_name: modelName,
      job_type: jobType,
      latency_ms: latency,
      status: "failed",
      error_message: (err as Error).message,
    });

    if (err instanceof CreditError) throw err;
    throw new Error((err as Error).message);
  }
}
