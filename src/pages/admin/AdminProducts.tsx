import { useState } from "react";
import { Search, MoreHorizontal, Star, EyeOff, Link2, AlertTriangle } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { cn } from "@/lib/utils";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const platformColors: Record<string, string> = {
  Shopee: "bg-[#EE4D2D]", Lazada: "bg-[#0F146D]", Tiki: "bg-[#1A94FF]",
  Zalora: "bg-foreground", "TikTok Shop": "bg-[#FF0050]",
};

const products = [
  { id: 1, title: "Classic White Tee", platform: "Shopee", category: "Tops", affiliate: "Active", link: "Healthy", featured: true },
  { id: 2, title: "Wide Leg Jeans", platform: "Lazada", category: "Bottoms", affiliate: "Active", link: "Healthy", featured: false },
  { id: 3, title: "Silk Midi Skirt", platform: "Zalora", category: "Bottoms", affiliate: "Active", link: "Broken", featured: false },
  { id: 4, title: "Canvas Tote Bag", platform: "Tiki", category: "Accessories", affiliate: "Inactive", link: "Healthy", featured: false },
  { id: 5, title: "Chunky Sneakers", platform: "TikTok Shop", category: "Shoes", affiliate: "Active", link: "Healthy", featured: true },
  { id: 6, title: "Oversized Blazer", platform: "Shopee", category: "Outerwear", affiliate: "Active", link: "Healthy", featured: false },
  { id: 7, title: "Sequin Party Dress", platform: "Lazada", category: "Dresses", affiliate: "Active", link: "Broken", featured: false },
  { id: 8, title: "Leather Belt", platform: "Tiki", category: "Accessories", affiliate: "Inactive", link: "Healthy", featured: false },
];

type PlatformFilter = "all" | "Shopee" | "Lazada" | "Tiki" | "Zalora" | "TikTok Shop";

export default function AdminProducts() {
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState<PlatformFilter>("all");

  const filtered = products.filter((p) => {
    if (platform !== "all" && p.platform !== platform) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const platforms: PlatformFilter[] = ["all", "Shopee", "Lazada", "Tiki", "Zalora", "TikTok Shop"];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">Products & Platforms</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Manage product feeds and affiliate links</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-wrap">
          {platforms.map((p) => (
            <Button key={p} variant={platform === p ? "default" : "outline"} size="sm" onClick={() => setPlatform(p)} className="text-xs capitalize">
              {p === "all" ? "All Platforms" : p}
            </Button>
          ))}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." className="pl-9 h-9 text-sm font-body" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Product</TableHead>
              <TableHead className="font-body">Platform</TableHead>
              <TableHead className="font-body">Category</TableHead>
              <TableHead className="font-body">Affiliate</TableHead>
              <TableHead className="font-body">Link Health</TableHead>
              <TableHead className="font-body w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium font-body">{p.title}</span>
                    {p.featured && <Star className="h-3.5 w-3.5 text-accent fill-accent" />}
                  </div>
                </TableCell>
                <TableCell>
                  <span className={cn("inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white", platformColors[p.platform])}>
                    {p.platform}
                  </span>
                </TableCell>
                <TableCell className="text-sm font-body text-muted-foreground">{p.category}</TableCell>
                <TableCell><StatusBadge status={p.affiliate} /></TableCell>
                <TableCell><StatusBadge status={p.link} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Link2 className="h-4 w-4 mr-2" />Update Link</DropdownMenuItem>
                      <DropdownMenuItem><EyeOff className="h-4 w-4 mr-2" />Hide Product</DropdownMenuItem>
                      <DropdownMenuItem><Star className="h-4 w-4 mr-2" />Mark Featured</DropdownMenuItem>
                      <DropdownMenuItem><AlertTriangle className="h-4 w-4 mr-2" />Fix Affiliate Link</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
