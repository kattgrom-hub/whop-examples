import fs from "fs";
import path from "path";

const STORE_PATH = path.join(process.cwd(), "data", "users.json");

interface UserData {
  role: string;
  [key: string]: unknown;
}

function readStore(): Record<string, UserData> {
  try {
    const dir = path.dirname(STORE_PATH);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    if (!fs.existsSync(STORE_PATH)) return {};
    return JSON.parse(fs.readFileSync(STORE_PATH, "utf-8"));
  } catch {
    return {};
  }
}

function writeStore(data: Record<string, UserData>) {
  const dir = path.dirname(STORE_PATH);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(STORE_PATH, JSON.stringify(data, null, 2));
}

export function getUserRole(userId: string): string {
  const store = readStore();
  return store[userId]?.role || "angler";
}

export function setUserRole(userId: string, role: string) {
  const store = readStore();
  store[userId] = { ...store[userId], role };
  writeStore(store);
}
