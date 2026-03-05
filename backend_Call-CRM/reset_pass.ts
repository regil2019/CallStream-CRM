import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
const prisma = new PrismaClient();

async function main() {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await prisma.user.update({
        where: { email: 'orlanda@mail.ru' },
        data: { password: hashedPassword }
    });
    console.log('Password for orlanda@mail.ru reset to: 123456');
}

main()
    .catch(e => console.error(e))
    .finally(() => prisma.$disconnect());
