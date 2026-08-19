import { useEffect, useRef, useState } from "react";
import { ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { useSafeHer } from "@/lib/safeher-store";
import { cn } from "@/lib/utils";

const HOLD_MS = 3000;
const R = 76;
const C = 2 * Math.PI * R;

export function SosButton() {
  const { contacts, logEvent, setSharingLocation, setEmergencyActive } = useSafeHer();
  const [progress, setProgress] = useState(0);
  const [fired, setFired] = useState(false);
  const raf = useRef<number | null>(null);
  const start = useRef(0);

  useEffect(() => () => { if (raf.current) cancelAnimationFrame(raf.current); }, []);

  const stop = () => {
    if (raf.current) cancelAnimationFrame(raf.current);
    raf.current = null;
    setProgress(0);
  };

  const tick = () => {
    const pct = Math.min(1, (performance.now() - start.current) / HOLD_MS);
    setProgress(pct);
    if (pct >= 1) {
      stop();
      setFired(true);
      setSharingLocation(true);
      setEmergencyActive(true);
      logEvent("sos", "SOS alert activated — emergency mode engaged");
      logEvent("sos", "GPS Coordinates Sent");
      logEvent("sos", `Emergency Contacts Notified (${contacts.length})`);
      toast.error("SOS triggered", {
        description: `Simulated alert + live location sent to ${contacts.length} contacts.`,
      });
      setTimeout(() => setFired(false), 6000);
      return;
    }
    raf.current = requestAnimationFrame(tick);
  };

  const begin = () => {
    if (raf.current) return;
    start.current = performance.now();
    raf.current = requestAnimationFrame(tick);
  };

  const dashOffset = C - progress * C;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative grid place-items-center">
        <span className={cn("absolute h-52 w-52 rounded-full bg-sos/25", progress > 0 ? "pulse-ring" : "")} aria-hidden />
        <svg className="pointer-events-none absolute h-56 w-56 -rotate-90" viewBox="0 0 176 176" aria-hidden>
          <circle cx="88" cy="88" r={R} fill="none" stroke="currentColor" strokeWidth="6" className="text-sos/15" />
          <circle
            cx="88"
            cy="88"
            r={R}
            fill="none"
            stroke="currentColor"
            strokeWidth="6"
            strokeLinecap="round"
            className="text-sos-foreground transition-all duration-75"
            strokeDasharray={C}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <button
          type="button"
          aria-label="Hold for 3 seconds to trigger SOS"
          onPointerDown={begin}
          onPointerUp={stop}
          onPointerLeave={stop}
          onPointerCancel={stop}
          onContextMenu={(e) => e.preventDefault()}
          className="relative h-44 w-44 touch-none select-none rounded-full surface-sos transition-transform active:scale-95"
        >
          <span className="flex flex-col items-center gap-1.5">
            <ShieldAlert className="h-9 w-9" />
            <span className="text-2xl font-black tracking-widest">SOS</span>
            <span className="text-[11px] font-medium opacity-90">
              {progress > 0 ? `Keep holding… ${(3 - progress * 3).toFixed(1)}s` : "Hold 3 seconds"}
            </span>
          </span>
        </button>
      </div>
      <p className="text-center text-xs text-muted-foreground">
        {fired
          ? "Alert sent. Stay on the line — your contacts can see you live."
          : "Press and hold to alert your safety network. Accidental taps do nothing."}
      </p>
    </div>
  );
}
