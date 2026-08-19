import { Link } from "@tanstack/react-router";
import { Home, Map, Siren, Users, MessagesSquare, ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useSafeHer } from "@/lib/safeher-store";

const nav = [
  { to: "/", label: "Home", icon: Home },
  { to: "/routes", label: "Routes", icon: Map },
  { to: "/toolkit", label: "Toolkit", icon: Siren },
  { to: "/network", label: "Network", icon: Users },
  { to: "/community", label: "Community", icon: MessagesSquare },
] as const;

function StatusPill() {
  const { sharingLocation, recording } = useSafeHer();
  const label = sharingLocation
    ? "Sharing live location"
    : recording
      ? "Ambient recording on"
      : "Secure mode active";
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium">
      <span
        className={cn(
          "h-2 w-2 rounded-full",
          sharingLocation || recording ? "bg-sos" : "bg-safe",
        )}
      />
      <span className="truncate">{label}</span>
    </span>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar p-5 md:flex">
        <div className="flex items-center gap-2.5">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-2xl surface-calm">
            <ShieldCheck className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-base font-semibold tracking-tight">SafeHer Journey</p>
            <p className="truncate text-xs text-muted-foreground">Solo travel companion</p>
          </div>
        </div>
        <nav className="mt-8 flex flex-col gap-1">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "bg-sidebar-accent text-sidebar-accent-foreground" }}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent/60"
            >
              <Icon className="h-4.5 w-4.5 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
        <div className="mt-auto pt-6">
          <StatusPill />
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-background/85 px-4 py-3 backdrop-blur md:hidden">
          <div className="flex min-w-0 items-center gap-2">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl surface-calm">
              <ShieldCheck className="h-4.5 w-4.5" />
            </span>
            <p className="truncate text-sm font-semibold tracking-tight">SafeHer Journey</p>
          </div>
          <StatusPill />
        </header>

        <main className="mx-auto w-full max-w-4xl flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-12">
          {children}
        </main>

        <nav className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
          {nav.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              activeProps={{ className: "text-primary" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
