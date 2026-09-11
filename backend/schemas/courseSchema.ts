import { z } from "zod";

export const courseSchema = z.object({
    courseName: z.string().min(3, "Course name must be at least 3 characters"),
    description: z.string().min(10, "Description must be at least 10 characters"),
    category: z.string().min(2, "Category is required"),
    price: z.string().min(1, "Price is required"),
    level: z.string().min(2, "Level is required"),
    duration: z.string().min(2, "Duration is required"),
    rating: z.number().min(0).max(5).optional(),
    totalRatings: z.number().int().min(0).optional(),
    bestseller: z.boolean().optional(),
});