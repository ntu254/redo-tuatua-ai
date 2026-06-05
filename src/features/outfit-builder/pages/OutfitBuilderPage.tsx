import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Navbar } from "@/shared/layout";
import { supabase } from "@/shared/lib";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { LoginPromptOverlay } from "@/features/auth/components/LoginPromptOverlay";
import ControlPanel from "../components/ControlPanel";
import TryOnCanvas from "../components/TryOnCanvas";
import AIStylistReport from "../components/AIStylistReport";

const MAX_POLL_RETRIES = 60;
const POLL_INTERVAL_MS = 3000;

interface OutfitItem {
  id: string;
  name: string;
  image_url: string;
  price: number;
  affiliate_url: string;
  brand: string;
  slot: string;
  click_count: number;
}

interface Outfit {
  style: string;
  description: string;
  items: OutfitItem[];
  total_price: number;
  trending: boolean;
}

export default function OutfitBuilderPage() {
  const { session } = useAuth();
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState("");
  const [occasion, setOccasion] = useState("");
  const [style, setStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [error, setError] = useState("");

  const [humanImage, setHumanImage] = useState<string | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [selectedClothId, setSelectedClothId] = useState<string | null>(null);
  const [tryOnTaskId, setTryOnTaskId] = useState<string | null>(null);
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [tryOnStatus, setTryOnStatus] = useState<string>("idle");
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"before" | "after">("before");

  const trafficRef = searchParams.get("ref") || "direct";
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pollCountRef = useRef(0);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const buildOutfit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    if (!session) {
      setShowLoginPrompt(true);
      return;
    }
    if (pollRef.current) clearInterval(pollRef.current);
    setIsLoading(true);
    setError("");
    setOutfit(null);
    setClothImage(null);
    setSelectedClothId(null);
    setTryOnImage(null);
    setTryOnStatus("idle");
    setTryOnError(null);

    try {
      const prompt = [
        text,
        occasion && `occasion: ${occasion}`,
        style && `style: ${style}`,
      ].filter(Boolean).join(", ");

      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;

      const { data, error: fnError } = await supabase.functions.invoke("create-outfit", {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: { text: prompt, ref: trafficRef },
      });
      if (fnError) throw fnError;
      if (data?.error) throw new Error(data.error);
      setOutfit(data.outfit);
    } catch (err) {
      setError((err as Error).message || "Không thể tạo outfit. Vui lòng thử lại.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerate = () => {
    if (input.trim()) {
      buildOutfit(input);
    }
  };

  const startTryOn = async () => {
    if (!humanImage || !clothImage || tryOnStatus === "submitting" || tryOnStatus === "processing") return;
    if (!session) {
      setShowLoginPrompt(true);
      return;
    }

    setTryOnStatus("submitting");
    setTryOnError(null);
    setTryOnImage(null);
    setViewMode("after");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";

      const { data, error } = await supabase.functions.invoke("tryon", {
        body: { action: "create", human_image: humanImage, cloth_image: clothImage },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw new Error(error.message || "Edge function error");
      if (data?.error) throw new Error(data.error);

      const taskId = data?.data?.task_id;
      if (!taskId) throw new Error("Không nhận được task ID từ server.");

      setTryOnTaskId(taskId);
      setTryOnStatus("processing");
      pollCountRef.current = 0;
      pollTryOnStatus(taskId);
    } catch (err) {
      setTryOnStatus("failed");
      setTryOnError((err as Error).message || "Không thể khởi tạo thử đồ ảo.");
    }
  };

  const pollTryOnStatus = (taskId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);

    pollRef.current = setInterval(async () => {
      pollCountRef.current++;

      if (pollCountRef.current > MAX_POLL_RETRIES) {
        if (pollRef.current) clearInterval(pollRef.current);
        setTryOnStatus("failed");
        setTryOnError("Hết thời gian chờ. Vui lòng thử lại.");
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || "";

        const { data, error } = await supabase.functions.invoke("tryon", {
          body: { action: "status", task_id: taskId },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (error || data?.error) return;

        const taskData = data?.data;
        const status = taskData?.task_status;
        if (status === "succeed") {
          if (pollRef.current) clearInterval(pollRef.current);
          const imageUrl = taskData?.task_result?.images?.[0]?.url;
          setTryOnImage(imageUrl || null);
          setTryOnStatus("succeed");
        } else if (status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setTryOnStatus("failed");
          setTryOnError(taskData?.task_status_msg || "Thử đồ ảo thất bại.");
        }
      } catch {
        if (pollCountRef.current > MAX_POLL_RETRIES) {
          if (pollRef.current) clearInterval(pollRef.current);
          setTryOnStatus("failed");
          setTryOnError("Lỗi kết nối. Vui lòng thử lại.");
        }
      }
    }, POLL_INTERVAL_MS);
  };

  const trackClick = async (productId: string) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token;
      if (!token) return;

      await supabase.functions.invoke("track-click", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: { product_id: productId },
      });
    } catch {
      // silent — tracking is best-effort
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {showLoginPrompt && <LoginPromptOverlay />}
      <Navbar />
      <main className="flex flex-1 overflow-hidden pt-16">
        <ControlPanel
          input={input}
          setInput={setInput}
          occasion={occasion}
          setOccasion={setOccasion}
          style={style}
          setStyle={setStyle}
          isLoading={isLoading}
          onGenerate={handleGenerate}
          humanImage={humanImage}
          setHumanImage={setHumanImage}
          clothImage={clothImage}
          setClothImage={setClothImage}
          isTryOnLoading={tryOnStatus === "submitting" || tryOnStatus === "processing"}
          onStartTryOn={startTryOn}
          canTryOn={!!humanImage && !!clothImage}
        />
        <TryOnCanvas
          isLoading={isLoading}
          outfit={outfit}
          error={error || tryOnError || ""}
          onRetry={handleGenerate}
          trackClick={trackClick}
          humanImage={humanImage}
          selectedClothId={selectedClothId}
          setSelectedClothId={setSelectedClothId}
          setSelectedClothImage={setClothImage}
          tryOnImage={tryOnImage}
          tryOnStatus={tryOnStatus}
          viewMode={viewMode}
          setViewMode={setViewMode}
        />
        <AIStylistReport
          occasion={occasion}
          style={style}
          hasOutfit={!!outfit}
          hasPhoto={!!humanImage}
          tryOnImage={tryOnImage}
          tryOnStatus={tryOnStatus}
        />
      </main>
    </div>
  );
}
