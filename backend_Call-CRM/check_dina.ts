import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany({
        where: {
            OR: [
                { email: 'dina@mail.ru' },
                { phone: '+79990980078' }
            ]
        }
    });
    console.log(JSON.stringify(users, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
