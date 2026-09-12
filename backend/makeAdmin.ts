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
    // Role update completed without logging sensitive user details.
    await prisma.$disconnect();
}
makeAdmin();