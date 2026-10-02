"use client";
import { useState } from "react"; import { api } from "@/lib/api";
export default function Contact() {
  const [f, setF] = useState({ name: "", email: "", message: "" }); const [state, setState] = useState<"idle" | "sent" | string>("idle");
  return (<div className="mx-auto grid max-w-5xl gap-10 px-4 py-14 md:grid-cols-2"><div><h1 className="font-display text-4xl font-bold">Contact us</h1>
    <p className="mt-4">Questions about a listing, your account or becoming an agent? Send a message and we'll reply within one working day.</p>
    <p className="mt-6 text-sm">support@estatehub.com<br />Mon–Sat, 8:00–18:00</p></div>
    {state === "sent" ? <p role="status" className="h-fit rounded-lg bg-brand-soft p-6">Thanks, your message has been sent.</p> :
    <form className="space-y-4" onSubmit={async e => { e.preventDefault(); try { await api("/contact", { method: "POST", body: f }); setState("sent"); } catch (x: any) { setState(x.message); } }}>
      <div><label className="label" htmlFor="n">Name</label><input id="n" className="input" required value={f.name} onChange={e => setF({ ...f, name: e.target.value })} /></div>
      <div><label className="label" htmlFor="e">Email</label><input id="e" type="email" className="input" required value={f.email} onChange={e => setF({ ...f, email: e.target.value })} /></div>
      <div><label className="label" htmlFor="m">Message</label><textarea id="m" rows={5} className="input" required minLength={10} value={f.message} onChange={e => setF({ ...f, message: e.target.value })} /></div>
      {state !== "idle" && <p role="alert" className="text-sm text-brand">{state}</p>}<button className="btn">Send message</button></form>}</div>);
}
