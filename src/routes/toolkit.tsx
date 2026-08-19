import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Mic, Siren, Square, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { FakeCall } from "@/components/FakeCall";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { useSafeHer } from "@/lib/safeher-store";

export const Route = createFileRoute("/toolkit")({
  head: () => ({
    meta: [
      { title: "Companion Toolkit — SafeHer Journey" },
      {
        name: "description",
        content: "Fake call simulator, ambient audio recorder and a loud panic siren, ready in one tap.",
      },
      { property: "og:title", content: "Companion Toolkit — SafeHer Journey" },
      {
        property: "og:description",
        content: "Trigger a realistic fake call, start ambient recording, or sound a panic alarm instantly.",
      },
    ],
  }),
  component: Toolkit,
});

function Toolkit() {
  const { recording, setRecording, sirenOn, setSirenOn, logEvent } = useSafeHer();
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!recording) return;
    const t = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(t);
  }, [recording]);

  const mmss = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Companion toolkit</h1>
        <p className="text-sm text-muted-foreground">Everything you need within thumb reach.</p>
      </header>

      <Card>
        <CardContent className="space-y-4 p-4">
          <p className="font-semibold">Fake call simulator</p>
          <FakeCall />
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">Ambient recorder</p>
              <p className="text-xs text-muted-foreground">Audio + video saved to your safety vault (simulated)</p>
            </div>
            <Badge variant={recording ? "destructive" : "secondary"}>{recording ? mmss : "Idle"}</Badge>
          </div>
          {recording && (
            <div className="flex h-14 items-end gap-1 rounded-xl bg-muted p-3">
              {Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={i}
                  className="flex-1 rounded-full bg-sos/70"
                  style={{
                    height: `${20 + Math.abs(Math.sin((i + elapsed) / 2)) * 75}%`,
                    transition: "height 240ms ease",
                  }}
                />
              ))}
            </div>
          )}
          <Button
            className="w-full"
            variant={recording ? "destructive" : "default"}
            onClick={() => {
              const next = !recording;
              setRecording(next);
              if (!next) setElapsed(0);
              logEvent("recording", next ? "Ambient recording started" : `Recording saved (${mmss})`);
              toast[next ? "error" : "success"](next ? "Recording started" : "Recording saved to vault");
            }}
          >
            {recording ? <Square className="mr-2 h-4 w-4" /> : <Mic className="mr-2 h-4 w-4" />}
            {recording ? "Stop and save" : "Start ambient recording"}
          </Button>
        </CardContent>
      </Card>

      <Card className={sirenOn ? "border-sos" : undefined}>
        <CardContent className="space-y-4 p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="font-semibold">Panic siren</p>
              <p className="text-xs text-muted-foreground">120 dB alarm with flashing screen</p>
            </div>
            <Switch
              checked={sirenOn}
              onCheckedChange={(v) => {
                setSirenOn(v);
                toast[v ? "error" : "message"](v ? "Siren blaring" : "Siren off");
              }}
              aria-label="Toggle panic siren"
            />
          </div>
          <div
            className={`grid place-items-center rounded-2xl p-6 text-center ${
              sirenOn ? "surface-sos animate-pulse" : "bg-muted text-muted-foreground"
            }`}
          >
            {sirenOn ? <Volume2 className="h-8 w-8" /> : <Siren className="h-8 w-8" />}
            <p className="mt-2 text-sm font-semibold">
              {sirenOn ? "Alarm active — draw attention" : "Alarm ready"}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
