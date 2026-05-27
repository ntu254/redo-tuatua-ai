import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Crown, Check, Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { subscriptionService } from "../services/subscription.service";

const FEATURES: Record<string, { label: string; included: (plan: any) => boolean }[]> = {
  common: [
    { label: "Tạo outfit AI", included: (p) => p.ai_generations_limit === 0 || p.ai_generations_limit > 0 },
    { label: "Phân tích tủ đồ", included: (p) => p.has_ai_analysis },
    { label: "Kho đồ không giới hạn", included: (p) => p.wardrobe_limit === 0 || p.wardrobe_limit > 20 },
    { label: "Xu hướng thời trang", included: (p) => p.has_trend_insights },
    { label: "Liên kết mua sắm", included: (p) => p.has_affiliate_access },
    { label: "Hỗ trợ ưu tiên", included: (p) => p.has_priority_support },
  ],
};

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: plans = [], isLoading } = useQuery({
    queryKey: ["plans"],
    queryFn: subscriptionService.getPlans,
  });

  const handleSelect = async (planId: string) => {
    setLoadingId(planId);
    try {
      const result = await subscriptionService.createCheckout(planId, billingCycle);
      if (result.checkoutUrl) {
        window.location.href = result.checkoutUrl;
      }
    } catch {
      navigate("/payment/result?status=error");
    } finally {
      setLoadingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-accent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-4">
      <div className="max-w-6xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-foreground/60 hover:text-foreground mb-8">
          <ArrowLeft className="w-4 h-4" /> Quay lại
        </button>

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-accent/10 text-accent px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Crown className="w-4 h-4" /> Nâng cấp Premium
          </div>
          <h1 className="text-4xl font-heading font-bold text-foreground mb-3">Chọn gói phù hợp với bạn</h1>
          <p className="text-foreground/60 max-w-xl mx-auto">Mở khóa toàn bộ tính năng AI styling, phân tích nâng cao và trải nghiệm thời trang cá nhân hóa.</p>
        </div>

        <div className="flex justify-center gap-2 mb-10">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${billingCycle === "monthly" ? "bg-accent text-white" : "bg-secondary text-foreground/60 hover:text-foreground"}`}
          >
            Theo tháng
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${billingCycle === "yearly" ? "bg-accent text-white" : "bg-secondary text-foreground/60 hover:text-foreground"}`}
          >
            Theo năm
            <span className="ml-1.5 text-[10px] bg-green-500/20 text-green-600 px-1.5 py-0.5 rounded">Tiết kiệm 17%</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {plans.map((plan) => {
            const price = billingCycle === "yearly" ? plan.price_yearly : plan.price_monthly;
            const isFree = price === 0;

            return (
              <Card key={plan.id} className={`p-6 flex flex-col ${plan.sort_order === 2 ? "border-accent ring-1 ring-accent" : ""}`}>
                {plan.sort_order === 2 && (
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-accent bg-accent/10 px-3 py-1 rounded-full inline-block w-fit mb-3">Phổ biến nhất</div>
                )}
                <h3 className="text-lg font-heading font-bold text-foreground mb-1">{plan.name}</h3>
                <p className="text-xs text-foreground/50 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-3xl font-heading font-bold text-foreground">
                    {isFree ? "Miễn phí" : `${price.toLocaleString("vi-VN")}₫`}
                  </span>
                  {!isFree && <span className="text-xs text-foreground/50 ml-1">/{billingCycle === "yearly" ? "năm" : "tháng"}</span>}
                </div>
                <Button
                  onClick={() => handleSelect(plan.id)}
                  disabled={loadingId !== null || isFree}
                  variant={plan.sort_order === 2 ? "accent" : "outline"}
                  className="w-full mb-6"
                >
                  {loadingId === plan.id ? <Loader2 className="w-4 h-4 animate-spin" /> : isFree ? "Miễn phí" : "Đăng ký ngay"}
                </Button>
                <div className="space-y-3 flex-1">
                  {FEATURES.common.map((f) => {
                    const included = f.included(plan);
                    return (
                      <div key={f.label} className={`flex items-start gap-2 text-sm ${included ? "text-foreground" : "text-foreground/30"}`}>
                        <Check className={`w-4 h-4 mt-0.5 ${included ? "text-accent" : "text-foreground/20"}`} />
                        <span>{f.label}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-start gap-2 text-sm text-foreground">
                    <Check className="w-4 h-4 mt-0.5 text-accent" />
                    <span>AI Credits: {plan.ai_generations_limit === 0 ? "Không giới hạn" : `${plan.credits_per_month}/tháng`}</span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
