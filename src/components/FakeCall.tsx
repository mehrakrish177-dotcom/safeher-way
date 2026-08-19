import { useEffect, useState } from "react";
import {
  Phone,
  PhoneOff,
  Video,
  Mic,
  MicOff,
  Volume2,
  Grid3x3,
  UserPlus,
  AlarmClock,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const presets = ["Mom", "Dad", "Partner", "Boss", "Bhaiya"];

export function FakeCall() {
  const [caller, setCaller] = useState("Mom");
  const [subtitle, setSubtitle] = useState("mobile");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [ringing, setRinging] = useState(false);
  const [inCall, setInCall] = useState(false);
  const [duration, setDuration] = useState(0);
  const [muted, setMuted] = useState(false);

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

  const start = () => {
    setDuration(0);
    setMuted(false);
    setCountdown(5);
  };

  const end = () => {
    setRinging(false);
    setInCall(false);
    setDuration(0);
  };

  const mmss = `${String(Math.floor(duration / 60)).padStart(2, "0")}:${String(duration % 60).padStart(2, "0")}`;
  const overlayOpen = ringing || inCall;

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

        <div className="flex flex-wrap gap-2">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setCaller(p)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                caller === p
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-muted text-muted-foreground hover:bg-secondary"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <Button className="w-full" onClick={start} disabled={countdown !== null || overlayOpen}>
          <Phone className="mr-2 h-4 w-4" />
          {countdown !== null ? `Calling in ${countdown}…` : "Trigger fake call (5s)"}
        </Button>
      </div>

      {countdown !== null && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-foreground/80 px-6 backdrop-blur-sm">
          <div className="text-center text-background">
            <p className="text-sm uppercase tracking-[0.3em] opacity-70">Incoming call in</p>
            <p className="mt-4 text-8xl font-black tabular-nums">{countdown}</p>
            <p className="mt-4 text-sm opacity-70">{caller} will call you. Keep walking.</p>
            <button
              onClick={() => setCountdown(null)}
              className="mt-8 rounded-full border border-background/40 px-5 py-2 text-sm font-medium"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {overlayOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-between bg-[oklch(0.18_0.01_275)] px-6 pb-12 pt-14 text-[oklch(0.98_0_0)]">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_-10%,oklch(0.42_0.03_275),transparent_70%)]" />

          <div className="relative text-center">
            <p className="text-sm opacity-60">{inCall ? subtitle : `${subtitle} · SafeHer`}</p>
            <h2 className="mt-2 text-[2.6rem] font-medium leading-tight tracking-tight">{caller}</h2>
            <p className="mt-2 text-base opacity-70">
              {inCall ? mmss : "incoming call…"}
            </p>
          </div>

          <div className="relative mx-auto grid h-32 w-32 place-items-center rounded-full bg-white/10 text-5xl font-light">
            {caller.slice(0, 1).toUpperCase()}
            {!inCall && (
              <span className="absolute inset-0 animate-ping rounded-full border border-white/25" aria-hidden />
            )}
          </div>

          {inCall ? (
            <div className="relative space-y-10">
              <div className="mx-auto grid max-w-xs grid-cols-3 gap-y-6 text-center text-[11px]">
                {[
                  { Icon: muted ? MicOff : Mic, label: muted ? "unmute" : "mute", onClick: () => setMuted((m) => !m) },
                  { Icon: Grid3x3, label: "keypad" },
                  { Icon: Volume2, label: "speaker" },
                  { Icon: UserPlus, label: "add call" },
                  { Icon: Video, label: "FaceTime" },
                  { Icon: MessageSquare, label: "contacts" },
                ].map(({ Icon, label, onClick }) => (
                  <button key={label} onClick={onClick} className="flex flex-col items-center gap-2">
                    <span className="grid h-16 w-16 place-items-center rounded-full bg-white/15">
                      <Icon className="h-6 w-6" />
                    </span>
                    <span className="opacity-70">{label}</span>
                  </button>
                ))}
              </div>
              <button
                onClick={end}
                aria-label="End call"
                className="mx-auto grid h-18 w-18 place-items-center rounded-full bg-sos p-5 text-sos-foreground"
              >
                <PhoneOff className="h-7 w-7" />
              </button>
            </div>
          ) : (
            <div className="relative space-y-8">
              <div className="mx-auto flex max-w-xs justify-between text-center text-[11px] opacity-80">
                <span className="flex flex-col items-center gap-2">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
                    <AlarmClock className="h-5 w-5" />
                  </span>
                  Remind me
                </span>
                <span className="flex flex-col items-center gap-2">
                  <span className="grid h-12 w-12 place-items-center rounded-full bg-white/10">
                    <MessageSquare className="h-5 w-5" />
                  </span>
                  Message
                </span>
              </div>
              <div className="mx-auto flex max-w-xs items-center justify-between">
                <button
                  onClick={end}
                  aria-label="Decline"
                  className="flex flex-col items-center gap-2 text-[11px] opacity-90"
                >
                  <span className="grid h-18 w-18 place-items-center rounded-full bg-sos p-5 text-sos-foreground">
                    <PhoneOff className="h-7 w-7" />
                  </span>
                  Decline
                </button>
                <button
                  onClick={() => {
                    setRinging(false);
                    setInCall(true);
                  }}
                  aria-label="Accept"
                  className="flex flex-col items-center gap-2 text-[11px] opacity-90"
                >
                  <span className="grid h-18 w-18 animate-bounce place-items-center rounded-full bg-safe p-5 text-safe-foreground">
                    <Phone className="h-7 w-7" />
                  </span>
                  Accept
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
