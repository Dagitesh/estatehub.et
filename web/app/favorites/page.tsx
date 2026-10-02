"use client";
import { useEffect, useState } from "react"; import { api, Listing } from "@/lib/api"; import ListingCard from "@/components/ListingCard";
export default function Favs() {
  const [items, setItems] = useState<Listing[] | null>(null);
  useEffect(() => { api<Listing[]>("/favorites").then(setItems).catch(() => (window.location.href = "/login")); }, []);
  return (<div className="mx-auto max-w-6xl px-4 py-10"><h1 className="font-display text-3xl font-bold">Your favorites</h1>
    {items?.length === 0 && <p className="mt-6">Nothing saved yet. Tap the heart on any property to keep it here.</p>}
    <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items?.map(l => <ListingCard key={l.id} l={l} saved />)}</div></div>);
}
