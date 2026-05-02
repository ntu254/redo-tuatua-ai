import { StatusBadge } from "@/features/admin/components";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
} from "@/shared/ui";
import {
  AlertTriangle,
  Check,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const items = [
  {
    id: 1,
    img: "👕",
    type: "T-Shirt",
    category: "Tops",
    color: "White",
    tags: ["Basic", "Casual"],
    source: "Manual",
  },
  {
    id: 2,
    img: "👖",
    type: "Jeans",
    category: "Bottoms",
    color: "Blue",
    tags: ["Denim", "Casual"],
    source: "AI Scan",
  },
  {
    id: 3,
    img: "👗",
    type: "Dress",
    category: "Dresses",
    color: "Black",
    tags: ["Evening", "Formal"],
    source: "Manual",
  },
  {
    id: 4,
    img: "🧥",
    type: "Blazer",
    category: "Outerwear",
    color: "Navy",
    tags: ["Office", "Formal"],
    source: "AI Scan",
  },
  {
    id: 5,
    img: "👟",
    type: "Sneakers",
    category: "Shoes",
    color: "White",
    tags: ["Casual", "Street"],
    source: "Manual",
  },
  {
    id: 6,
    img: "👜",
    type: "Handbag",
    category: "Accessories",
    color: "Brown",
    tags: ["Leather", "Classic"],
    source: "AI Scan",
  },
  {
    id: 7,
    img: "🧢",
    type: "Cap",
    category: "Accessories",
    color: "Black",
    tags: ["Street", "Casual"],
    source: "Manual",
  },
  {
    id: 8,
    img: "👠",
    type: "Heels",
    category: "Shoes",
    color: "Red",
    tags: ["Formal", "Party"],
    source: "AI Scan",
  },
];

export default function AdminWardrobe() {
  const [search, setSearch] = useState("");
  const filtered = items.filter(
    (i) =>
      !search ||
      i.type.toLowerCase().includes(search.toLowerCase()) ||
      i.category.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground font-body">
            Wardrobe Items
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            {items.length} items uploaded by users
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9 h-9 text-sm font-body"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-card border border-border rounded-lg overflow-hidden group"
          >
            <div className="aspect-square bg-muted flex items-center justify-center text-5xl">
              {item.img}
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold font-body">{item.type}</h3>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Check className="h-4 w-4 mr-2" />
                      Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Tags
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <AlertTriangle className="h-4 w-4 mr-2" />
                      Mark AI Issue
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                <span>{item.category}</span>
                <span>·</span>
                <span>{item.color}</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {item.tags.map((t) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 bg-muted text-xs font-body rounded text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <StatusBadge
                status={item.source === "AI Scan" ? "AI Scan" : "Manual"}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
