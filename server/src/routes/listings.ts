import { Router } from "express"; import multer from "multer"; import { v2 as cloudinary } from "cloudinary"; import { z } from "zod"; import { Prisma } from "@prisma/client";
import { db } from "../db"; import { requireAuth, optionalAuth, AuthReq } from "../middleware";
cloudinary.config({ cloud_name: process.env.CLOUDINARY_CLOUD_NAME, api_key: process.env.CLOUDINARY_API_KEY, api_secret: process.env.CLOUDINARY_API_SECRET });
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8*1024*1024, files: 10 }, fileFilter: (_r, f, cb) => cb(null, /^image\/(jpeg|png|webp)$/.test(f.mimetype)) });
export const listings = Router();
const body = z.object({ title: z.string().min(5), description: z.string().min(20), price: z.coerce.number().int().positive(), type: z.enum(["HOUSE","APARTMENT","LAND","COMMERCIAL"]), mode: z.enum(["SALE","RENT"]), city: z.string().min(2), address: z.string().min(3), bedrooms: z.coerce.number().int().min(0).default(0), bathrooms: z.coerce.number().int().min(0).default(0), areaSqm: z.coerce.number().int().min(0).default(0), images: z.array(z.string().url()).max(10).default([]) });

// Public search: ?q=&city=&type=&mode=&minPrice=&maxPrice=&beds=&sort=&page=
listings.get("/", async (req, res) => {
  const { q, city, type, mode, minPrice, maxPrice, beds, sort = "new", page = "1" } = req.query as Record<string, string>;
  const where: Prisma.ListingWhereInput = { approved: true,
    ...(city && { city: { contains: city, mode: "insensitive" } }), ...(type && { type: type as any }), ...(mode && { mode: mode as any }),
    ...(beds && { bedrooms: { gte: +beds } }),
    ...((minPrice || maxPrice) && { price: { ...(minPrice && { gte: +minPrice }), ...(maxPrice && { lte: +maxPrice }) } }),
    ...(q && { OR: [{ title: { contains: q, mode: "insensitive" } }, { address: { contains: q, mode: "insensitive" } }] }) };
  const orderBy = sort === "price_asc" ? { price: "asc" } : sort === "price_desc" ? { price: "desc" } : { createdAt: "desc" };
  const take = 12, skip = (Math.max(+page, 1) - 1) * take;
  const [items, total] = await Promise.all([db.listing.findMany({ where, orderBy: orderBy as any, take, skip }), db.listing.count({ where })]);
  res.json({ items, total, pages: Math.ceil(total / take) });
});
listings.get("/mine", requireAuth("AGENT", "ADMIN"), async (req: AuthReq, res) => res.json(await db.listing.findMany({ where: { agentId: req.user!.id }, orderBy: { createdAt: "desc" } })));
listings.get("/:id", optionalAuth, async (req: AuthReq, res) => {
  const l = await db.listing.findUnique({ where: { id: req.params.id }, include: { agent: { select: { name: true, phone: true, email: true } } } });
  const canSee = l && (l.approved || req.user?.role === "ADMIN" || req.user?.id === l.agentId);
  if (!canSee) return res.status(404).json({ error: "Listing not found." });
  res.json(l);
});
listings.post("/images", requireAuth("AGENT", "ADMIN"), upload.array("images", 10), async (req, res) => {
  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length) return res.status(400).json({ error: "Upload JPG, PNG or WebP images up to 8 MB." });
  const urls = await Promise.all(files.map(f => new Promise<string>((ok, no) => cloudinary.uploader.upload_stream({ folder: "estatehub", transformation: [{ width: 1600, crop: "limit", quality: "auto", fetch_format: "auto" }] }, (e, r) => e ? no(e) : ok(r!.secure_url)).end(f.buffer))));
  res.json({ urls });
});
listings.post("/", requireAuth("AGENT", "ADMIN"), async (req: AuthReq, res) => {
  const p = body.safeParse(req.body); if (!p.success) return res.status(400).json({ error: p.error.issues[0].path.join(".") + ": " + p.error.issues[0].message });
  res.json(await db.listing.create({ data: { ...p.data, agentId: req.user!.id, approved: req.user!.role === "ADMIN" } }));
});
listings.put("/:id", requireAuth("AGENT", "ADMIN"), async (req: AuthReq, res) => {
  const l = await db.listing.findUnique({ where: { id: req.params.id } });
  if (!l || (l.agentId !== req.user!.id && req.user!.role !== "ADMIN")) return res.status(404).json({ error: "Listing not found." });
  const p = body.safeParse(req.body); if (!p.success) return res.status(400).json({ error: p.error.issues[0].message });
  res.json(await db.listing.update({ where: { id: l.id }, data: { ...p.data, approved: req.user!.role === "ADMIN" ? l.approved : false } }));
});
listings.delete("/:id", requireAuth("AGENT", "ADMIN"), async (req: AuthReq, res) => {
  const l = await db.listing.findUnique({ where: { id: req.params.id } });
  if (!l || (l.agentId !== req.user!.id && req.user!.role !== "ADMIN")) return res.status(404).json({ error: "Listing not found." });
  await db.listing.delete({ where: { id: l.id } }); res.json({ ok: true });
});
