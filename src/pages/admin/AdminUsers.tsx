import { useState } from "react";
import { Search, MoreHorizontal, Eye, Ban, Shield } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/admin/StatusBadge";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const users = [
  { id: 1, name: "Minh Anh", email: "minhanh@gmail.com", date: "2025-01-15", plan: "Premium", status: "Active", outfits: 42, wardrobe: 87 },
  { id: 2, name: "Thanh Hà", email: "thanhha@gmail.com", date: "2025-02-03", plan: "Free", status: "Active", outfits: 12, wardrobe: 23 },
  { id: 3, name: "Duc Phong", email: "ducphong@gmail.com", date: "2025-01-28", plan: "Premium", status: "Active", outfits: 56, wardrobe: 112 },
  { id: 4, name: "Linh Chi", email: "linhchi@gmail.com", date: "2024-12-10", plan: "Free", status: "Inactive", outfits: 3, wardrobe: 8 },
  { id: 5, name: "Hoang Nam", email: "hoangnam@gmail.com", date: "2025-03-01", plan: "Premium", status: "Active", outfits: 28, wardrobe: 64 },
  { id: 6, name: "Thi Ngoc", email: "thingoc@gmail.com", date: "2025-02-14", plan: "Free", status: "Active", outfits: 7, wardrobe: 15 },
  { id: 7, name: "Van Khanh", email: "vankhanh@gmail.com", date: "2024-11-20", plan: "Premium", status: "Inactive", outfits: 31, wardrobe: 45 },
  { id: 8, name: "Bao Tran", email: "baotran@gmail.com", date: "2025-01-05", plan: "Free", status: "Active", outfits: 9, wardrobe: 21 },
];

type Filter = "all" | "active" | "inactive" | "free" | "premium";

export default function AdminUsers() {
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");

  const filtered = users.filter((u) => {
    if (filter === "active" && u.status !== "Active") return false;
    if (filter === "inactive" && u.status !== "Inactive") return false;
    if (filter === "free" && u.plan !== "Free") return false;
    if (filter === "premium" && u.plan !== "Premium") return false;
    if (search && !u.name.toLowerCase().includes(search.toLowerCase()) && !u.email.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filters: { label: string; value: Filter }[] = [
    { label: "All", value: "all" }, { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" }, { label: "Free", value: "free" },
    { label: "Premium", value: "premium" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">Users</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">{users.length} total users</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          {filters.map((f) => (
            <Button
              key={f.value}
              variant={filter === f.value ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f.value)}
              className="text-xs"
            >
              {f.label}
            </Button>
          ))}
        </div>
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search users..." className="pl-9 h-9 text-sm font-body" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">User</TableHead>
              <TableHead className="font-body">Signup Date</TableHead>
              <TableHead className="font-body">Plan</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body text-right">Outfits</TableHead>
              <TableHead className="font-body text-right">Wardrobe</TableHead>
              <TableHead className="font-body w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((u) => (
              <TableRow key={u.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">{u.name[0]}</div>
                    <div>
                      <p className="text-sm font-medium font-body">{u.name}</p>
                      <p className="text-xs text-muted-foreground font-body">{u.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-body text-muted-foreground">{u.date}</TableCell>
                <TableCell><StatusBadge status={u.plan} /></TableCell>
                <TableCell><StatusBadge status={u.status} /></TableCell>
                <TableCell className="text-sm font-body text-right">{u.outfits}</TableCell>
                <TableCell className="text-sm font-body text-right">{u.wardrobe}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem><Eye className="h-4 w-4 mr-2" />View Details</DropdownMenuItem>
                      <DropdownMenuItem><Ban className="h-4 w-4 mr-2" />Suspend</DropdownMenuItem>
                      <DropdownMenuItem><Shield className="h-4 w-4 mr-2" />Change Role</DropdownMenuItem>
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
