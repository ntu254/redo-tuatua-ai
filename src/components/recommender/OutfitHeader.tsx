import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const filterTabs = [
  { icon: "✨", label: "Tất cả" },
  { icon: "🧥", label: "Casual" },
  { icon: "🔥", label: "Streetwear" },
  { icon: "💼", label: "Office" },
  { icon: "🇰🇷", label: "K-Fashion" },
  { icon: "🌺", label: "Boho" },
  { icon: "◻️", label: "Minimal" },
];

interface OutfitHeaderProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const OutfitHeader = ({ activeFilter, onFilterChange }: OutfitHeaderProps) => {
  return (
    <div className="border-b border-border">
      {/* Title */}
      <div className="px-6 pt-6 pb-4 flex items-start justify-between">
        <div>
          <h2 className="font-heading text-2xl font-semibold text-foreground">
            AI Outfit Suggestions ✨
          </h2>
          <p className="text-sm font-body text-muted-foreground mt-1">
            Personalized recommendations based on your style
          </p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 text-xs rounded-full">
          <RefreshCw className="w-3.5 h-3.5" /> Regenerate
        </Button>
      </div>

      {/* Filter tabs */}
      <div className="px-6 pb-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {filterTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => onFilterChange(tab.label)}
            className={`text-xs font-body px-4 py-2 rounded-full border transition-all whitespace-nowrap hover:scale-[1.02] active:scale-95 ${
              activeFilter === tab.label
                ? "bg-accent text-accent-foreground border-accent shadow-sm"
                : "border-border text-foreground hover:border-accent/50 hover:bg-accent/5"
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default OutfitHeader;
