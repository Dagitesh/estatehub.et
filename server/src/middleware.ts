import { Request, Response, NextFunction } from "express"; import jwt from "jsonwebtoken";
export type AuthReq = Request & { user?: { id: string; role: "BUYER"|"AGENT"|"ADMIN" } };
export const requireAuth = (...roles: string[]) => (req: AuthReq, res: Response, next: NextFunction) => {
  const t = req.headers.authorization?.replace("Bearer ", "");
  if (!t) return res.status(401).json({ error: "Please log in." });
  try { req.user = jwt.verify(t, process.env.JWT_SECRET!) as any; } catch { return res.status(401).json({ error: "Session expired. Log in again." }); }
  if (roles.length && !roles.includes(req.user!.role)) return res.status(403).json({ error: "You don't have access to this." });
  next();
};
export const optionalAuth = (req: AuthReq, _r: Response, next: NextFunction) => {
  const t = req.headers.authorization?.replace("Bearer ", "");
  try { if (t) req.user = jwt.verify(t, process.env.JWT_SECRET!) as any; } catch {}
  next();
};
