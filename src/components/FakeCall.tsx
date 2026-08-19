import { useEffect, useState } from "react";
import { Phone, PhoneOff, Video, Mic, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const delays = [
  { value: "0", label: "Immediately" },
  { value: "5", label: "In 5 seconds" },
  { value: "15", label: "In 15 seconds" },
  { value: "30", label: "In 30 seconds" },
];

export function FakeCall() {
  const [caller, setCaller] = useState("Dad");
  const [subtitle, setSubtitle] = useState("mobile");
  const [delay, setDelay] = useState("5");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [ringing, setRinging] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (countdown === null) return;
    if (countdown <= 0) {
      setCountdown(null);
      setRinging(true);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => (c ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  useEffect(() => {
    if (!inCall) return;
    const t = setInterval(() => setDuration((d) => d + 1), 1000);
    return () => clearInterval(t);
  }, [inCall]);

  const schedule = () => {
    setDuration(0);
    const secs = Number(delay);
    if (secs === 0) setRinging(true);
    else setCountdown(secs);
  };

  const end = () => {
    setRinging(false);
    setInCall(false);
    setDuration(0);
  };

  const mmss = `${String(Math.floor(duration / 60)).padStart(2, "0")}:${String(duration % 60).padStart(2, "0")}`;

  return (
    <>
      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="caller">Caller name</Label>
            <Input id="caller" value={caller} onChange={(e) => setCaller(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="sub">Label</Label>
            <Input id="sub" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          </div>
        </div>
        <div className="space-y-1.5">
          <Label>Ring timer</Label>
          <Select value={delay} onValueChange={setDelay}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {delays.map((d) => (
                <SelectItem key={d.value} value={d.value}>
                  {d.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button className="w-full" onClick={schedule} disabled={countdown !== null || ringing || inCall}>
          <Phone className="mr-2 h-4 w-4" />
          {countdown !== null ? `Ringing in ${countdown}s…` : "Schedule fake call"}
        </Button>
      </div>

      {(ringing || inCall) && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-foreground/95 px-6 py-16 text-background">
          <div className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] opacity-70">
              {inCall ? mmss : "incoming call"}
            </p>
            <h2 className="mt-4 text-4xl font-semibold tracking-tight">{caller}</h2>
            <p className="mt-1 text-sm opacity-70">{subtitle}</p>
          </div>

          <div className="grid h-28 w-28 place-items-center rounded-full bg-background/15 text-4xl font-semibold">
            {caller.slice(0, 1).toUpperCase()}
          </div>

          {inCall ? (
            <div className="w-full max-w-xs space-y-8">
              <div className="grid grid-cols-3 gap-4 text-center text-xs">
                {[Mic, Video, MoreHorizontal].map((Icon, i) => (
                  <div key={i} className="grid place-items-center gap-2">
                    <span className="grid h-14 w-14 place-items-center rounded-full bg-background/15">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                ))}
              </div>
              <button
                onClick={end}
                aria-label="End call"
                className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-sos text-sos-foreground"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
            </div>
          ) : (
            <div className="flex w-full max-w-xs items-center justify-between">
              <button
                onClick={end}
                aria-label="Decline"
                className="grid h-16 w-16 place-items-center rounded-full bg-sos text-sos-foreground"
              >
                <PhoneOff className="h-6 w-6" />
              </button>
              <button
                onClick={() => {
                  setRinging(false);
                  setInCall(true);
                }}
                aria-label="Accept"
                className="grid h-16 w-16 animate-bounce place-items-center rounded-full bg-safe text-safe-foreground"
              >
                <Phone className="h-6 w-6" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
