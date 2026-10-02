export default function About() {
  const points = [["Verified agents", "Agents register with us and every listing is reviewed before it is published."], ["Honest search", "Filter by price, location, type and bedrooms. Prices are shown as listed, with no hidden fees."], ["Save and compare", "Keep favorites in your account and come back when you are ready."], ["Real people", "Message the team about any property and get a reply within one working day."]];
  return (<div className="mx-auto max-w-3xl px-4 py-14"><h1 className="font-display text-4xl font-bold">About EstateHub</h1>
    <p className="mt-4 text-lg leading-relaxed">Searching for property is stressful when you can't tell which listings are real. EstateHub exists to fix that: fewer fake ads, clear prices, and agents you can reach.</p>
    <div className="mt-10 grid gap-5 sm:grid-cols-2">{points.map(([t, d]) => <div key={t} className="rounded-lg border-l-4 border-brand bg-brand-soft p-5"><h2 className="font-semibold">{t}</h2><p className="mt-1 text-sm">{d}</p></div>)}</div>
    <p className="mt-10">Are you an agent? <a className="font-semibold text-brand underline" href="/login">Create an account</a> and publish your first listing in minutes.</p></div>);
}
