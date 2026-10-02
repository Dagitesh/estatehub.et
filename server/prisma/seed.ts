import { PrismaClient } from "@prisma/client"; import bcrypt from "bcryptjs";
const db = new PrismaClient();
(async () => {
  const pw = await bcrypt.hash("password123", 10);
  await db.user.upsert({ where:{email:"admin@estatehub.com"}, update:{}, create:{name:"Admin",email:"admin@estatehub.com",password:pw,role:"ADMIN"} });
  const agent = await db.user.upsert({ where:{email:"agent@estatehub.com"}, update:{}, create:{name:"Sara Tesfaye",email:"agent@estatehub.com",password:pw,role:"AGENT",phone:"+251911000000"} });
  await db.listing.create({ data:{ title:"Bright 3-bedroom apartment in Bole", description:"Corner unit with a balcony, covered parking and 24h security.", price:9500000, type:"APARTMENT", mode:"SALE", city:"Addis Ababa", address:"Bole, near Edna Mall", bedrooms:3, bathrooms:2, areaSqm:140, images:[], approved:true, agentId:agent.id }});
  console.log("Seeded. admin@estatehub.com / password123");
})();
