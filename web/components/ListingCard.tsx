"use client";
import Link from "next/link"; import { useState } from "react"; import { api, Listing, money, token } from "@/lib/api";
export default function ListingCard({ l, saved = false }: { l: Listing; saved?: boolean }) {
  const [fav, setFav] = useState(saved);
  async function toggle() {
    if (!token()) return (window.location.href = "/login");
    await api(`/favorites/${l.id}`, { method: fav ? "DELETE" : "POST" }); setFav(!fav);
  }
  return (
    <article className="group overflow-hidden rounded-lg border border-neutral-200 bg-white">
      <div className="relative aspect-[4/3] bg-neutral-100">
        {l.images[0] ? <img src={l.images[0]} alt={l.title} className="h-full w-full object-cover" /> : <div className="grid h-full place-items-center text-neutral-400">No photos yet</div>}
        <span className="absolute left-3 top-3 rounded bg-brand px-2 py-1 text-xs font-semibold text-white">For {l.mode === "RENT" ? "rent" : "sale"}</span>
        <button onClick={toggle} aria-pressed={fav} aria-label={fav ? "Remove from favorites" : "Save to favorites"} className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white text-lg text-brand shadow">{fav ? "♥" : "♡"}</button>
      </div>
      <Link href={`/listings/${l.id}`} className="block p-4">
        <p className="font-display text-xl font-bold text-brand">{money(l.price, l.mode)}</p>
        <h3 className="mt-1 line-clamp-1 font-semibold">{l.title}</h3>
        <p className="text-sm text-neutral-600">{l.address}, {l.city}</p>
        <p className="mt-2 text-sm text-neutral-700">{l.bedrooms} bd · {l.bathrooms} ba · {l.areaSqm} m²</p>
      </Link>
    </article>
  );
}
