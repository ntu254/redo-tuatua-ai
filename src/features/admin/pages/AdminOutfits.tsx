import { StatusBadge } from "@/features/admin/components";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { Edit, Eye, EyeOff, MoreHorizontal, Search, Star } from "lucide-react";
import { useState } from "react";

const outfits = [
  {
    id: 1,
    preview: "👔👖👞",
    style: "Office Chic",
    products: 3,
    saves: 342,
    ctr: "4.2%",
    score: 4.5,
    status: "Featured",
  },
  {
    id: 2,
    preview: "👕🩳👟",
    style: "Casual Summer",
    products: 3,
    saves: 521,
    ctr: "5.8%",
    score: 4.7,
    status: "Featured",
  },
  {
    id: 3,
    preview: "👗👠👜",
    style: "Date Night",
    products: 3,
    saves: 189,
    ctr: "3.1%",
    score: 4.0,
    status: "Active",
  },
  {
    id: 4,
    preview: "🧥👖🥾",
    style: "Streetwear",
    products: 4,
    saves: 276,
    ctr: "4.5%",
    score: 4.3,
    status: "Active",
  },
  {
    id: 5,
    preview: "👚🩱🩴",
    style: "Beach Day",
    products: 3,
    saves: 98,
    ctr: "2.1%",
    score: 3.5,
    status: "Hidden",
  },
  {
    id: 6,
    preview: "🧥👗👢",
    style: "Winter Elegance",
    products: 4,
    saves: 412,
    ctr: "6.2%",
    score: 4.8,
    status: "Featured",
  },
];

export default function AdminOutfits() {
  const [search, setSearch] = useState("");
  const filtered = outfits.filter(
    (o) => !search || o.style.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground font-body">
            Outfit Recommendations
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Manage AI-generated outfit suggestions
          </p>
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search outfits..."
            className="pl-9 h-9 text-sm font-body"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Preview</TableHead>
              <TableHead className="font-body">Style</TableHead>
              <TableHead className="font-body text-center">Products</TableHead>
              <TableHead className="font-body text-right">Saves</TableHead>
              <TableHead className="font-body text-right">CTR</TableHead>
              <TableHead className="font-body text-center">Score</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="text-2xl">{o.preview}</TableCell>
                <TableCell className="text-sm font-medium font-body">
                  {o.style}
                </TableCell>
                <TableCell className="text-sm font-body text-center">
                  {o.products}
                </TableCell>
                <TableCell className="text-sm font-body text-right">
                  {o.saves}
                </TableCell>
                <TableCell className="text-sm font-body text-right">
                  {o.ctr}
                </TableCell>
                <TableCell className="text-center">
                  <span className="inline-flex items-center gap-1 text-sm font-body">
                    <Star className="h-3.5 w-3.5 text-accent fill-accent" />{" "}
                    {o.score}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={o.status} />
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Star className="h-4 w-4 mr-2" />
                        Feature
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <EyeOff className="h-4 w-4 mr-2" />
                        Hide
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Tags
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Eye className="h-4 w-4 mr-2" />
                        Review AI Quality
                      </DropdownMenuItem>
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
