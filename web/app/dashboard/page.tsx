"use client";
import { useEffect, useState } from "react"; import { api, Listing, money } from "@/lib/api";
const blank = { title: "", description: "", price: "", type: "APARTMENT", mode: "SALE", city: "", address: "", bedrooms: "0", bathrooms: "0", areaSqm: "0", images: [] as string[] };
export default function Dashboard() {
  const [items, setItems] = useState<Listing[]>([]); const [f, setF] = useState<any>(null); const [editId, setEditId] = useState<string | null>(null); const [err, setErr] = useState(""); const [up, setUp] = useState(false);
  const load = () => api<Listing[]>("/listings/mine").then(setItems).catch(() => (window.location.href = "/login"));
  useEffect(() => { load(); }, []);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  async function upload(files: FileList | null) { if (!files?.length) return; setUp(true); setErr(""); const fd = new FormData(); Array.from(files).forEach(x => fd.append("images", x));
    try { const r = await api<{ urls: string[] }>("/listings/images", { method: "POST", form: fd }); setF({ ...f, images: [...f.images, ...r.urls].slice(0, 10) }); } catch (x: any) { setErr(x.message); } setUp(false); }
  async function save(e: React.FormEvent) { e.preventDefault(); setErr("");
    try { await api(editId ? `/listings/${editId}` : "/listings", { method: editId ? "PUT" : "POST", body: f }); setF(null); setEditId(null); load(); } catch (x: any) { setErr(x.message); } }
  async function del(id: string) { if (confirm("Delete this listing? This can't be undone.")) { await api(`/listings/${id}`, { method: "DELETE" }); load(); } }
  if (f) return (<form onSubmit={save} className="mx-auto max-w-2xl space-y-4 px-4 py-10"><h1 className="font-display text-3xl font-bold">{editId ? "Edit listing" : "New listing"}</h1>
    <div><label className="label">Title</label><input className="input" required value={f.title} onChange={set("title")} /></div>
    <div><label className="label">Description</label><textarea className="input" rows={5} required value={f.description} onChange={set("description")} /></div>
    <div className="grid grid-cols-2 gap-4"><div><label className="label">Price (ETB)</label><input type="number" className="input" required value={f.price} onChange={set("price")} /></div>
      <div><label className="label">Buy or rent</label><select className="input" value={f.mode} onChange={set("mode")}><option value="SALE">For sale</option><option value="RENT">For rent (per month)</option></select></div>
      <div><label className="label">Type</label><select className="input" value={f.type} onChange={set("type")}><option value="HOUSE">House</option><option value="APARTMENT">Apartment</option><option value="LAND">Land</option><option value="COMMERCIAL">Commercial</option></select></div>
      <div><label className="label">City</label><input className="input" required value={f.city} onChange={set("city")} /></div></div>
    <div><label className="label">Address</label><input className="input" required value={f.address} onChange={set("address")} /></div>
    <div className="grid grid-cols-3 gap-4">{["bedrooms", "bathrooms", "areaSqm"].map(k => <div key={k}><label className="label">{k === "areaSqm" ? "Area (m²)" : k}</label><input type="number" min={0} className="input" value={f[k]} onChange={set(k)} /></div>)}</div>
    <div><label className="label">Photos (up to 10, JPG/PNG/WebP, 8 MB each)</label><input type="file" accept="image/*" multiple onChange={e => upload(e.target.files)} />{up && <p className="text-sm">Uploading…</p>}
      <div className="mt-2 flex flex-wrap gap-2">{f.images.map((u: string) => <div key={u} className="relative"><img src={u} alt="" className="h-20 w-28 rounded object-cover" /><button type="button" aria-label="Remove photo" className="absolute right-1 top-1 rounded-full bg-white px-1.5 text-brand" onClick={() => setF({ ...f, images: f.images.filter((x: string) => x !== u) })}>×</button></div>)}</div></div>
    {err && <p role="alert" className="text-brand">{err}</p>}
    <div className="flex gap-3"><button className="btn">Save listing</button><button type="button" className="btn-ghost" onClick={() => { setF(null); setEditId(null); }}>Cancel</button></div>
    <p className="text-sm text-neutral-600">New and edited listings go live once an admin approves them.</p></form>);
  return (<div className="mx-auto max-w-5xl px-4 py-10"><div className="flex items-center justify-between"><h1 className="font-display text-3xl font-bold">My listings</h1><button className="btn" onClick={() => setF({ ...blank })}>Add a listing</button></div>
    {items.length === 0 && <p className="mt-8 rounded-lg bg-brand-soft p-8 text-center">No listings yet. Add your first property to start getting inquiries.</p>}
    <ul className="mt-6 divide-y rounded-lg border">{items.map(l => <li key={l.id} className="flex flex-wrap items-center justify-between gap-3 p-4"><div><p className="font-semibold">{l.title}</p><p className="text-sm text-neutral-600">{money(l.price, l.mode)} · {l.approved ? "Live" : "Waiting for approval"}</p></div>
      <div className="flex gap-2"><button className="btn-ghost !py-1.5" onClick={() => { setEditId(l.id); setF({ ...l, price: String(l.price) }); }}>Edit</button><button className="btn !py-1.5" onClick={() => del(l.id)}>Delete</button></div></li>)}</ul></div>);
}
