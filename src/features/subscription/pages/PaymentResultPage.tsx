import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CheckCircle, XCircle, Loader2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentResultPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(searchParams.get("status") || "processing");

  useEffect(() => {
    const s = searchParams.get("status");
    if (s === "success") setStatus("success");
    else if (s === "cancelled") setStatus("cancelled");
    else if (s === "error") setStatus("error");
    else setStatus("processing");
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        {status === "processing" && (
          <>
            <Loader2 className="w-16 h-16 animate-spin text-accent mx-auto mb-6" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Đang xử lý thanh toán...</h1>
            <p className="text-foreground/60">Vui lòng chờ trong giây lát.</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">Thanh toán thành công!</h1>
            <p className="text-foreground/60 mb-8">Cảm ơn bạn đã nâng cấp. Các tính năng Premium đã được kích hoạt.</p>
            <Button onClick={() => navigate("/profile")} variant="accent" className="gap-2">
              Về trang cá nhân <ArrowRight className="w-4 h-4" />
            </Button>
          </>
        )}

        {(status === "cancelled" || status === "error") && (
          <>
            <XCircle className="w-16 h-16 text-amber-500 mx-auto mb-6" />
            <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
              {status === "cancelled" ? "Đã hủy thanh toán" : "Có lỗi xảy ra"}
            </h1>
            <p className="text-foreground/60 mb-8">
              {status === "cancelled" ? "Bạn đã hủy giao dịch. Không có khoản phí nào được tính." : "Không thể hoàn tất thanh toán. Vui lòng thử lại."}
            </p>
            <div className="flex gap-3 justify-center">
              <Button onClick={() => navigate("/pricing")} variant="outline">Thử lại</Button>
              <Button onClick={() => navigate("/profile")} variant="ghost">Về trang cá nhân</Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
