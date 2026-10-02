import { Router } from "express"; import { db } from "../db"; import { requireAuth, AuthReq } from "../middleware";
export const favorites = Router(); favorites.use(requireAuth());
favorites.get("/", async (req: AuthReq, res) => res.json((await db.favorite.findMany({ where: { userId: req.user!.id }, include: { listing: true } })).map(f => f.listing)));
favorites.post("/:id", async (req: AuthReq, res) => { const k = { userId: req.user!.id, listingId: req.params.id }; await db.favorite.upsert({ where: { userId_listingId: k }, update: {}, create: k }); res.json({ saved: true }); });
favorites.delete("/:id", async (req: AuthReq, res) => { await db.favorite.deleteMany({ where: { userId: req.user!.id, listingId: req.params.id } }); res.json({ saved: false }); });
