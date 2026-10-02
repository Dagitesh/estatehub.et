"use client";
import { useEffect, useState } from "react"; import { useParams } from "next/navigation"; import { api, Listing, money } from "@/lib/api";
export default function Detail() {
  const { id } = useParams<{ id: string }>(); const [l, setL] = useState<Listing | null>(null); const [err, setErr] = useState(""); const [img, setImg] = useState(0);
  const [m, setM] = useState({ name: "", email: "", message: "" }); const [sent, setSent] = useState(false);
  useEffect(() => { api<Listing>(`/listings/${id}`).then(setL).catch(e => setErr(e.message)); }, [id]);
  if (err) return <p className="p-10 text-center">{err}</p>; if (!l) return <p className="p-10 text-center">Loading…</p>;
  return (<div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 lg:grid-cols-3">
    <div className="lg:col-span-2">
      <div className="aspect-[16/10] overflow-hidden rounded-lg bg-neutral-100">{l.images[img] ? <img src={l.images[img]} alt={l.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-neutral-400">No photos yet</div>}</div>
      <div className="mt-3 flex gap-2 overflow-x-auto">{l.images.map((u, i) => <button key={u} onClick={() => setImg(i)} aria-label={`Photo ${i + 1}`}><img src={u} alt="" className={`h-16 w-24 rounded object-cover ${i === img ? "ring-2 ring-brand" : ""}`} /></button>)}</div>
      <h1 className="mt-6 font-display text-3xl font-bold">{l.title}</h1>
      <p className="text-neutral-600">{l.address}, {l.city}</p>
      <p className="mt-2 font-display text-3xl font-bold text-brand">{money(l.price, l.mode)}</p>
      <dl className="mt-4 grid grid-cols-4 gap-3 rounded-lg bg-brand-soft p-4 text-center text-sm"><div><dt>Type</dt><dd className="font-semibold">{l.type.toLowerCase()}</dd></div><div><dt>Bedrooms</dt><dd className="font-semibold">{l.bedrooms}</dd></div><div><dt>Bathrooms</dt><dd className="font-semibold">{l.bathrooms}</dd></div><div><dt>Area</dt><dd className="font-semibold">{l.areaSqm} m²</dd></div></dl>
      <p className="mt-6 max-w-prose whitespace-pre-line leading-relaxed">{l.description}</p></div>
    <aside className="h-fit rounded-lg border border-neutral-200 p-5">
      <p className="font-semibold">Listed by {l.agent?.name}</p>{l.agent?.phone && <a className="text-brand" href={`tel:${l.agent.phone}`}>{l.agent.phone}</a>}
      {sent ? <p role="status" className="mt-4 rounded bg-brand-soft p-3">Message sent. The team will pass it to the agent.</p> :
      <form className="mt-4 space-y-3" onSubmit={async e => { e.preventDefault(); try { await api("/contact", { method: "POST", body: { ...m, listingId: l.id } }); setSent(true); } catch (x: any) { setErr(x.message); } }}>
        <input className="input" placeholder="Your name" required value={m.name} onChange={e => setM({ ...m, name: e.target.value })} />
        <input className="input" type="email" placeholder="Email" required value={m.email} onChange={e => setM({ ...m, email: e.target.value })} />
        <textarea className="input" rows={4} placeholder="I'm interested in this property…" required minLength={10} value={m.message} onChange={e => setM({ ...m, message: e.target.value })} />
        <button className="btn w-full">Ask about this property</button></form>}
    </aside></div>);
}
