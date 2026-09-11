import { PrismaClient } from "./generated/prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function makeAdmin(){
    const email= "pooja2004jha@gmail.com";

    const user = await prisma.user.update({
        where:{
            email,
        },
        data: {
            role: "ADMIN"
        },
    });
    console.log("User role updated", user.email, user.role);
    await prisma.$disconnect();
}
makeAdmin();