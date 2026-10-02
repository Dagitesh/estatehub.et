"use client";
import Link from "next/link"; import { useUser } from "@/lib/api";
export default function Nav() {
  const { user, ready } = useUser();
  const out = () => { localStorage.removeItem("token"); window.location.href = "/"; };
  return (<header className="sticky top-0 z-20 border-b border-neutral-200 bg-white/95 backdrop-blur"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
    <Link href="/" className="font-display text-2xl font-bold">Estate<span className="text-brand">Hub</span></Link>
    <nav className="flex flex-wrap items-center gap-5 text-sm font-medium">
      <Link href="/">Browse</Link><Link href="/about">About</Link><Link href="/contact">Contact</Link>
      {ready && user && <Link href="/favorites">Favorites</Link>}
      {user && user.role !== "BUYER" && <Link href="/dashboard">My listings</Link>}
      {user?.role === "ADMIN" && <Link href="/admin">Admin</Link>}
      {ready && (user ? <button onClick={out} className="btn-ghost !py-1.5">Log out</button> : <Link href="/login" className="btn !py-1.5">Log in</Link>)}
    </nav></div></header>);
}
