"use client";
import { useEffect, useState } from "react"; import { api, Listing } from "@/lib/api"; import ListingCard from "@/components/ListingCard";
export default function Home() {
  const [f, setF] = useState({ city: "", type: "", mode: "", minPrice: "", maxPrice: "", beds: "", sort: "new" });
  const [data, setData] = useState<{ items: Listing[]; total: number; pages: number } | null>(null);
  const [saved, setSaved] = useState<string[]>([]); const [page, setPage] = useState(1); const [err, setErr] = useState("");
  const search = (p = 1) => { setPage(p); const qs = new URLSearchParams({ ...Object.fromEntries(Object.entries(f).filter(([, v]) => v)), page: String(p) });
    api(`/listings?${qs}`).then(setData).catch(e => setErr(e.message)); };
  useEffect(() => { search(); api<Listing[]>("/favorites").then(x => setSaved(x.map(i => i.id))).catch(() => {}); /* eslint-disable-next-line */ }, []);
  const set = (k: string) => (e: any) => setF({ ...f, [k]: e.target.value });
  return (<>
    <section className="bg-brand text-white"><div className="mx-auto max-w-6xl px-4 py-14">
      <h1 className="font-display text-4xl font-bold sm:text-5xl">Find a home you can trust.</h1>
      <p className="mt-3 max-w-xl text-white/90">Every listing comes from a registered agent and is checked by our team before it appears here.</p>
      <form onSubmit={e => { e.preventDefault(); search(); }} className="mt-8 grid gap-3 rounded-lg bg-white p-4 text-ink sm:grid-cols-2 lg:grid-cols-6">
        <div className="lg:col-span-2"><label className="label" htmlFor="city">Location</label><input id="city" className="input" placeholder="City or area" value={f.city} onChange={set("city")} /></div>
        <div><label className="label" htmlFor="type">Type</label><select id="type" className="input" value={f.type} onChange={set("type")}><option value="">Any</option><option value="HOUSE">House</option><option value="APARTMENT">Apartment</option><option value="LAND">Land</option><option value="COMMERCIAL">Commercial</option></select></div>
        <div><label className="label" htmlFor="mode">Buy or rent</label><select id="mode" className="input" value={f.mode} onChange={set("mode")}><option value="">Both</option><option value="SALE">Buy</option><option value="RENT">Rent</option></select></div>
        <div><label className="label" htmlFor="min">Min price</label><input id="min" type="number" className="input" value={f.minPrice} onChange={set("minPrice")} /></div>
        <div><label className="label" htmlFor="max">Max price</label><input id="max" type="number" className="input" value={f.maxPrice} onChange={set("maxPrice")} /></div>
        <button className="btn lg:col-span-6">Search properties</button></form></div></section>
    <section className="mx-auto max-w-6xl px-4 py-10">
      <div className="mb-6 flex items-center justify-between"><p className="font-semibold">{data ? `${data.total} properties` : "Loading…"}</p>
        <select aria-label="Sort" className="input !w-auto" value={f.sort} onChange={e => { f.sort = e.target.value; search(); }}><option value="new">Newest</option><option value="price_asc">Price: low to high</option><option value="price_desc">Price: high to low</option></select></div>
      {err && <p role="alert" className="text-brand">{err}</p>}
      {data?.items.length === 0 && <p className="rounded-lg bg-brand-soft p-8 text-center">No properties match. Try a wider price range or a different location.</p>}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{data?.items.map(l => <ListingCard key={l.id} l={l} saved={saved.includes(l.id)} />)}</div>
      {data && data.pages > 1 && <div className="mt-8 flex justify-center gap-3"><button className="btn-ghost" disabled={page <= 1} onClick={() => search(page - 1)}>Previous</button><button className="btn-ghost" disabled={page >= data.pages} onClick={() => search(page + 1)}>Next</button></div>}
    </section></>);
}
