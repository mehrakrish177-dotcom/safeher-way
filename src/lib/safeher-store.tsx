import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

export type Contact = {
  id: string;
  name: string;
  phone: string;
  email: string;
  relation: string;
  primary: boolean;
};

export type SafetyPin = {
  id: string;
  label: string;
  type: "well-lit" | "open-shop" | "sketchy" | "help-point";
  note: string;
  reports: number;
  x: number;
  y: number;
};

export type Post = {
  id: string;
  handle: string;
  area: string;
  tag: "Transit" | "Tip" | "Business" | "Alert";
  body: string;
  minutesAgo: number;
  upvotes: number;
};

export type AlertEvent = {
  id: string;
  kind: "sos" | "location" | "checkin" | "recording";
  message: string;
  at: string;
};

const initialContacts: Contact[] = [
  {
    id: "c1",
    name: "Meera Kapoor",
    phone: "+91 98200 41122",
    email: "meera.kapoor@mail.com",
    relation: "Sister",
    primary: true,
  },
  {
    id: "c2",
    name: "Ananya Rao",
    phone: "+91 99870 55310",
    email: "ananya.rao@mail.com",
    relation: "Flatmate",
    primary: false,
  },
  {
    id: "c3",
    name: "Dad",
    phone: "+91 98111 20034",
    email: "r.sharma@mail.com",
    relation: "Family",
    primary: false,
  },
  {
    id: "c4",
    name: "Neighbourhood Watch",
    phone: "+91 90000 11223",
    email: "watch.bandra@mail.com",
    relation: "Community",
    primary: false,
  },
];

export const safetyPins: SafetyPin[] = [
  {
    id: "p1",
    label: "Linking Road stretch",
    type: "well-lit",
    note: "New LED streetlights, footfall until 1 AM.",
    reports: 46,
    x: 26,
    y: 32,
  },
  {
    id: "p2",
    label: "Chai Junction (24h)",
    type: "open-shop",
    note: "Always open, owner lets you wait inside.",
    reports: 31,
    x: 58,
    y: 24,
  },
  {
    id: "p3",
    label: "Underpass near Depot",
    type: "sketchy",
    note: "Two lights out, avoid after 9 PM.",
    reports: 18,
    x: 44,
    y: 66,
  },
  {
    id: "p4",
    label: "Metro Gate 3 help desk",
    type: "help-point",
    note: "Staffed police help booth, CCTV covered.",
    reports: 62,
    x: 74,
    y: 58,
  },
  {
    id: "p5",
    label: "Park lane shortcut",
    type: "sketchy",
    note: "Quiet after 8 PM, few shops open.",
    reports: 12,
    x: 18,
    y: 72,
  },
];

const initialPosts: Post[] = [
  {
    id: "f1",
    handle: "quiet-lark",
    area: "Bandra West",
    tag: "Transit",
    body: "Night bus 211 now has a female conductor after 10 PM. Felt genuinely comfortable on the last ride.",
    minutesAgo: 12,
    upvotes: 84,
  },
  {
    id: "f2",
    handle: "amber-fern",
    area: "Andheri East",
    tag: "Alert",
    body: "Streetlights near the metro service road have been out for three nights. Reported to the ward office.",
    minutesAgo: 47,
    upvotes: 129,
  },
  {
    id: "f3",
    handle: "still-river",
    area: "Khar",
    tag: "Business",
    body: "Cafe Solace lets solo customers wait inside for cabs and will walk you to the gate. Great late-night spot.",
    minutesAgo: 96,
    upvotes: 203,
  },
  {
    id: "f4",
    handle: "north-star",
    area: "Santacruz",
    tag: "Tip",
    body: "Share your cab OTP screen with a contact before boarding — takes 5 seconds and saves a call later.",
    minutesAgo: 180,
    upvotes: 311,
  },
];

type StoreValue = {
  contacts: Contact[];
  addContact: (c: Omit<Contact, "id" | "primary">) => void;
  removeContact: (id: string) => void;
  makePrimary: (id: string) => void;
  posts: Post[];
  addPost: (p: Omit<Post, "id" | "minutesAgo" | "upvotes">) => void;
  upvote: (id: string) => void;
  pins: SafetyPin[];
  addPin: (p: Omit<SafetyPin, "id" | "reports">) => void;
  sharingLocation: boolean;
  setSharingLocation: (v: boolean) => void;
  recording: boolean;
  setRecording: (v: boolean) => void;
  sirenOn: boolean;
  setSirenOn: (v: boolean) => void;
  emergencyActive: boolean;
  setEmergencyActive: (v: boolean) => void;
  events: AlertEvent[];
  logEvent: (kind: AlertEvent["kind"], message: string) => void;
};

const StoreContext = createContext<StoreValue | null>(null);

export function SafeHerProvider({ children }: { children: ReactNode }) {
  const [contacts, setContacts] = useState<Contact[]>(initialContacts);
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [pins, setPins] = useState<SafetyPin[]>(safetyPins);
  const [sharingLocation, setSharingLocation] = useState(false);
  const [recording, setRecording] = useState(false);
  const [sirenOn, setSirenOn] = useState(false);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const [events, setEvents] = useState<AlertEvent[]>([
    { id: "e1", kind: "checkin", message: "Evening check-in confirmed", at: "Yesterday, 10:42 PM" },
    { id: "e2", kind: "location", message: "Live location shared with Meera Kapoor", at: "Yesterday, 9:58 PM" },
  ]);

  const value = useMemo<StoreValue>(
    () => ({
      contacts,
      addContact: (c) =>
        setContacts((prev) => [...prev, { ...c, id: crypto.randomUUID(), primary: prev.length === 0 }]),
      removeContact: (id) => setContacts((prev) => prev.filter((c) => c.id !== id)),
      makePrimary: (id) => setContacts((prev) => prev.map((c) => ({ ...c, primary: c.id === id }))),
      posts,
      addPost: (p) =>
        setPosts((prev) => [{ ...p, id: crypto.randomUUID(), minutesAgo: 0, upvotes: 1 }, ...prev]),
      upvote: (id) =>
        setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, upvotes: p.upvotes + 1 } : p))),
      pins,
      addPin: (p) => setPins((prev) => [...prev, { ...p, id: crypto.randomUUID(), reports: 1 }]),
      sharingLocation,
      setSharingLocation,
      recording,
      setRecording,
      sirenOn,
      setSirenOn,
      emergencyActive,
      setEmergencyActive,
      events,
      logEvent: (kind, message) =>
        setEvents((prev) => [
          {
            id: crypto.randomUUID(),
            kind,
            message,
            at: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          },
          ...prev,
        ]),
    }),
    [contacts, posts, pins, sharingLocation, recording, sirenOn, emergencyActive, events],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useSafeHer() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useSafeHer must be used inside SafeHerProvider");
  return ctx;
}
