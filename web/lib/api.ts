"use client";
import { useEffect, useState } from "react";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export type User = { id: string; name: string; email: string; role: "BUYER" | "AGENT" | "ADMIN" };
export type Listing = { id: string; title: string; description: string; price: number; type: string; mode: string; city: string; address: string; bedrooms: number; bathrooms: number; areaSqm: number; images: string[]; approved: boolean; agent?: { name: string; phone?: string; email: string } };
export const token = () => (typeof window === "undefined" ? null : localStorage.getItem("token"));
export async function api<T = any>(path: string, opts: { method?: string; body?: any; form?: FormData } = {}): Promise<T> {
  const headers: Record<string, string> = {}; const t = token();
  if (t) headers.Authorization = `Bearer ${t}`;
  if (opts.body) headers["Content-Type"] = "application/json";
  const res = await fetch(API + path, { method: opts.method || "GET", headers, body: opts.form || (opts.body ? JSON.stringify(opts.body) : undefined) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || "Something went wrong. Try again.");
  return data;
}
export function useUser() {
  const [user, setUser] = useState<User | null>(null); const [ready, setReady] = useState(false);
  useEffect(() => { if (!token()) return setReady(true); api<User>("/auth/me").then(setUser).catch(() => localStorage.removeItem("token")).finally(() => setReady(true)); }, []);
  return { user, ready };
}
export const money = (n: number, mode?: string) => `ETB ${n.toLocaleString()}${mode === "RENT" ? "/mo" : ""}`;
