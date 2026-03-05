import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
prisma.user.findMany({ select: { email: true } })
  .then(users => { console.log(users); })
  .finally(() => prisma.\());
