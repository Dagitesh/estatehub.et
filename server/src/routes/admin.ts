import { Router } from "express"; import { db } from "../db"; import { requireAuth } from "../middleware";
export const admin = Router(); admin.use(requireAuth("ADMIN"));
admin.get("/stats", async (_q, res) => { const [users, agents, listings, pending, inquiries] = await Promise.all([db.user.count(), db.user.count({ where: { role: "AGENT" } }), db.listing.count(), db.listing.count({ where: { approved: false } }), db.inquiry.count()]); res.json({ users, agents, listings, pending, inquiries }); });
admin.get("/pending", async (_q, res) => res.json(await db.listing.findMany({ where: { approved: false }, include: { agent: { select: { name: true, email: true } } }, orderBy: { createdAt: "asc" } })));
admin.post("/listings/:id/approve", async (req, res) => res.json(await db.listing.update({ where: { id: req.params.id }, data: { approved: true } })));
admin.get("/users", async (_q, res) => res.json(await db.user.findMany({ select: { id: true, name: true, email: true, role: true, banned: true, createdAt: true }, orderBy: { createdAt: "desc" } })));
admin.post("/users/:id/ban", async (req, res) => res.json(await db.user.update({ where: { id: req.params.id }, data: { banned: !!req.body.banned } })));
admin.get("/inquiries", async (_q, res) => res.json(await db.inquiry.findMany({ orderBy: { createdAt: "desc" }, take: 100 })));
