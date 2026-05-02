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
import {
  Edit,
  Eye,
  EyeOff,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
} from "lucide-react";
import { useState } from "react";

const trends = [
  {
    id: 1,
    img: "🌸",
    title: "Spring Pastel Revival",
    category: "Seasonal",
    season: "Spring 2026",
    status: "Published",
    date: "2026-03-01",
  },
  {
    id: 2,
    img: "🖤",
    title: "Neo Minimalism",
    category: "Style",
    season: "All Year",
    status: "Published",
    date: "2026-02-15",
  },
  {
    id: 3,
    img: "🌊",
    title: "Coastal Grandmother 2.0",
    category: "Lifestyle",
    season: "Summer 2026",
    status: "Draft",
    date: "2026-03-10",
  },
  {
    id: 4,
    img: "⚡",
    title: "Tech-Wear Evolution",
    category: "Street",
    season: "Fall 2026",
    status: "Draft",
    date: "2026-03-08",
  },
  {
    id: 5,
    img: "✨",
    title: "Quiet Luxury Continues",
    category: "Premium",
    season: "All Year",
    status: "Published",
    date: "2026-01-20",
  },
  {
    id: 6,
    img: "🎨",
    title: "Color Blocking Returns",
    category: "Color",
    season: "Spring 2026",
    status: "Published",
    date: "2026-02-28",
  },
];

export default function AdminTrends() {
  const [search, setSearch] = useState("");
  const filtered = trends.filter(
    (t) => !search || t.title.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <div className="space-y-6 max-w-7xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-foreground font-body">
            Trends & Lookbook
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-1">
            Manage trend articles and lookbook entries
          </p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" /> New Trend
        </Button>
      </div>

      <div className="relative w-64">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search trends..."
          className="pl-9 h-9 text-sm font-body"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body w-12"></TableHead>
              <TableHead className="font-body">Title</TableHead>
              <TableHead className="font-body">Category</TableHead>
              <TableHead className="font-body">Season</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body">Date</TableHead>
              <TableHead className="font-body w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="text-2xl">{t.img}</TableCell>
                <TableCell className="text-sm font-medium font-body">
                  {t.title}
                </TableCell>
                <TableCell className="text-sm font-body text-muted-foreground">
                  {t.category}
                </TableCell>
                <TableCell className="text-sm font-body text-muted-foreground">
                  {t.season}
                </TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell className="text-sm font-body text-muted-foreground">
                  {t.date}
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
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        {t.status === "Published" ? (
                          <>
                            <EyeOff className="h-4 w-4 mr-2" />
                            Unpublish
                          </>
                        ) : (
                          <>
                            <Eye className="h-4 w-4 mr-2" />
                            Publish
                          </>
                        )}
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
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
