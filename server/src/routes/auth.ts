import { Router } from "express"; import bcrypt from "bcryptjs"; import jwt from "jsonwebtoken"; import { z } from "zod"; import { db } from "../db"; import { requireAuth, AuthReq } from "../middleware";
export const auth = Router();
const sign = (u: any) => jwt.sign({ id: u.id, role: u.role }, process.env.JWT_SECRET!, { expiresIn: "7d" });
const pub = (u: any) => ({ id: u.id, name: u.name, email: u.email, role: u.role });
auth.post("/register", async (req, res) => {
  const p = z.object({ name: z.string().min(2), email: z.string().email(), password: z.string().min(8), role: z.enum(["BUYER","AGENT"]).default("BUYER"), phone: z.string().optional() }).safeParse(req.body);
  if (!p.success) return res.status(400).json({ error: p.error.issues[0].message });
  if (await db.user.findUnique({ where: { email: p.data.email } })) return res.status(409).json({ error: "An account with this email already exists." });
  const u = await db.user.create({ data: { ...p.data, password: await bcrypt.hash(p.data.password, 10) } });
  res.json({ token: sign(u), user: pub(u) });
});
auth.post("/login", async (req, res) => {
  const u = await db.user.findUnique({ where: { email: String(req.body.email) } });
  if (!u || !(await bcrypt.compare(String(req.body.password), u.password))) return res.status(401).json({ error: "Email or password is incorrect." });
  if (u.banned) return res.status(403).json({ error: "This account is suspended." });
  res.json({ token: sign(u), user: pub(u) });
});
auth.get("/me", requireAuth(), async (req: AuthReq, res) => res.json(pub(await db.user.findUniqueOrThrow({ where: { id: req.user!.id } }))));
