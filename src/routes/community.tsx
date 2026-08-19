import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowBigUp, MessageSquarePlus, ShieldQuestion } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSafeHer, type Post } from "@/lib/safeher-store";

export const Route = createFileRoute("/community")({
  head: () => ({
    meta: [
      { title: "Community Hub — SafeHer Journey" },
      {
        name: "description",
        content:
          "Anonymous local safety tips, transit hub reviews and recommended safe businesses from women nearby.",
      },
      { property: "og:title", content: "Community Hub — SafeHer Journey" },
      {
        property: "og:description",
        content: "Anonymous feed of neighbourhood safety tips, transit reviews and trusted late-night spots.",
      },
    ],
  }),
  component: Community,
});

const tags: Post["tag"][] = ["Tip", "Transit", "Business", "Alert"];

function timeAgo(min: number) {
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  return `${Math.floor(min / 60)}h ago`;
}

function Community() {
  const { posts, addPost, upvote } = useSafeHer();
  const [filter, setFilter] = useState<"All" | Post["tag"]>("All");
  const [draft, setDraft] = useState({ area: "Bandra West", tag: "Tip" as Post["tag"], body: "" });

  const visible = posts.filter((p) => filter === "All" || p.tag === filter);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Community hub</h1>
        <p className="text-sm text-muted-foreground">
          Anonymous by default — your handle rotates with every post.
        </p>
      </header>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as typeof filter)}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="All">All</TabsTrigger>
          {tags.map((t) => (
            <TabsTrigger key={t} value={t}>
              {t}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <section className="space-y-3">
        {visible.map((p) => (
          <Card key={p.id}>
            <CardContent className="grid grid-cols-[auto_minmax(0,1fr)] gap-3 p-4">
              <button
                onClick={() => upvote(p.id)}
                aria-label={`Upvote post by ${p.handle}`}
                className="flex h-fit shrink-0 flex-col items-center rounded-xl bg-muted px-2 py-1.5 text-xs font-semibold transition-colors hover:bg-secondary"
              >
                <ArrowBigUp className="h-4 w-4" />
                {p.upvotes}
              </button>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="font-medium text-foreground">@{p.handle}</span>
                  <span>· {p.area}</span>
                  <span>· {timeAgo(p.minutesAgo)}</span>
                  <Badge variant={p.tag === "Alert" ? "destructive" : "secondary"}>{p.tag}</Badge>
                </div>
                <p className="mt-2 text-sm leading-relaxed">{p.body}</p>
              </div>
            </CardContent>
          </Card>
        ))}
        {visible.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center gap-2 p-8 text-center text-sm text-muted-foreground">
              <ShieldQuestion className="h-6 w-6" />
              Nothing posted in this category yet.
            </CardContent>
          </Card>
        )}
      </section>

      <Card>
        <CardContent className="space-y-3 p-4">
          <div className="flex items-center gap-2">
            <MessageSquarePlus className="h-4 w-4 text-accent" />
            <p className="font-semibold">Share something useful</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="area">Area</Label>
              <Input id="area" value={draft.area} onChange={(e) => setDraft({ ...draft, area: e.target.value })} />
            </div>
            <div className="space-y-1.5">
              <Label>Category</Label>
              <Select value={draft.tag} onValueChange={(v) => setDraft({ ...draft, tag: v as Post["tag"] })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {tags.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <Textarea
            rows={3}
            placeholder="Lighting, staff, late-night footfall, anything a solo traveller should know…"
            value={draft.body}
            onChange={(e) => setDraft({ ...draft, body: e.target.value })}
          />
          <Button
            className="w-full"
            disabled={!draft.body.trim()}
            onClick={() => {
              addPost({ ...draft, handle: "anon-" + Math.random().toString(36).slice(2, 7) });
              setDraft({ ...draft, body: "" });
              toast.success("Posted anonymously");
            }}
          >
            Post anonymously
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
