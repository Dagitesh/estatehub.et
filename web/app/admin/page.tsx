"use client";
import { useEffect, useState } from "react"; import Link from "next/link"; import { api, money } from "@/lib/api";
export default function Admin() {
  const [s, setS] = useState<any>(null); const [pending, setP] = useState<any[]>([]); const [users, setU] = useState<any[]>([]); const [inq, setI] = useState<any[]>([]);
  const load = async () => { try { const [a, b, c, d] = await Promise.all([api("/admin/stats"), api("/admin/pending"), api("/admin/users"), api("/admin/inquiries")]); setS(a); setP(b); setU(c); setI(d); } catch { window.location.href = "/login"; } };
  useEffect(() => { load(); }, []);
  const stat = [["Users", s?.users], ["Agents", s?.agents], ["Listings", s?.listings], ["Awaiting approval", s?.pending], ["Messages", s?.inquiries]];
  return (<div className="mx-auto max-w-6xl px-4 py-10"><h1 className="font-display text-3xl font-bold">Admin dashboard</h1>
    <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-5">{stat.map(([k, v]) => <div key={k as string} className="rounded-lg bg-brand p-4 text-white"><p className="font-display text-3xl font-bold">{v ?? "–"}</p><p className="text-sm">{k}</p></div>)}</div>
    <h2 className="mt-10 text-xl font-semibold">Listings to review</h2>
    {pending.length === 0 ? <p className="mt-2 text-neutral-600">Nothing waiting. All listings are reviewed.</p> : <ul className="mt-3 divide-y rounded-lg border">{pending.map(l => <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><Link href={`/listings/${l.id}`} className="font-semibold underline">{l.title}</Link><p className="text-sm text-neutral-600">{money(l.price, l.mode)} · by {l.agent.name}</p></div>
      <div className="flex gap-2"><button className="btn !py-1.5" onClick={async () => { await api(`/admin/listings/${l.id}/approve`, { method: "POST" }); load(); }}>Approve</button><button className="btn-ghost !py-1.5" onClick={async () => { if (confirm("Reject and delete this listing?")) { await api(`/listings/${l.id}`, { method: "DELETE" }); load(); } }}>Reject</button></div></li>)}</ul>}
    <h2 className="mt-10 text-xl font-semibold">Users</h2>
    <div className="mt-3 overflow-x-auto rounded-lg border"><table className="w-full text-left text-sm"><thead className="bg-brand-soft"><tr><th className="p-3">Name</th><th>Email</th><th>Role</th><th></th></tr></thead><tbody>{users.map(u => <tr key={u.id} className="border-t"><td className="p-3">{u.name}</td><td>{u.email}</td><td>{u.role.toLowerCase()}</td><td>{u.role !== "ADMIN" && <button className="text-brand underline" onClick={async () => { await api(`/admin/users/${u.id}/ban`, { method: "POST", body: { banned: !u.banned } }); load(); }}>{u.banned ? "Restore" : "Suspend"}</button>}</td></tr>)}</tbody></table></div>
    <h2 className="mt-10 text-xl font-semibold">Messages</h2>
    <ul className="mt-3 space-y-3">{inq.map(m => <li key={m.id} className="rounded-lg border p-4 text-sm"><p className="font-semibold">{m.name} · {m.email}</p><p className="mt-1">{m.message}</p></li>)}</ul></div>);
}
