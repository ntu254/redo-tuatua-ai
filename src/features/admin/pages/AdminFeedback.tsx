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
  AlertCircle,
  CheckCircle,
  Clock,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react";
import { useState } from "react";

const reports = [
  {
    id: 1,
    type: "Incorrect AI Recommendation",
    user: "Minh Anh",
    priority: "High",
    status: "New",
    date: "2026-03-10",
    detail: "Outfit suggested winter coat for summer occasion",
  },
  {
    id: 2,
    type: "Broken Shopping Link",
    user: "Thanh Hà",
    priority: "Medium",
    status: "In Review",
    date: "2026-03-09",
    detail: "Shopee link for white sneakers returns 404",
  },
  {
    id: 3,
    type: "Wrong Wardrobe Detection",
    user: "Duc Phong",
    priority: "High",
    status: "New",
    date: "2026-03-09",
    detail: "AI detected pants as skirt",
  },
  {
    id: 4,
    type: "General Feedback",
    user: "Linh Chi",
    priority: "Low",
    status: "Resolved",
    date: "2026-03-08",
    detail: "Would love more Korean style options",
  },
  {
    id: 5,
    type: "Incorrect AI Recommendation",
    user: "Hoang Nam",
    priority: "Medium",
    status: "In Review",
    date: "2026-03-07",
    detail: "Color recommendations clash with uploaded wardrobe",
  },
  {
    id: 6,
    type: "Wrong Wardrobe Detection",
    user: "Thi Ngoc",
    priority: "High",
    status: "New",
    date: "2026-03-11",
    detail: "Bag detected as shoe",
  },
];

type StatusFilter = "all" | "new" | "in review" | "resolved";

const priorityColors: Record<string, string> = {
  High: "text-destructive",
  Medium: "text-amber-600",
  Low: "text-muted-foreground",
};

export default function AdminFeedback() {
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [search, setSearch] = useState("");

  const filtered = reports.filter((r) => {
    if (filter !== "all" && r.status.toLowerCase() !== filter) return false;
    if (
      search &&
      !r.type.toLowerCase().includes(search.toLowerCase()) &&
      !r.user.toLowerCase().includes(search.toLowerCase())
    )
      return false;
    return true;
  });

  const filters: { label: string; value: StatusFilter }[] = [
    { label: "All", value: "all" },
    { label: "New", value: "new" },
    { label: "In Review", value: "in review" },
    { label: "Resolved", value: "resolved" },
  ];

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">
          Feedback & Reports
        </h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          {reports.length} total reports
        </p>
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
          <Input
            placeholder="Search reports..."
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
              <TableHead className="font-body">Type</TableHead>
              <TableHead className="font-body">User</TableHead>
              <TableHead className="font-body">Priority</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body">Date</TableHead>
              <TableHead className="font-body w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((r) => (
              <TableRow key={r.id}>
                <TableCell>
                  <div>
                    <p className="text-sm font-medium font-body">{r.type}</p>
                    <p className="text-xs text-muted-foreground font-body mt-0.5 truncate max-w-xs">
                      {r.detail}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-sm font-body">{r.user}</TableCell>
                <TableCell>
                  <span
                    className={`text-sm font-semibold font-body ${priorityColors[r.priority]}`}
                  >
                    {r.priority}
                  </span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={r.status} />
                </TableCell>
                <TableCell className="text-sm font-body text-muted-foreground">
                  {r.date}
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
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Clock className="h-4 w-4 mr-2" />
                        Mark In Review
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark Resolved
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <AlertCircle className="h-4 w-4 mr-2" />
                        Escalate
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
