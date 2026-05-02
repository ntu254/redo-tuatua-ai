import {
  Button,
  Input,
  Label,
  Separator,
  Switch,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/ui";
import { Save } from "lucide-react";

export default function AdminSettings() {
  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">
          Settings
        </h1>
        <p className="text-sm text-muted-foreground font-body mt-1">
          Manage platform configuration
        </p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="general" className="font-body text-xs">
            General
          </TabsTrigger>
          <TabsTrigger value="categories" className="font-body text-xs">
            Categories
          </TabsTrigger>
          <TabsTrigger value="notifications" className="font-body text-xs">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="api" className="font-body text-xs">
            API & Integrations
          </TabsTrigger>
          <TabsTrigger value="permissions" className="font-body text-xs">
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold font-body mb-4">
                Onboarding Options
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-body text-sm">
                      Enable Style Quiz
                    </Label>
                    <p className="text-xs text-muted-foreground font-body">
                      Show style quiz for new users
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-body text-sm">
                      Enable Wardrobe Scan
                    </Label>
                    <p className="text-xs text-muted-foreground font-body">
                      Allow AI wardrobe scanning on signup
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-body text-sm">
                      Skip Onboarding Option
                    </Label>
                    <p className="text-xs text-muted-foreground font-body">
                      Let users skip onboarding
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold font-body mb-4">Platform</h3>
              <div className="grid gap-4 max-w-md">
                <div className="space-y-2">
                  <Label className="font-body text-sm">Platform Name</Label>
                  <Input defaultValue="Redo" className="font-body text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Support Email</Label>
                  <Input
                    defaultValue="support@Redo.com"
                    className="font-body text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="categories" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-6">
            <div>
              <h3 className="text-sm font-semibold font-body mb-4">
                Style Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Casual",
                  "Streetwear",
                  "Office",
                  "Date Night",
                  "Athleisure",
                  "Party",
                  "Minimal",
                  "Bohemian",
                ].map((s) => (
                  <span
                    key={s}
                    className="px-3 py-1.5 bg-muted text-sm font-body rounded-md text-foreground"
                  >
                    {s}
                  </span>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold font-body mb-4">
                Occasion Categories
              </h3>
              <div className="flex flex-wrap gap-2">
                {[
                  "Work",
                  "Weekend",
                  "Date",
                  "Party",
                  "Vacation",
                  "Formal Event",
                  "Gym",
                  "School",
                ].map((o) => (
                  <span
                    key={o}
                    className="px-3 py-1.5 bg-muted text-sm font-body rounded-md text-foreground"
                  >
                    {o}
                  </span>
                ))}
              </div>
            </div>
            <Separator />
            <div>
              <h3 className="text-sm font-semibold font-body mb-4">
                Color Palette Sets
              </h3>
              <div className="flex gap-3">
                {[
                  "#E8927C",
                  "#2EC4B6",
                  "#1D1D1D",
                  "#F4F0EC",
                  "#6C63FF",
                  "#FFD166",
                  "#EF476F",
                  "#118AB2",
                ].map((c) => (
                  <div
                    key={c}
                    className="h-8 w-8 rounded-md border border-border"
                    style={{ background: c }}
                    title={c}
                  />
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold font-body mb-2">
              Notification Templates
            </h3>
            {[
              "Welcome Email",
              "Weekly Style Report",
              "New Trend Alert",
              "Outfit Saved Confirmation",
              "Account Suspension Notice",
            ].map((t) => (
              <div
                key={t}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium font-body">{t}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    Last edited 3 days ago
                  </p>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  Edit Template
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="api" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold font-body mb-2">
              API Integrations
            </h3>
            {[
              { name: "Shopee Affiliate API", status: "Connected" },
              { name: "Lazada Open Platform", status: "Connected" },
              { name: "TikTok Shop API", status: "Connected" },
              { name: "Tiki Affiliate", status: "Disconnected" },
              { name: "Zalora Affiliate", status: "Connected" },
            ].map((api) => (
              <div
                key={api.name}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`h-2 w-2 rounded-full ${api.status === "Connected" ? "bg-teal" : "bg-muted-foreground"}`}
                  />
                  <div>
                    <p className="text-sm font-medium font-body">{api.name}</p>
                    <p className="text-xs text-muted-foreground font-body">
                      {api.status}
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">
                  {api.status === "Connected" ? "Configure" : "Connect"}
                </Button>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="permissions" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 space-y-4">
            <h3 className="text-sm font-semibold font-body mb-2">
              Admin Permissions
            </h3>
            {[
              {
                role: "Super Admin",
                users: 1,
                access: "Full access to all features",
              },
              {
                role: "Content Manager",
                users: 2,
                access: "Trends, Lookbook, Products",
              },
              {
                role: "Support Agent",
                users: 3,
                access: "Feedback, Reports, Users (read-only)",
              },
              {
                role: "AI Engineer",
                users: 1,
                access: "AI Analytics, Settings",
              },
            ].map((r) => (
              <div
                key={r.role}
                className="flex items-center justify-between py-3 border-b border-border last:border-0"
              >
                <div>
                  <p className="text-sm font-medium font-body">{r.role}</p>
                  <p className="text-xs text-muted-foreground font-body">
                    {r.access}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground font-body">
                    {r.users} user{r.users > 1 ? "s" : ""}
                  </span>
                  <Button variant="outline" size="sm" className="text-xs">
                    Edit
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
