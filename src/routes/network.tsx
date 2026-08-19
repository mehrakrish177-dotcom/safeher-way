import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mail, Phone, Star, Trash2, UserPlus, TimerReset } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSafeHer } from "@/lib/safeher-store";

export const Route = createFileRoute("/network")({
  head: () => ({
    meta: [
      { title: "Safety Network & Check-Ins — SafeHer Journey" },
      {
        name: "description",
        content:
          "Manage emergency contacts and set an automated check-in timer that alerts your people if you miss it.",
      },
      { property: "og:title", content: "Safety Network & Check-Ins — SafeHer Journey" },
      {
        property: "og:description",
        content: "Emergency contacts plus automated check-in timers that escalate when you don't respond.",
      },
    ],
  }),
  component: Network,
});

const durations = ["5", "15", "30", "60"];

function Network() {
  const { contacts, addContact, removeContact, makePrimary, logEvent } = useSafeHer();
  const [form, setForm] = useState({ name: "", phone: "", email: "", relation: "Friend" });
  const [minutes, setMinutes] = useState("30");
  const [remaining, setRemaining] = useState<number | null>(null);
  const total = Number(minutes) * 60;

  useEffect(() => {
    if (remaining === null) return;
    if (remaining <= 0) {
      setRemaining(null);
      logEvent("checkin", "Missed check-in — simulated alert sent to all contacts");
      toast.error("Check-in missed", { description: "Simulated alert sent to your safety network." });
      return;
    }
    const t = setTimeout(() => setRemaining((r) => (r ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, logEvent]);

  const clock =
    remaining === null
      ? "--:--"
      : `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Safety network</h1>
        <p className="text-sm text-muted-foreground">Your people, and the timer that reaches them.</p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center gap-2">
            <TimerReset className="h-4 w-4 text-primary" />
            <p className="font-semibold">Automated check-in</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <Select value={minutes} onValueChange={setMinutes} disabled={remaining !== null}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {durations.map((d) => (
                  <SelectItem key={d} value={d}>
                    Check in within {d} minutes
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => {
                if (remaining === null) {
                  setRemaining(total);
                  toast.success(`Timer started — check in within ${minutes} min`);
                } else {
                  setRemaining(null);
                  logEvent("checkin", "Checked in safely");
                  toast.success("Checked in", { description: "Your contacts have been notified you're safe." });
                }
              }}
            >
              {remaining === null ? "Start timer" : "I'm safe"}
            </Button>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Time until alert</span>
              <span className="font-semibold tabular-nums">{clock}</span>
            </div>
            <Progress value={remaining === null ? 0 : (remaining / total) * 100} />
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        {contacts.map((c) => (
          <Card key={c.id}>
            <CardContent className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 p-4">
              <div className="min-w-0">
                <div className="flex min-w-0 items-center gap-2">
                  <p className="truncate font-semibold">{c.name}</p>
                  {c.primary && <Badge className="shrink-0">Primary</Badge>}
                </div>
                <p className="mt-1 flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  <Phone className="h-3 w-3 shrink-0" />
                  {c.phone}
                </p>
                <p className="flex items-center gap-1.5 truncate text-xs text-muted-foreground">
                  <Mail className="h-3 w-3 shrink-0" />
                  {c.email} · {c.relation}
                </p>
              </div>
              <div className="flex shrink-0 gap-1">
                <Button size="icon" variant="ghost" aria-label="Make primary" onClick={() => makePrimary(c.id)}>
                  <Star className={c.primary ? "h-4 w-4 fill-current text-caution" : "h-4 w-4"} />
                </Button>
                <Button size="icon" variant="ghost" aria-label="Remove contact" onClick={() => removeContact(c.id)}>
                  <Trash2 className="h-4 w-4 text-sos" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-4 w-4 text-accent" />
            <p className="font-semibold">Add a contact</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="n">Name</Label>
              <Input id="n" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="r">Relation</Label>
              <Input id="r" value={form.relation} onChange={(e) => setForm({ ...form, relation: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="p">Phone</Label>
              <Input id="p" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="e">Email</Label>
              <Input id="e" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
          </div>
          <Button
            className="w-full"
            disabled={!form.name.trim() || !form.phone.trim()}
            onClick={() => {
              addContact(form);
              setForm({ name: "", phone: "", email: "", relation: "Friend" });
              toast.success("Contact added to your safety network");
            }}
          >
            Save contact
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
