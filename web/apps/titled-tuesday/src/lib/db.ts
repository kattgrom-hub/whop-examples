import { put, list } from "@vercel/blob";

// ── Blob helpers ────────────────────────────────────────────────────────────

async function writeBlob(path: string, data: unknown): Promise<void> {
  await put(path, JSON.stringify(data), {
    access: "public",
    addRandomSuffix: false,
    contentType: "application/json",
  });
}

async function readBlob<T>(path: string): Promise<T | null> {
  const { blobs } = await list({ prefix: path, limit: 1 });
  const blob = blobs.find((b) => b.pathname === path);
  if (!blob) return null;
  const res = await fetch(blob.downloadUrl);
  if (!res.ok) return null;
  return res.json() as Promise<T>;
}

async function listBlobs<T>(prefix: string): Promise<T[]> {
  const allBlobs: { downloadUrl: string }[] = [];
  let cursor: string | undefined;
  do {
    const result = await list({ prefix, cursor });
    allBlobs.push(...result.blobs);
    cursor = result.hasMore ? result.cursor : undefined;
  } while (cursor);

  const items = await Promise.all(
    allBlobs.map((b) => fetch(b.downloadUrl).then((r) => r.json() as Promise<T>))
  );
  return items;
}

// ── Users ───────────────────────────────────────────────────────────────────

interface UserRecord {
  id: string;
  username: string;
  email: string;
  name?: string | null;
  profile_pic?: string | null;
  role: string;
  whop_company_id?: string | null;
  created_at: string;
  updated_at: string;
}

export async function upsertUser(user: {
  id: string;
  username: string;
  email: string;
  name?: string | null;
  profile_pic?: string | null;
  role?: string;
  whop_company_id?: string | null;
}) {
  const existing = await readBlob<UserRecord>(`users/${user.id}.json`);
  const now = new Date().toISOString();
  const record: UserRecord = {
    id: user.id,
    username: user.username,
    email: user.email,
    name: user.name ?? existing?.name ?? null,
    profile_pic: user.profile_pic ?? existing?.profile_pic ?? null,
    role: user.role ?? existing?.role ?? "player",
    whop_company_id: user.whop_company_id ?? existing?.whop_company_id ?? null,
    created_at: existing?.created_at ?? now,
    updated_at: now,
  };
  await writeBlob(`users/${user.id}.json`, record);
  return record;
}

export async function getUserRole(userId: string): Promise<string> {
  const user = await readBlob<UserRecord>(`users/${userId}.json`);
  return user?.role || "player";
}

export async function setUserRole(userId: string, role: string): Promise<void> {
  const user = await readBlob<UserRecord>(`users/${userId}.json`);
  if (!user) return;
  user.role = role;
  user.updated_at = new Date().toISOString();
  await writeBlob(`users/${userId}.json`, user);
}

// ── Tournaments ─────────────────────────────────────────────────────────────

interface TournamentRow {
  id: string;
  whop_plan_id: string | null;
  title: string;
  description: string | null;
  date: string;
  time: string;
  entry_fee: number;
  max_players: number;
  organizer_id: string;
  organizer_name: string;
  prize_structure: Record<string, number>;
  status: string;
  results: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

export async function createTournament(t: {
  id: string;
  whop_plan_id?: string;
  title: string;
  description?: string;
  date: string;
  time: string;
  entry_fee: number;
  max_players: number;
  organizer_id: string;
  organizer_name: string;
  prize_structure: Record<string, number>;
}): Promise<TournamentRow> {
  const now = new Date().toISOString();
  const record: TournamentRow = {
    id: t.id,
    whop_plan_id: t.whop_plan_id ?? null,
    title: t.title,
    description: t.description ?? null,
    date: t.date,
    time: t.time,
    entry_fee: t.entry_fee,
    max_players: t.max_players,
    organizer_id: t.organizer_id,
    organizer_name: t.organizer_name,
    prize_structure: t.prize_structure,
    status: "upcoming",
    results: null,
    created_at: now,
    updated_at: now,
  };
  await writeBlob(`tournaments/${t.id}.json`, record);
  return record;
}

export async function getTournament(id: string): Promise<TournamentRow | null> {
  return readBlob<TournamentRow>(`tournaments/${id}.json`);
}

export async function listTournaments(): Promise<TournamentRow[]> {
  const all = await listBlobs<TournamentRow>("tournaments/");
  return all
    .filter((t) => t.status !== "cancelled")
    .sort((a, b) => {
      if (a.status === "upcoming" && b.status !== "upcoming") return -1;
      if (a.status !== "upcoming" && b.status === "upcoming") return 1;
      return new Date(`${a.date} ${a.time}`).getTime() - new Date(`${b.date} ${b.time}`).getTime();
    });
}

export async function listTournamentsByOrganizer(organizerId: string): Promise<TournamentRow[]> {
  const all = await listBlobs<TournamentRow>("tournaments/");
  return all
    .filter((t) => t.organizer_id === organizerId)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function updateTournament(
  id: string,
  updates: Partial<Pick<TournamentRow, "title" | "description" | "date" | "time" | "entry_fee" | "max_players" | "prize_structure" | "status">>
): Promise<TournamentRow | null> {
  const current = await getTournament(id);
  if (!current) return null;

  const updated: TournamentRow = {
    ...current,
    ...updates,
    updated_at: new Date().toISOString(),
  };
  await writeBlob(`tournaments/${id}.json`, updated);
  return updated;
}

export async function setTournamentResults(id: string, results: Record<string, unknown>): Promise<void> {
  const current = await getTournament(id);
  if (!current) return;
  current.results = results;
  current.status = "completed";
  current.updated_at = new Date().toISOString();
  await writeBlob(`tournaments/${id}.json`, current);
}

export async function cancelTournament(id: string): Promise<void> {
  const current = await getTournament(id);
  if (!current) return;
  current.status = "cancelled";
  current.updated_at = new Date().toISOString();
  await writeBlob(`tournaments/${id}.json`, current);
}

// ── Payout Requests ─────────────────────────────────────────────────────────

interface PayoutRequestRow {
  id: string;
  requester_id: string;
  requester_company_id: string;
  requester_name: string;
  amount: number;
  currency: string;
  reason: string;
  tournament_id: string | null;
  tournament_title: string | null;
  place: number | null;
  status: string;
  transfer_id: string | null;
  resolved_at: string | null;
  resolved_by: string | null;
  denial_reason: string | null;
  created_at: string;
}

export async function createPayoutRequest(r: {
  id: string;
  requester_id: string;
  requester_company_id: string;
  requester_name: string;
  amount: number;
  reason: string;
  tournament_id?: string | null;
  tournament_title?: string | null;
  place?: number | null;
}): Promise<PayoutRequestRow> {
  const record: PayoutRequestRow = {
    id: r.id,
    requester_id: r.requester_id,
    requester_company_id: r.requester_company_id,
    requester_name: r.requester_name,
    amount: r.amount,
    currency: "usd",
    reason: r.reason,
    tournament_id: r.tournament_id ?? null,
    tournament_title: r.tournament_title ?? null,
    place: r.place ?? null,
    status: "pending",
    transfer_id: null,
    resolved_at: null,
    resolved_by: null,
    denial_reason: null,
    created_at: new Date().toISOString(),
  };
  await writeBlob(`payout-requests/${r.id}.json`, record);
  return record;
}

export async function getPayoutRequest(id: string): Promise<PayoutRequestRow | null> {
  return readBlob<PayoutRequestRow>(`payout-requests/${id}.json`);
}

export async function listPayoutRequests(userId?: string): Promise<PayoutRequestRow[]> {
  const all = await listBlobs<PayoutRequestRow>("payout-requests/");
  const filtered = userId ? all.filter((r) => r.requester_id === userId) : all;
  return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

export async function approvePayoutRequest(id: string, transferId: string, adminUserId?: string): Promise<void> {
  const req = await getPayoutRequest(id);
  if (!req || req.status !== "pending") return;
  req.status = "approved";
  req.transfer_id = transferId;
  req.resolved_at = new Date().toISOString();
  req.resolved_by = adminUserId ?? "admin";
  await writeBlob(`payout-requests/${id}.json`, req);
}

export async function denyPayoutRequest(id: string, reason?: string, adminUserId?: string): Promise<void> {
  const req = await getPayoutRequest(id);
  if (!req || req.status !== "pending") return;
  req.status = "denied";
  req.denial_reason = reason ?? "Denied by admin";
  req.resolved_at = new Date().toISOString();
  req.resolved_by = adminUserId ?? "admin";
  await writeBlob(`payout-requests/${id}.json`, req);
}
