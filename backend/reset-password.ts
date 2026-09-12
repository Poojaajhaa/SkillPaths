import { PrismaClient } from "./generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function resetPassword(email?: string, newPassword?: string) {
    // Allow calling the script with CLI args: `node reset-password.js email newPassword`
    if (!email || !newPassword) {
        const [, , e, p] = process.argv;
        email = email || e;
        newPassword = newPassword || p;
    }

    if (!email || !newPassword) {
        throw new Error('Usage: reset-password <email> <newPassword>');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email },
        data: { password: hashedPassword }
    });
}

if (require.main === module) {
    resetPassword()
        .catch(console.error)
        .finally(() => prisma.$disconnect());
}

export default resetPassword;