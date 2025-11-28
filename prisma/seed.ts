import { hashPassword } from '../lib/argon2';
import { PrismaClient, Role } from '@prisma/client';
const prisma = new PrismaClient()

async function main() {
    console.log('Seeding database...');
    // Create a superadmin user if it doesn't exist
    await prisma.$transaction(async (tx) => {
        const user = await tx.user.upsert({
            where: { email: 'simplexity@simplexity.com' },
            update: {},
            create: {
                name: 'Simplexity',
                email: 'simplexity@Simplexity.com',
                role: Role.ADMIN,
                emailVerified: true,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        })

        const password = await hashPassword('Simplexity123!');

        // account
        await tx.account.create({
            data: {
                userId: user.id,
                providerId: 'credential',
                accountId: user.id,
                password,
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        });

    });
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
