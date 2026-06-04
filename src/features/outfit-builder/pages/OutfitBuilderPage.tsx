import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";

import { Navbar } from "@/shared/layout";
import { supabase } from "@/shared/lib";
import ControlPanel from "../components/ControlPanel";
import TryOnCanvas from "../components/TryOnCanvas";
import AIStylistReport from "../components/AIStylistReport";

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
  const [searchParams] = useSearchParams();
  const [input, setInput] = useState("");
  const [occasion, setOccasion] = useState("");
  const [style, setStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [error, setError] = useState("");

  // Try-on states
  const [humanImage, setHumanImage] = useState<string | null>(null);
  const [clothImage, setClothImage] = useState<string | null>(null);
  const [selectedClothId, setSelectedClothId] = useState<string | null>(null);
  const [tryOnTaskId, setTryOnTaskId] = useState<string | null>(null);
  const [tryOnImage, setTryOnImage] = useState<string | null>(null);
  const [tryOnStatus, setTryOnStatus] = useState<string>("idle"); // idle, submitting, processing, succeed, failed
  const [tryOnError, setTryOnError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"before" | "after">("before");

  const trafficRef = searchParams.get("ref") || "direct";
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (pollRef.current) clearInterval(pollRef.current);
    };
  }, []);

  const buildOutfit = async (text: string) => {
    if (!text.trim() || isLoading) return;
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
      console.warn("Edge Function failed, using mock outfit:", err);
      setOutfit({
        style: style || "Minimal Streetwear",
        description: `Phối đồ ${occasion || "casual"} phong cách ${style || "minimalist"} cho bạn.`,
        items: [
          { id: "mock-1", name: "Áo thun oversized trắng", image_url: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80", price: 189000, affiliate_url: "https://shopee.vn", brand: "YODY", slot: "top", click_count: 12 },
          { id: "mock-2", name: "Quần jeans ống rộng", image_url: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80", price: 390000, affiliate_url: "https://lazada.vn", brand: "Routine", slot: "bottom", click_count: 8 },
          { id: "mock-3", name: "Sneakers trắng basic", image_url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=400&q=80", price: 520000, affiliate_url: "https://tiki.vn", brand: "Ananas", slot: "shoes", click_count: 15 },
        ],
        total_price: 1099000,
        trending: true,
      });
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

    setTryOnStatus("submitting");
    setTryOnError(null);
    setTryOnImage(null);
    setViewMode("after");

    try {
      const { data: { session } } = await supabase.auth.getSession();
      const token = session?.access_token || "";

      const { data, error } = await supabase.functions.invoke("tryon", {
        body: { action: "create", humanImage, clothImage },
        headers: { Authorization: `Bearer ${token}` },
      });

      if (error) throw new Error(error.message || "Edge function error");
      if (data?.error) throw new Error(data.error);

      const taskId = data?.taskId;
      if (!taskId) throw new Error("Không nhận được task ID từ server.");

      setTryOnTaskId(taskId);
      setTryOnStatus("processing");
      pollTryOnStatus(taskId);
    } catch (err) {
      setTryOnStatus("failed");
      setTryOnError((err as Error).message || "Không thể khởi tạo thử đồ ảo.");
    }
  };

  const pollTryOnStatus = (taskId: string) => {
    if (pollRef.current) clearInterval(pollRef.current);
    pollRef.current = setInterval(async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.access_token || "";

        const { data, error } = await supabase.functions.invoke("tryon", {
          body: { action: "status", taskId },
          headers: { Authorization: `Bearer ${token}` },
        });

        if (error || data?.error) return;

        const status = data?.status;
        if (status === "succeed") {
          if (pollRef.current) clearInterval(pollRef.current);
          const imageUrl = data?.imageUrl;
          setTryOnImage(imageUrl || null);
          setTryOnStatus("succeed");
        } else if (status === "failed") {
          if (pollRef.current) clearInterval(pollRef.current);
          setTryOnStatus("failed");
          setTryOnError(data?.message || "Thử đồ ảo thất bại.");
        }
      } catch (err) {
        console.warn("Polling error:", err);
      }
    }, 3000);
  };

  const trackClick = async (productId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      await (supabase as any).from("clicks").insert({
        product_id: productId,
        user_id: user?.id || null,
        source: "affiliate",
        traffic_source: trafficRef,
      } as any);
    } catch (err) {
      console.warn("Click tracking failed:", err);
    }
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
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
