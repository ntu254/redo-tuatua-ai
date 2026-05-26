import { adminNotificationsService } from "@/features/admin/services/admin-notifications.service";
import {
  Button,
  Input,
  Label,
  Separator,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
  Textarea,
} from "@/shared/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Bell,
  Mail,
  Megaphone,
  MessageSquare,
  Save,
  Send,
} from "lucide-react";
import { useEffect, useState } from "react";

export default function AdminNotifications() {
  const [sendTitle, setSendTitle] = useState("");
  const [sendBody, setSendBody] = useState("");
  const [target, setTarget] = useState("all");
  const [emailSettings, setEmailSettings] = useState<{ key: string; enabled: boolean }[]>([]);
  const [pushSettings, setPushSettings] = useState<{ key: string; enabled: boolean }[]>([]);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin", "notifications"],
    queryFn: () => adminNotificationsService.getData(),
  });

  useEffect(() => {
    if (data) {
      setEmailSettings(data.emailSettings.map((s) => ({ key: s.key, enabled: s.enabled })));
      setPushSettings(data.pushSettings.map((s) => ({ key: s.key, enabled: s.enabled })));
    }
  }, [data]);

  const sendMutation = useMutation({
    mutationFn: () => adminNotificationsService.sendBroadcast({ target, title: sendTitle, body: sendBody }),
    onSuccess: () => { setSendTitle(""); setSendBody(""); setTarget("all"); },
  });

  const saveMutation = useMutation({
    mutationFn: () =>
      adminNotificationsService.saveSettings([
        ...emailSettings.map((s) => ({ ...s, label: "", description: "" })),
        ...pushSettings.map((s) => ({ ...s, label: "", description: "" })),
      ]),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "notifications"] }),
  });

  if (isLoading || !data) {
    if (!data && !isLoading) {
      return (
        <div className="space-y-8 max-w-7xl">
          <div><h1 className="text-2xl font-semibold text-foreground font-body">Notifications</h1><p className="text-sm text-muted-foreground font-body mt-1">Failed to load data</p></div>
        </div>
      );
    }
    return (
      <div className="space-y-8 max-w-7xl">
        <div><h1 className="text-2xl font-semibold text-foreground font-body">Notifications</h1><p className="text-sm text-muted-foreground font-body mt-1 animate-pulse">Loading...</p></div>
        <div className="h-64 bg-card border border-border rounded-lg animate-pulse" />
      </div>
    );
  }

  const toggleEmail = (key: string) =>
    setEmailSettings((prev) => prev.map((s) => s.key === key ? { ...s, enabled: !s.enabled } : s));
  const togglePush = (key: string) =>
    setPushSettings((prev) => prev.map((s) => s.key === key ? { ...s, enabled: !s.enabled } : s));

  return (
    <div className="space-y-8 max-w-7xl">
      <div>
        <h1 className="text-2xl font-semibold text-foreground font-body">Notifications</h1>
        <p className="text-sm text-muted-foreground font-body mt-1">Manage notification templates and send broadcasts to users</p>
      </div>

      <Tabs defaultValue="templates" className="w-full">
        <TabsList className="bg-muted">
          <TabsTrigger value="templates" className="font-body text-xs gap-1.5"><Bell className="h-3.5 w-3.5" /> Templates</TabsTrigger>
          <TabsTrigger value="broadcast" className="font-body text-xs gap-1.5"><Megaphone className="h-3.5 w-3.5" /> Send Broadcast</TabsTrigger>
          <TabsTrigger value="settings" className="font-body text-xs gap-1.5"><Mail className="h-3.5 w-3.5" /> Channel Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="bg-card border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-body">Template</TableHead>
                  <TableHead className="font-body">Channel</TableHead>
                  <TableHead className="font-body">Trigger</TableHead>
                  <TableHead className="font-body">Status</TableHead>
                  <TableHead className="font-body w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data?.templates.map((t) => (
                  <TableRow key={t.id}>
                    <TableCell className="text-sm font-medium font-body">{t.name}</TableCell>
                    <TableCell className="text-sm font-body text-muted-foreground">{t.channel}</TableCell>
                    <TableCell className="text-sm font-body text-muted-foreground font-mono">{t.trigger}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium font-body ${
                        t.status === "Active" ? "bg-teal-light text-teal" :
                        t.status === "Draft" ? "bg-muted text-muted-foreground" :
                        "bg-red-50 text-destructive"
                      }`}>
                        {t.status}
                      </span>
                    </TableCell>
                    <TableCell><Button variant="outline" size="sm" className="text-xs h-7">Edit</Button></TableCell>
                  </TableRow>
                )) ?? (
                  <TableRow><TableCell colSpan={5} className="text-center py-12 text-sm text-muted-foreground font-body">No templates</TableCell></TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="broadcast" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl space-y-5">
            <div>
              <h3 className="text-sm font-semibold font-body mb-4">Compose Broadcast</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="font-body text-sm">Target Audience</Label>
                  <div className="flex gap-2">
                    {["all", "premium", "free", "active"].map((t) => (
                      <Button key={t} variant={target === t ? "default" : "outline"} size="sm" className="text-xs capitalize" onClick={() => setTarget(t)}>
                        {t === "all" ? "All Users" : t}
                      </Button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Title</Label>
                  <Input value={sendTitle} onChange={(e) => setSendTitle(e.target.value)} placeholder="Notification title..." className="font-body text-sm" />
                </div>
                <div className="space-y-2">
                  <Label className="font-body text-sm">Message</Label>
                  <Textarea value={sendBody} onChange={(e) => setSendBody(e.target.value)} placeholder="Write your notification message..." className="font-body text-sm min-h-[100px]" />
                </div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground font-body">
                  <MessageSquare className="h-3.5 w-3.5" />
                  Will be sent as push notification + email digest
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <Button variant="outline" size="sm" className="text-xs">Preview</Button>
                  <Button size="sm" className="gap-1.5 text-xs" onClick={() => sendMutation.mutate()} disabled={!sendTitle || !sendBody}>
                    <Send className="h-3.5 w-3.5" /> Send Broadcast
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <div className="bg-card border border-border rounded-lg p-6 max-w-2xl space-y-6">
            <div>
              <h3 className="text-sm font-semibold font-body mb-4">Email Settings</h3>
              <div className="space-y-4">
                {data?.emailSettings.map((s) => {
                  const local = emailSettings.find((e) => e.key === s.key);
                  return (
                    <div key={s.key} className="flex items-center justify-between">
                      <div>
                        <Label className="font-body text-sm">{s.label}</Label>
                        <p className="text-xs text-muted-foreground font-body">{s.description}</p>
                      </div>
                      <Switch checked={local?.enabled ?? s.enabled} onCheckedChange={() => toggleEmail(s.key)} />
                    </div>
                  );
                })}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-sm font-semibold font-body mb-4">Push Notification Settings</h3>
              <div className="space-y-4">
                {data?.pushSettings.map((s) => {
                  const local = pushSettings.find((e) => e.key === s.key);
                  return (
                    <div key={s.key} className="flex items-center justify-between">
                      <div>
                        <Label className="font-body text-sm">{s.label}</Label>
                        <p className="text-xs text-muted-foreground font-body">{s.description}</p>
                      </div>
                      <Switch checked={local?.enabled ?? s.enabled} onCheckedChange={() => togglePush(s.key)} />
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="gap-2 text-xs" onClick={() => saveMutation.mutate()}>
                <Save className="h-3.5 w-3.5" /> Save Settings
              </Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
