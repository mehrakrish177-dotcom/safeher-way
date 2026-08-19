import { createFileRoute, Link } from "@tanstack/react-router";
import { MapPin, PhoneCall, Route as RouteIcon, ShieldCheck, Radio, Clock, AlertTriangle, X } from "lucide-react";
import { toast } from "sonner";
import { SosButton } from "@/components/SosButton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useSafeHer } from "@/lib/safeher-store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "SafeHer Journey — Solo Safety Companion" },
      {
        name: "description",
        content:
          "SOS in one hold, live location sharing, safe route planning and a trusted check-in network for women travelling solo.",
      },
      { property: "og:title", content: "SafeHer Journey — Solo Safety Companion" },
      {
        property: "og:description",
        content: "Hold-to-trigger SOS, safe routes, fake calls and a check-in network built for solo journeys.",
      },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  const {
    sharingLocation,
    setSharingLocation,
    contacts,
    events,
    logEvent,
    recording,
    emergencyActive,
    setEmergencyActive,
  } = useSafeHer();

  const sosEvents = events.filter(
    (e) =>
      e.kind === "sos" &&
      (e.message.includes("GPS Coordinates Sent") ||
        e.message.includes("Emergency Contacts Notified") ||
        e.message.includes("emergency mode")),
  );

  return (
    <div className={cn("space-y-7 rounded-3xl p-1 transition-all", emergencyActive && "sos-flash")}>
      <section
        className={cn(
          "rounded-3xl border p-5 shadow-soft transition-colors",
          emergencyActive
            ? "border-sos bg-sos/10"
            : "border-border bg-card",
        )}
      >
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 sm:flex sm:justify-between">
          <div className="min-w-0">
            <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              {emergencyActive ? "Emergency in progress" : "Good evening, Riya"}
            </p>
            <h1
              className={cn(
                "mt-1 text-2xl font-bold tracking-tight sm:text-3xl",
                emergencyActive && "text-sos",
              )}
            >
              {emergencyActive ? "EMERGENCY ALERT ACTIVE" : "You're covered tonight"}
            </h1>
          </div>
          <Badge
            className="shrink-0"
            variant={emergencyActive ? "destructive" : sharingLocation || recording ? "destructive" : "secondary"}
          >
            {emergencyActive ? "SOS ACTIVE" : sharingLocation ? "Sharing location" : recording ? "Recording" : "Secure mode"}
          </Badge>
        </div>
        <div className="mt-6 flex justify-center">
          <SosButton />
        </div>
      </section>

      {emergencyActive && (
        <section className="animate-fade-in">
          <Card className="border-sos bg-sos/5">
            <CardContent className="space-y-4 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sos">
                  <AlertTriangle className="h-5 w-5" />
                  <p className="font-semibold">Simulated emergency log</p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEmergencyActive(false);
                    logEvent("sos", "Emergency alert cleared by user");
                    toast.success("Emergency alert cleared");
                  }}
                >
                  <X className="mr-1.5 h-4 w-4" />
                  Clear alert
                </Button>
              </div>
              <ul className="space-y-2 text-sm">
                {sosEvents.length === 0 ? (
                  <li className="text-muted-foreground">No actions logged yet.</li>
                ) : (
                  sosEvents.map((e) => (
                    <li key={e.id} className="flex items-start gap-3">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-sos" />
                      <div>
                        <p className="font-medium">{e.message}</p>
                        <p className="text-xs text-muted-foreground">{e.at}</p>
                      </div>
                    </li>
                  ))
                )}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}

      <section className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            <MapPin className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Share live location</p>
              <p className="text-xs text-muted-foreground">
                {sharingLocation ? `Visible to ${contacts.length} contacts` : "Off — one tap to start"}
              </p>
            </div>
            <Button
              variant={sharingLocation ? "destructive" : "default"}
              onClick={() => {
                const next = !sharingLocation;
                setSharingLocation(next);
                logEvent("location", next ? "Live location sharing started" : "Live location sharing stopped");
                toast[next ? "success" : "message"](
                  next ? "Live location shared" : "Location sharing stopped",
                );
              }}
            >
              {sharingLocation ? "Stop sharing" : "Start sharing"}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            <PhoneCall className="h-5 w-5 text-accent" />
            <div>
              <p className="font-semibold">Fake call simulator</p>
              <p className="text-xs text-muted-foreground">Realistic incoming call on a timer</p>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/toolkit">Open simulator</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex flex-col gap-3 p-4">
            <RouteIcon className="h-5 w-5 text-primary" />
            <div>
              <p className="font-semibold">Safe route planner</p>
              <p className="text-xs text-muted-foreground">Well-lit, busy streets first</p>
            </div>
            <Button variant="secondary" asChild>
              <Link to="/routes">Plan a route</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-3 md:grid-cols-2">
        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-safe" />
              <p className="font-semibold">Safety status</p>
            </div>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Location sharing</span>
                <span className={sharingLocation ? "text-sos" : "text-safe"}>
                  {sharingLocation ? "Live" : "Off"}
                </span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Ambient recording</span>
                <span className={recording ? "text-sos" : "text-safe"}>{recording ? "Recording" : "Off"}</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Emergency contacts</span>
                <span>{contacts.length} active</span>
              </li>
              <li className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Next check-in</span>
                <span>10:30 PM</span>
              </li>
            </ul>
            <Button variant="outline" className="w-full" asChild>
              <Link to="/network">Manage safety network</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 p-4">
            <div className="flex items-center gap-2">
              <Radio className="h-4 w-4 text-accent" />
              <p className="font-semibold">Recent activity</p>
            </div>
            <ul className="space-y-3">
              {events.slice(0, 5).map((e) => (
                <li key={e.id} className="flex items-start gap-3 text-sm">
                  <Clock className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className={cn("truncate", e.kind === "sos" && "text-sos font-medium")}>{e.message}</p>
                    <p className="text-xs text-muted-foreground">{e.at}</p>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
