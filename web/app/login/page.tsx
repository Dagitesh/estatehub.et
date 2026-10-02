"use client";
import { useState } from "react"; import { api } from "@/lib/api";
export default function Login() {
  const [reg, setReg] = useState(false); const [f, setF] = useState({ name: "", email: "", password: "", role: "BUYER" }); const [err, setErr] = useState(""); const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setBusy(true); setErr("");
    try { const r = await api(reg ? "/auth/register" : "/auth/login", { method: "POST", body: f }); localStorage.setItem("token", r.token); window.location.href = r.user.role === "ADMIN" ? "/admin" : r.user.role === "AGENT" ? "/dashboard" : "/"; }
    catch (x: any) { setErr(x.message); setBusy(false); } }
  return (<div className="mx-auto max-w-md px-4 py-14"><h1 className="font-display text-3xl font-bold">{reg ? "Create your account" : "Welcome back"}</h1>
    <form onSubmit={submit} className="mt-6 space-y-4">
      {reg && <><div><label className="label" htmlFor="n">Full name</label><input id="n" className="input" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
        <div><label className="label" htmlFor="r">I want to</label><select id="r" className="input" value={f.role} onChange={e => setF({ ...f, role: e.target.value })}><option value="BUYER">Find a property</option><option value="AGENT">List properties as an agent</option></select></div></>}
      <div><label className="label" htmlFor="e">Email</label><input id="e" type="email" className="input" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
      <div><label className="label" htmlFor="p">Password {reg && "(8+ characters)"}</label><input id="p" type="password" className="input" required minLength={reg ? 8 : 1} value={f.password} onChange={e => setF({ ...f, password: e.target.value })} /></div>
      {err && <p role="alert" className="text-sm text-brand">{err}</p>}
      <button className="btn w-full" disabled={busy}>{reg ? "Create account" : "Log in"}</button></form>
    <button className="mt-4 text-sm text-brand underline" onClick={() => setReg(!reg)}>{reg ? "I already have an account" : "New here? Create an account"}</button></div>);
}
