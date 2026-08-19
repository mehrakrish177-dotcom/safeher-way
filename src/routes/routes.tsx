import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Lightbulb, Store, AlertTriangle, LifeBuoy, Navigation, Clock, Footprints } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSafeHer, type SafetyPin } from "@/lib/safeher-store";

export const Route = createFileRoute("/routes")({
  head: () => ({
    meta: [
      { title: "AI Safe Route Planner — SafeHer Journey" },
      {
        name: "description",
        content:
          "Compare the safest well-lit route against the fastest one, and browse crowd-sourced safety pins along the way.",
      },
      { property: "og:title", content: "AI Safe Route Planner — SafeHer Journey" },
      {
        property: "og:description",
        content: "Safest vs fastest routing with community safety pins for well-lit streets and sketchy zones.",
      },
    ],
  }),
  component: RoutePlanner,
});

const pinStyle: Record<SafetyPin["type"], { icon: typeof Lightbulb; className: string; label: string }> = {
  "well-lit": { icon: Lightbulb, className: "bg-caution text-caution-foreground", label: "Well lit" },
  "open-shop": { icon: Store, className: "bg-safe text-safe-foreground", label: "Open late" },
  sketchy: { icon: AlertTriangle, className: "bg-sos text-sos-foreground", label: "Sketchy" },
  "help-point": { icon: LifeBuoy, className: "bg-primary text-primary-foreground", label: "Help point" },
};

const routeInfo = {
  safest: {
    time: "24 min",
    distance: "2.1 km",
    blurb: "Main roads via Linking Rd — 92% lit, 4 open shops, 1 help point.",
    score: 92,
    path: "M 12 78 C 26 60, 26 40, 40 32 S 68 28, 86 22",
  },
  fastest: {
    time: "16 min",
    distance: "1.4 km",
    blurb: "Cuts through the depot underpass — 2 unlit stretches reported tonight.",
    score: 48,
    path: "M 12 78 C 30 74, 44 66, 58 52 S 76 30, 86 22",
  },
};

function RoutePlanner() {
  const { pins, addPin } = useSafeHer();
  const [mode, setMode] = useState<"safest" | "fastest">("safest");
  const [selected, setSelected] = useState<SafetyPin | null>(null);
  const [newPin, setNewPin] = useState({ label: "", type: "well-lit" as SafetyPin["type"], note: "" });
  const info = routeInfo[mode];

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Safe route planner</h1>
        <p className="text-sm text-muted-foreground">Bandra Station → Home, Carter Road</p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="from">From</Label>
              <Input id="from" defaultValue="Bandra Station, West Exit" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="to">To</Label>
              <Input id="to" defaultValue="Carter Road, Building 4" />
            </div>
          </div>

          <Tabs value={mode} onValueChange={(v) => setMode(v as typeof mode)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="safest">Safest</TabsTrigger>
              <TabsTrigger value="fastest">Fastest</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-border bg-muted sm:aspect-2/1">
            <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="var(--color-border)" strokeWidth="0.4" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
              <path d="M 0 78 H 100" stroke="var(--color-border)" strokeWidth="3" />
              <path d="M 40 0 V 100" stroke="var(--color-border)" strokeWidth="3" />
              <path
                d={info.path}
                fill="none"
                strokeLinecap="round"
                strokeWidth="2.4"
                stroke={mode === "safest" ? "var(--color-safe)" : "var(--color-caution)"}
                strokeDasharray={mode === "fastest" ? "5 3" : undefined}
              />
            </svg>

            {pins.map((p) => {
              const s = pinStyle[p.type];
              const Icon = s.icon;
              return (
                <button
                  key={p.id}
                  onClick={() => setSelected(p)}
                  aria-label={p.label}
                  style={{ left: `${p.x}%`, top: `${p.y}%` }}
                  className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full p-1.5 shadow-soft transition-transform hover:scale-110 ${s.className}`}
                >
                  <Icon className="h-3.5 w-3.5" />
                </button>
              );
            })}

            <span className="absolute left-[12%] top-[78%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
              A
            </span>
            <span className="absolute left-[86%] top-[22%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-accent-foreground">
              B
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3 text-center text-sm">
            <div className="rounded-xl bg-muted p-3">
              <Clock className="mx-auto h-4 w-4 text-muted-foreground" />
              <p className="mt-1 font-semibold">{info.time}</p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <Footprints className="mx-auto h-4 w-4 text-muted-foreground" />
              <p className="mt-1 font-semibold">{info.distance}</p>
            </div>
            <div className="rounded-xl bg-muted p-3">
              <Navigation className="mx-auto h-4 w-4 text-muted-foreground" />
              <p className="mt-1 font-semibold">{info.score}/100</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">{info.blurb}</p>
          <Button className="w-full" onClick={() => toast.success("Route started", { description: info.blurb })}>
            Start guided walk
          </Button>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardContent className="space-y-2 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate font-semibold">{selected.label}</p>
              <Badge variant="secondary">{pinStyle[selected.type].label}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{selected.note}</p>
            <p className="text-xs text-muted-foreground">{selected.reports} community reports</p>
            <Button variant="outline" size="sm" onClick={() => setSelected(null)}>
              Close
            </Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardContent className="space-y-3 p-4">
          <p className="font-semibold">Report a spot</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="pin-label">Place</Label>
              <Input
                id="pin-label"
                placeholder="e.g. Gate 2 alley"
                value={newPin.label}
                onChange={(e) => setNewPin({ ...newPin, label: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Type</Label>
              <Select
                value={newPin.type}
                onValueChange={(v) => setNewPin({ ...newPin, type: v as SafetyPin["type"] })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(pinStyle).map(([k, v]) => (
                    <SelectItem key={k} value={k}>
                      {v.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pin-note">What should others know?</Label>
            <Input
              id="pin-note"
              placeholder="Lighting, footfall, shops open…"
              value={newPin.note}
              onChange={(e) => setNewPin({ ...newPin, note: e.target.value })}
            />
          </div>
          <Button
            className="w-full"
            disabled={!newPin.label.trim()}
            onClick={() => {
              addPin({
                ...newPin,
                x: 20 + Math.random() * 60,
                y: 20 + Math.random() * 55,
              });
              setNewPin({ label: "", type: "well-lit", note: "" });
              toast.success("Pin added to the map");
            }}
          >
            Add safety pin
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
