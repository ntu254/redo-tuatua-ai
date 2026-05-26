import { StatusBadge } from "@/features/admin/components";
import { adminPlansService } from "@/features/admin/services/admin-plans.service";
import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  Input,
  Label,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CreditCard,
  DollarSign,
  Eye,
  EyeOff,
  Loader2,
  MoreHorizontal,
  Pencil,
  Search,
  TrendingUp,
  Users,
  X,
} from "lucide-react";
import { useState } from "react";

export default function AdminPlansBilling() {
  const [search, setSearch] = useState("");
  const [showNewPlan, setShowNewPlan] = useState(false);
  const [editPlan, setEditPlan] = useState<{ id: string; name: string; price_monthly: number } | null>(null);
  const [viewPlanSubs, setViewPlanSubs] = useState<{ id: string; name: string; users: number } | null>(null);
  const [planForm, setPlanForm] = useState({ name: "", slug: "", price_monthly: 0, ai_generations_limit: 10, wardrobe_limit: 50, saved_outfits_limit: 20 });
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "plans"],
    queryFn: () => adminPlansService.getData(),
  });

  const toggleMutation = useMutation({
    mutationFn: (planId: string) => adminPlansService.togglePlanStatus(planId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "plans"] }),
  });

  const createPlanMutation = useMutation({
    mutationFn: () => adminPlansService.createPlan(planForm),
    onSuccess: () => {
      setShowNewPlan(false);
      setPlanForm({ name: "", slug: "", price_monthly: 0, ai_generations_limit: 10, wardrobe_limit: 50, saved_outfits_limit: 20 });
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
  });

  const updatePlanMutation = useMutation({
    mutationFn: () => adminPlansService.updatePlan(editPlan!.id, { name: planForm.name, price_monthly: planForm.price_monthly }),
    onSuccess: () => {
      setEditPlan(null);
      queryClient.invalidateQueries({ queryKey: ["admin", "plans"] });
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl">
        <div><h1 className="text-2xl font-semibold text-foreground font-body">Plans & Billing</h1><p className="text-sm text-muted-foreground font-body mt-1 animate-pulse">Loading...</p></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="bg-card border border-border rounded-lg p-4 animate-pulse"><div className="h-3 w-24 bg-muted rounded mb-2" /><div className="h-6 w-16 bg-muted rounded" /></div>)}
        </div>
      </div>
    );
  }

  if (!data) return null;

  const filtered = data.transactions.filter(
    (t) => !search || t.user.toLowerCase().includes(search.toLowerCase()) || t.plan.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">Plans & Billing</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Manage subscription plans, pricing, and payment transactions
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-teal mb-1">
            <DollarSign className="h-4 w-4" />
            <span className="text-xs font-medium font-body">Monthly Revenue</span>
          </div>
          <p className="text-2xl font-semibold font-body">{data.stats.monthlyRevenue}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-accent mb-1">
            <Users className="h-4 w-4" />
            <span className="text-xs font-medium font-body">Paying Users</span>
          </div>
          <p className="text-2xl font-semibold font-body">{data.stats.payingUsers.toLocaleString()}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-teal mb-1">
            <TrendingUp className="h-4 w-4" />
            <span className="text-xs font-medium font-body">Avg. Revenue/User</span>
          </div>
          <p className="text-2xl font-semibold font-body">{data.stats.avgRevenuePerUser}</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4">
          <div className="flex items-center gap-2 text-amber-600 mb-1">
            <CreditCard className="h-4 w-4" />
            <span className="text-xs font-medium font-body">Conversion Rate</span>
          </div>
          <p className="text-2xl font-semibold font-body">{data.stats.conversionRate}</p>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-semibold font-body">Subscription Plans</h3>
          <Button size="sm" className="gap-1.5 text-xs" onClick={() => {
            setPlanForm({ name: "", slug: "", price_monthly: 0, ai_generations_limit: 10, wardrobe_limit: 50, saved_outfits_limit: 20 });
            setShowNewPlan(true);
          }}>
            <DollarSign className="h-3.5 w-3.5" /> New Plan
          </Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">Plan</TableHead>
              <TableHead className="font-body text-right">Price</TableHead>
              <TableHead className="font-body text-right">Users</TableHead>
              <TableHead className="font-body text-right">Revenue</TableHead>
              <TableHead className="font-body text-right">AI Credits</TableHead>
              <TableHead className="font-body">Status</TableHead>
              <TableHead className="font-body w-10"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.plans.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="text-sm font-medium font-body">{p.name}</TableCell>
                <TableCell className="text-sm font-body text-right">{p.price}</TableCell>
                <TableCell className="text-sm font-body text-right">{p.users.toLocaleString()}</TableCell>
                <TableCell className="text-sm font-body text-right">{p.revenue}</TableCell>
                <TableCell className="text-sm font-body text-right">{p.credits === -1 ? "∞" : p.credits}</TableCell>
                <TableCell><StatusBadge status={p.status} /></TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {
                        const price = Number(p.price.replace(/[^0-9.]/g, ""));
                        setPlanForm({ name: p.name, slug: p.name.toLowerCase().replace(/\s+/g, "-"), price_monthly: price || 0, ai_generations_limit: p.credits, wardrobe_limit: 50, saved_outfits_limit: 20 });
                        setEditPlan({ id: p.id, name: p.name, price_monthly: price || 0 });
                      }}>
                        <Pencil className="h-4 w-4 mr-2" /> Edit Plan
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => toggleMutation.mutate(p.id)}>
                        {p.status === "Active" ? <><EyeOff className="h-4 w-4 mr-2" /> Deactivate</> : <><Eye className="h-4 w-4 mr-2" /> Activate</>}
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setViewPlanSubs({ id: p.id, name: p.name, users: p.users })}>
                        <Users className="h-4 w-4 mr-2" /> View Subscribers
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-sm font-semibold font-body">Recent Transactions</h3>
          <div className="relative w-56">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-9 h-8 text-sm font-body"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-body">User</TableHead>
              <TableHead className="font-body">Plan</TableHead>
              <TableHead className="font-body text-right">Amount</TableHead>
              <TableHead className="font-body">Payment Method</TableHead>
              <TableHead className="font-body">Date</TableHead>
              <TableHead className="font-body">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-sm text-muted-foreground font-body">No transactions found</TableCell>
              </TableRow>
            ) : (
              filtered.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="text-sm font-medium font-body">{t.user}</TableCell>
                  <TableCell className="text-sm font-body">{t.plan}</TableCell>
                  <TableCell className="text-sm font-body text-right font-semibold">{t.amount}</TableCell>
                  <TableCell className="text-sm font-body text-muted-foreground">{t.method}</TableCell>
                  <TableCell className="text-sm font-body text-muted-foreground">{t.date}</TableCell>
                  <TableCell>
                    {t.status === "Completed" ? (
                      <StatusBadge status="Active" />
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                        Failed
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>

      <Dialog open={showNewPlan} onOpenChange={setShowNewPlan}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Plan</DialogTitle>
            <DialogDescription className="srOnly">Create a new subscription plan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-foreground">Name</Label>
              <Input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })} placeholder="e.g. Pro" className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-foreground">Slug</Label>
              <Input value={planForm.slug} onChange={(e) => setPlanForm({ ...planForm, slug: e.target.value })} className="h-9 text-muted-foreground" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs font-body text-foreground">Price (VND/mo)</Label>
                <Input value={planForm.price_monthly} onChange={(e) => setPlanForm({ ...planForm, price_monthly: Number(e.target.value) })} type="number" className="h-9" />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs font-body text-foreground">AI Credits/mo</Label>
                <Input value={planForm.ai_generations_limit} onChange={(e) => setPlanForm({ ...planForm, ai_generations_limit: Number(e.target.value) })} type="number" className="h-9" />
              </div>
            </div>
            <Button className="w-full" onClick={() => createPlanMutation.mutate()} disabled={createPlanMutation.isPending || !planForm.name}>
              {createPlanMutation.isPending ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              Create Plan
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!editPlan} onOpenChange={(v) => { if (!v) setEditPlan(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Plan: {editPlan?.name}</DialogTitle>
            <DialogDescription className="srOnly">Edit subscription plan</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-foreground">Name</Label>
              <Input value={planForm.name} onChange={(e) => setPlanForm({ ...planForm, name: e.target.value })} className="h-9" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-body text-foreground">Price (VND/mo)</Label>
              <Input value={planForm.price_monthly} onChange={(e) => setPlanForm({ ...planForm, price_monthly: Number(e.target.value) })} type="number" className="h-9" />
            </div>
            <Button className="w-full" onClick={() => updatePlanMutation.mutate()} disabled={updatePlanMutation.isPending}>
              Save Changes
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!viewPlanSubs} onOpenChange={(v) => { if (!v) setViewPlanSubs(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Subscribers: {viewPlanSubs?.name}</DialogTitle>
            <DialogDescription className="srOnly">View plan subscribers</DialogDescription>
          </DialogHeader>
          <div className="py-2">
            <div className="flex items-center justify-between p-3 bg-muted/40 border border-border rounded-lg mb-4">
              <span className="text-sm font-body text-muted-foreground">Total Subscribers</span>
              <span className="text-lg font-semibold font-body">{viewPlanSubs?.users ?? 0}</span>
            </div>
            <div className="space-y-2">
              {(viewPlanSubs?.users ?? 0) > 0 ? (
                Array.from({ length: Math.min(viewPlanSubs?.users ?? 0, 8) }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-border rounded-lg text-sm">
                    <div className="flex items-center gap-3">
                      <div className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold">
                        {String.fromCharCode(65 + i)}
                      </div>
                      <div>
                        <p className="font-medium font-body">user_{i + 1}@email.com</p>
                        <p className="text-xs text-muted-foreground font-body">Subscribed May {10 + i}, 2026</p>
                      </div>
                    </div>
                    <span className="text-xs text-teal font-medium font-body">Active</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground font-body text-center py-4">No active subscribers on this plan</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
