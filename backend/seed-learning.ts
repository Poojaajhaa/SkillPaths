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

    const lesson1 = await prisma.lesson.create({
        data: {
            title: "Welcome to the course",
            videoUrl:  "https://www.youtube.com/embed/w7ejDZ8SWv8",
            duration: "2 min",
            order: 1,
            sectionId: section.id,
        },

    });

    const lesson2 = await prisma.lesson.create({
        data: {
            title: "Setting up your environmet",
            videoUrl:  "https://www.youtube.com/embed/w7ejDZ8SWv8",
            duration: "5 min",
            order: 2,
            sectionId: section.id,
        },
    });

}

seedLearningContent()
   .catch(console.error)
   .finally(() => prisma.$disconnect)