import { Router } from "express"; import { z } from "zod"; import { db } from "../db";
export const contact = Router();
contact.post("/", async (req, res) => {
  const p = z.object({ name: z.string().min(2), email: z.string().email(), message: z.string().min(10).max(2000), listingId: z.string().optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues[0].message });
  await db.inquiry.create({ data: p.data }); res.json({ ok: true });
});
