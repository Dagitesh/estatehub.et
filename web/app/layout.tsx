import "./globals.css"; import type { Metadata } from "next"; import { Bricolage_Grotesque, Manrope } from "next/font/google"; import Nav from "@/components/Nav"; import Link from "next/link";
const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body" });
export const metadata: Metadata = { title: "EstateHub – Find a home you can trust", description: "Verified property listings from licensed agents. Search by price, location and type." };
export default function Root({ children }: { children: React.ReactNode }) {
  return (<html lang="en" className={`${display.variable} ${body.variable}`}><body className="font-sans">
    <Nav /><main className="min-h-[70vh]">{children}</main>
    <footer className="mt-20 bg-ink text-neutral-300"><div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3">
      <div><p className="font-display text-2xl font-bold text-white">Estate<span className="text-brand">Hub</span></p><p className="mt-2 text-sm">Every listing is reviewed by our team before it goes live.</p></div>
      <nav className="flex flex-col gap-2 text-sm"><Link href="/">Browse properties</Link><Link href="/about">About us</Link><Link href="/contact">Contact us</Link><Link href="/login">List your property</Link></nav>
      <p className="text-sm">support@estatehub.com<br />Mon–Sat, 8:00–18:00</p></div>
      <p className="border-t border-neutral-700 py-4 text-center text-xs">© {new Date().getFullYear()} EstateHub</p></footer>
  </body></html>);
}
