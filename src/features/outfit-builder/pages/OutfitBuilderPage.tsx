import { useState } from "react";
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

  const trafficRef = searchParams.get("ref") || "direct";

  const buildOutfit = async (text: string) => {
    if (!text.trim() || isLoading) return;
    setIsLoading(true);
    setError("");
    setOutfit(null);
    try {
      const prompt = [
        text,
        occasion && `occasion: ${occasion}`,
        style && `style: ${style}`,
      ].filter(Boolean).join(", ");

      const { data, error: fnError } = await supabase.functions.invoke("create-outfit", {
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
        />
        <TryOnCanvas
          isLoading={isLoading}
          outfit={outfit}
          error={error}
          onRetry={handleGenerate}
          trackClick={trackClick}
        />
        <AIStylistReport
          occasion={occasion}
          style={style}
          hasOutfit={!!outfit}
        />
      </main>
    </div>
  );
}
