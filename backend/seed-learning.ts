import { PrismaClient } from "./generated/prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function seedLearningContent() {
    const courseId = 2;

    const section = await prisma.section.create({
        data: {
            title: "Introduction",
            order: 1,
            courseId: courseId,
        },
    });

    console.log("Section created:", section);

    const lesson1 = await prisma.lesson.create({
        data: {
            title: "Welcome to the course",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            duration: "2 min",
            order: 1,
            sectionId: section.id,
        },

    });

    const lesson2 = await prisma.lesson.create({
        data: {
            title: "Setting up your environmet",
            videoUrl: "https://www.w3schools.com/html/mov_bbb.mp4",
            duration: "5 min",
            order: 2,
            sectionId: section.id,
        },
    });
    console.log("Lessons created:" , lesson1, lesson2);

}

seedLearningContent()
   .catch(console.error)
   .finally(() => prisma.$disconnect)