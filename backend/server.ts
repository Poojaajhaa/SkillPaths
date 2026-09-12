import { PrismaClient } from "./generated/prisma/client"
import express from "express";
import cors from "cors";
import "dotenv/config";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"
import { authenticateToken, requireAdmin, requireSeller } from "./middleware/auth";
import { courseSchema } from "./schemas/courseSchema";
import { Prisma } from "./generated/prisma/client";
import { includes } from "zod";
// auth schemas are validated inline to avoid runtime import issues



const app = express();
const PORT = process.env.PORT || 5000;
const prisma = new PrismaClient();

const courses = [
  {
    courseName: "React Fundamentals",
    description:
      "Learn the fundamentals of React and build modern, interactive user interfaces.",
    category: "Development",
    price: "₹1,999",
    level: "Beginner",
    duration: "6 Weeks",
    rating: 4.8,
    totalRatings: 245,
    bestseller: true,
  },
  {
    courseName: "Advanced JavaScript",
    description:
      "Deepen your JavaScript knowledge and learn concepts used in modern web development.",
    category: "Development",
    price: "₹2,499",
    level: "Intermediate",
    duration: "8 Weeks",
    rating: 4.7,
    totalRatings: 180,
    bestseller: false,
  },
  {
    courseName: "UI/UX Design Basics",
    description:
      "Understand the principles of user interface and user experience design.",
    category: "Design",
    price: "₹1,799",
    level: "Beginner",
    duration: "5 Weeks",
    rating: 4.9,
    totalRatings: 132,
    bestseller: true,
  },
];

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("SkillPath Backend is running!");
});

app.post(
  "/api/courses",
  authenticateToken,
  requireSeller,
  async (req, res) => {
    try {
      const validation = courseSchema.safeParse(req.body);

      if (!validation.success) {
        return res.status(400).json({
          message: "Invalid course data",
          errors: validation.error.issues,
        });
      }

      const course = await prisma.course.create({
        data: {
          ...validation.data,
          sellerId: req.user?.userId,
        }
      });

      return res.status(201).json({
        message: "Course created successfully",
        course,
      });
    } catch (error) {
      console.error("Error creating course:", error);

      return res.status(500).json({
        message: "Failed to create course",
      });
    }
  }
);

app.post(
  "/api/courses/:courseId/reviews",
  authenticateToken,
  async (req, res) => {
    try {
      const courseId = Number(req.params.courseId);
      const userId = req.user!.userId;
      const { rating, comment } = req.body;

      if (!rating || rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Rating must be between 1 and 5",
        });
      }

      const safeComment =
        comment == null
          ? null
          : typeof comment === "string"
            ? comment.trim() || null
            : String(comment);

      const order = await prisma.order.findFirst({
        where: { courseId, userId },
      });

      if (!order) {
        return res.status(403).json({
          message: "You must purchase this course to leave a review",
        });
      }

      const review = await prisma.review.upsert({
        where: {
          userId_courseId: {
            userId,
            courseId,
          },
        },
        update: {
          rating,
          comment: safeComment,
        },
        create: {
          userId,
          courseId,
          rating,
          comment: safeComment,
        },
      });

      const allReviews = await prisma.review.findMany({
        where: { courseId },
      });

      const totalRatings = allReviews.length;
      const avgRating =
        allReviews.reduce((sum, r) => sum + r.rating, 0) / totalRatings;

      await prisma.course.update({
        where: { id: courseId },
        data: {
          rating: Math.round(avgRating * 10) / 10,
          totalRatings,
        },
      });

      return res.status(201).json({
        message: "Review submitted",
        review,
      });
    } catch (error) {
      console.error("Error submitting review:", error);
      return res.status(500).json({
        message: "Failed to submit review",
      });
    }
  }
);

app.get("/api/courses/:courseId/reviews", async (req, res) => {
  try {
    const courseId = Number(req.params.courseId);

    const reviews = await prisma.review.findMany({
      where: { courseId },
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: { name: true },
        },
      },
    });

    return res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return res.status(500).json({
      message: "Failed to fetch reviews",
    });
  }
});

app.post(
  "/api/orders",
  authenticateToken,
  async (req, res) => {
    try {
      const { courseId } = req.body;

      if (!courseId) {
        return res.status(400).json({
          message: "Course ID is required",
        });
      }

      const course = await prisma.course.findUnique({
        where: {
          id: Number(courseId),
        },
      });

      if (!course) {
        return res.status(404).json({
          message: "Course not found",
        });
      }

      const order = await (prisma as any).order.create({
        data: {
          userId: req.user!.userId,
          courseId: course.id,
          amount: course.price,
          status: "PENDING",
        },
      });

      return res.status(201).json({
        message: "Order created successfully",
        order: {
          ...order,
          status: order.status || "PENDING",
        },
      });
    } catch (error) {
      console.error("Order error:", error);

      return res.status(500).json({
        message: "Failed to create order",
      });
    }
  }
);

app.get("/api/orders",
  authenticateToken,
  async (req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          userId: req.user!.userId,
        },
        include: {
          course: true,
        },

        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(
        orders.map((order) => ({
          ...order,
          status: order.status || "PENDING",
        }))
      );
    } catch (error) {
      console.error("Error fetching orders:" , error);

      return res.status(500).json({
        message: "Failed to fetch orders",
      });
    }
  }
)
app.get("/api/seller/orders",
  authenticateToken,
  requireSeller,
  async(req, res) => {
    try {
      const orders = await prisma.order.findMany({
        where: {
          course: {
            sellerId: req.user!.userId,
          },
        },
        include: {
          user: true,
          course: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.json(
        orders.map((order) => ({
          ...order,
          status: order.status || "PENDING",
        }))
      );
    } catch (error) {
      console.error("Seller orders error:", error);

      return res.status(500).json({
        message: "Failed to fetch seller orders",
      });
    }
  }
);

app.put(
  "/api/seller/orders/:id/status",
  authenticateToken,
  requireSeller,
  async (req, res) => {
    try {
      const orderId = Number(req.params.id);

      const { status } = req.body;
      
      const order = await prisma.order.update({
        where: {
          id: orderId,
        },
        data: {
          status: status,
        },
      });

      return res.json({
        message: "Order status updated",
        order,
      });
    } catch (error) {
      console.error("Update order status error:" , error);

      return res.status(500).json({
        message: "Failed to update order status",
      })
    }
  }
);


app.get("/api/courses/:id/learn",
  authenticateToken,
  async (req, res) => {
    try {
      const courseId = Number(req.params.id);
      const userId = req.user!.userId;

      const order = await prisma.order.findFirst({
        where: {
          courseId,
          userId
        },
      });

      if(!order) {
        return res.status(403).json({
          message: "You must purchase this course to access its content",
        });
      }

      const course = await prisma.course.findUnique({
        where: {id: courseId},
        include: {
          sections: {
            orderBy: { order: "asc"},
            include: {
              lessons: {
                orderBy: { order: "asc"},
                include: {
                  progress: {
                    where: { userId }
                  },
                },
              },
            },
          },
        },
      });

      if(!course) {
        return res.status(404).json(
          { messaage: "Course not found"}
        )
      }
      return res.json(course);
    } catch (error){
      console.error("Error fetching course content:" , error);
      return res.status(500).json({
        message: "Failed to fetch course content",
      })
    }
  }
)
app.get("/api/courses", async (req, res) => {
  try {
    const courses = await prisma.course.findMany({
      select: {
        id: true,
        courseName: true,
        description: true,
        category: true,
        price: true,
        level: true,
        duration: true,
        rating: true,
        totalRatings: true,
        bestseller: true,
      },
    });

    res.json(courses);
  } catch (error) {
    console.error("Error fetching courses:", error);

    res.status(500).json({
      message: "Failed to fetch courses",
    });
  }
});

app.get(
  "/api/admin/courses",
  authenticateToken,
  requireSeller,
  async (req, res) => {
    try {
      const courses = await prisma.course.findMany({
        where: {
          sellerId: req.user?.userId,
        },
      });

      return res.json(courses);
    } catch (error) {
      console.error("Error fetching admin courses:", error);

      return res.status(500).json({
        message: "Failed to fetch your courses",
      });
    }
  }
);

app.get("/api/admin/users",
  authenticateToken,
  requireAdmin,
  async (req, res) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      return res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      return res.status(500).json({
        message: "Failed to fetch users",
      });
    }
  }
)

app.put(
  "/api/admin/users/:id/make-seller",
  authenticateToken,
  requireAdmin,

  async (req, res) => {
    try {
      const userId = Number(req.params.id);

      const user = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          role: "SELLER",
        },

      });

      return res.json({
        message: "User is now a seller" ,
        user,
      });
    } catch (error) {
      console.error("Error updating user role:" , error);

      return res.status(500).json({
        message: "Failed to make seller",
      });
    }
  }
)

  // Dev-only endpoint to let the authenticated user make themselves a seller
  app.put("/api/make-seller", authenticateToken, async (req, res) => {
    try {
      if (process.env.NODE_ENV === "production") {
        return res.status(403).json({ message: "Not allowed in production" });
      }

      const userId = req.user!.userId;

      const user = await prisma.user.update({
        where: { id: userId },
        data: { role: "SELLER" },
      });

      return res.json({ message: "You are now a seller", user });
    } catch (error) {
      console.error("Make-me-seller error:", error);
      return res.status(500).json({ message: "Failed to update role" });
    }
  });

app.post("/api/auth/login", async (req, res) => {
  try {
    // Basic inline validation to avoid runtime issues if zod import fails
    const { email, password } = req.body || {};
    if (
      typeof email !== "string" ||
      !email.includes("@") ||
      typeof password !== "string" ||
      password.length < 1
    ) {
      return res.status(400).json({ message: "Invalid login data" });
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      });
    }

    const normalizedRole = (user.role || "USER").trim().toUpperCase();

    const token = jwt.sign(
      {
        userId: user.id,
        role: normalizedRole,
      },
      process.env.JWT_SECRET!,
      {
        expiresIn: "1d",
      }
    );

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: normalizedRole,
      },
    });
  } catch (error) {
    console.error("Login error:", error);

    return res.status(500).json({
      message: "Failed to login",
    });
  }
});

app.get("/api/courses/:courseName", async (req, res) => {
  try {
    const course = await prisma.course.findUnique({
      where: {
        courseName: req.params.courseName,
      },
    });

    if (!course) {
      return res.status(404).json({
        message: "Course not found",
      });
    }

    return res.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);

    return res.status(500).json({
      message: "Failed to fetch course",
    });
  }
});

app.put(
  "/api/courses/:id",
  authenticateToken,
  requireSeller,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "Invalid course ID",
        });
      }

      const validation = courseSchema.safeParse(req.body);
      
      if(!validation.success) {
        return res.status(400).json({
          message: "Invalid course data",
          errors: validation.error.issues,
        })
      }

      const course = await prisma.course.update({
        where: { id },
        data: validation.data,
      });

      return res.json({
        message: "Course updated successfully",
        course,
      });
    } catch (error) {
      console.error("Error updating course:", error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError && 
        error.code === "P2025"
      ){
        return res.status(404).json({
          message: "Course not found"
        });
      }

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        return res.status(409).json({
          message: "Course name already exists",
        });
     }

      return res.status(500).json({
        message: "Failed to update course",
      });
    }
  }
);

app.delete(
  "/api/courses/:id",
  authenticateToken,
  requireSeller,
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        return res.status(400).json({
          message: "Invalid course ID",
        });
      }

      await prisma.course.delete({
        where: { id },
      });

      return res.json({
        message: "Course deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting course:", error);

      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
       return res.status(404).json({
          message: "Course not found",
        });
      }

      return res.status(500).json({
        message: "Failed to delete course",
      });
    }
  }
);

app.post("/api/auth/register", async (req, res) => {
  try {
    // Inline validation to avoid dependency on external schema at runtime
    const { name, email, password, role } = req.body || {};

    if (
      typeof name !== "string" ||
      name.length < 2 ||
      typeof email !== "string" ||
      !email.includes("@") ||
      typeof password !== "string" ||
      password.length < 8
    ) {
      return res.status(400).json({ message: "Invalid registration data" });
    }

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const allowedRoles = ["USER", "SELLER"];
    const finalRole = allowedRoles.includes(role) ? role : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: finalRole,
      },
    });

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    return res.status(500).json({
      message: "Failed to register user",
      error: error instanceof Error ? error.message : String(error),
    });
  }
});

// Contact form endpoint
app.post("/api/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body || {};

    if (
      typeof name !== "string" ||
      name.trim().length < 2 ||
      typeof email !== "string" ||
      !email.includes("@") ||
      typeof subject !== "string" ||
      subject.trim().length === 0 ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return res.status(400).json({ message: "Invalid contact data" });
    }

    const contact = await prisma.contactMessage.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        subject: subject.trim(),
        message: message.trim(),
      },
    });

    return res.status(201).json({ message: "Message received", contact });
  } catch (error) {
    console.error("Contact error:", error);
    return res.status(500).json({ message: "Failed to send message" });
  }
});

app.post ("/api/subscribe", async (req , res) => {
  try {
    const { email } = req.body || {};

    if(
      typeof email !== "string" || !email.includes("@")
    ) {
      return res.status(400).json({
        message: "Please enter a valid email",
      });
    }

    const existingSubscriber = await prisma.subscription.findUnique({
      where: {
        email: email.trim(),
      }
    });

    if(existingSubscriber){
      return res.status(409).json({
        message: "Email is already subscribed",
      });
    }

    const subscription = await prisma.subscription.create({
      data: {
        email: email.trim(),
      }
    });

    return res.status(201).json({
      message: "Subscribed successfully",
      subscription,
    });
  }catch(error){
     console.error("Subscription error:", error);
      
     return res.status(500).json({
       message: "Failed to subscribe",
     })
  }
  
})

app.post(
  "/api/courses/:courseId/sections",
  authenticateToken, requireSeller,
  async (req, res) => {
    try {
      const courseId = Number(req.params.courseId);
      const { title, order} = req.body;

      if(!title) {
        return res.status(400).json({message:"Title is required."})
      }

      const section = await prisma.section.create({
        data: {
          title,
          order: order || 1,
          courseId,
        },
      });

      return res.status(201).json({
        message: "Section created",
        section,
      });
    } catch (error) {
      console.error("Error creating section" , error);
      return res.status(500).json({message: "Failed to create section."})
    }
  }
)

app.post (
  "/api/sections/:sectionId/lessons",
  authenticateToken,requireSeller,
  async (req, res) => {
    try {
      const sectionId = Number(req.params.sectionId);
      const { title, videoUrl, duration, order } = req.body;

      if(!title || !videoUrl){
        return res.status(400).json({
          message: "Title video URL is required",
        });
      }

      const lesson = await prisma.lesson.create({
        data: {
          title,
          videoUrl,
          duration: duration || null,
          order: order || 1,
          sectionId,
        },
      });
       
      return res.status(201).json({
        message: " Lesson created",
        lesson,
      });
    } catch (error) {
      console.error("Error creating lesson" , error);
      return res.status(500).json({message: "Failed to create lesson."})
    }
  }
)

app.get(
  "/api/courses/:courseId/curriculum",
  authenticateToken,requireSeller,
  async (req, res) => {
    try {
      const courseId = Number(req.params.courseId);

      const sections = await prisma.section.findMany({
        where: {courseId},
        orderBy: {order: "asc"},
        include: {
          lessons: {
            orderBy: {order: "asc"}
          },
        },
      });
      return res.json(sections);
    } catch(error) {
      console.error("Error fetching curriculum:", error);
      return res.status(500).json({message: "Failed to fetch curriculum."})
    }
  }
)

app.delete(
  "/api/sections/:id", authenticateToken, requireSeller,
  async (req , res) => {
    try {
      const sectionId = Number (req.params.id);

      await prisma.section.delete({
         where: {id: sectionId},
      });

      return res.json({message: "Section deleted"});
    } catch (error) {
      console.error ("Error deleting section:" ,error);
      return res.json(500).json({message: "Failed to delete section"});
    }
  }
);

app.delete(
  "/api/lessons/:id",
  authenticateToken,
  requireSeller,

  async (req, res) => {
    try {
      const lessonId = Number(req.params.id);

      await prisma.lesson.delete({
        where: { id: lessonId },
      });

      return res.json({message: "Lesson deleted"});
    } catch (error) {
      console.error("Error deleting lesson" , error);
      return res.status(500).json({message: "Failed to delete lesson"})
    }
  }
);


app.get(
  "/api/my-learning", authenticateToken,
  async (req, res) => {
    try {
      const userId = req.user!.userId;

      const orders = await prisma.order.findMany({
        where: {userId},
        include: {
          course: {
            include: {
              sections: {
                include:{
                  lessons: {
                    include: {
                      progress: {
                        where: { userId }
                      },
                    },
                  },
                },
              },
            },
          },
        },
      });

      const uniqueCoursesMap = new Map<number, any>();

      for (const order of orders) {
        if (!uniqueCoursesMap.has(order.course.id)) {
          uniqueCoursesMap.set(order.course.id, order.course);
        }
      }

      const myCourses = Array.from(uniqueCoursesMap.values()).map((course: any) => {
        const totalLessons = course.sections.reduce(
          (sum: number, section: any) => sum + (section.lessons?.length ?? 0),
          0
        );

        const completedLessons = course.sections.reduce(
          (sum: number, section: any) =>
            sum +
            (section.lessons?.filter((lesson: any) => lesson.progress?.[0]?.isCompleted).length ?? 0),
          0
        );

        return {
          id: course.id,
          courseName: course.courseName,
          category: course.category,
          totalLessons,
          completedLessons,
        };
      });

      return res.status(200).json({ courses: myCourses });
    } catch (error) {
      console.error("Error fetching my learning:", error);
      return res.status(500).json({ message: "Failed to fetch learning progress" });
    }
  }
);

app.get (
  "/api/courses/:id/curriculum-preview",
  async ( req , res) => {
    try {
      const courseId = Number(req.params.id);

      const sections = await prisma.section.findMany({
        where: { courseId },
        orderBy: { order: "asc"},
        select: {
          id: true,
          title: true,
          order: true,
          lessons: {
            orderBy: { order: "asc"},
            select: {
              id: true,
              title: true,
              duration: true,
              order: true,
            },
          },
        },
      });
      return res.json(sections);
    } catch (error) {
      console.error("Error fetching curriculum preview:", error);
      return res.status(500).json({
        message: "Failed to fetch curriculum preview",
      });
    }
  }
)

app.get(
  "/api/orders/owns/:courseId",
  authenticateToken,
  async (req, res) => {
    try {
      const courseId = Number(req.params.courseId);
      const userId = req.user!.userId;

      const order = await prisma.order.findFirst({
        where: { courseId, userId },
      });

      return res.json({ owns: Boolean(order)});
    } catch (error){
      console.error("Error checking ownership:", error);
      return res.status(500).json({message: "Failed to check ownership"});
    }
    
  } 
)

async function seedCourses() {
  try {
    for (const course of courses) {
      await prisma.course.upsert({
        where: {
          courseName: course.courseName,
        },
        update: {
          description: course.description,
          category: course.category,
          price: course.price,
          level: course.level,
          duration: course.duration,
          rating: course.rating,
          totalRatings: course.totalRatings,
          bestseller: course.bestseller,
        },
        create: {
          courseName: course.courseName,
          description: course.description,
          category: course.category,
          price: course.price,
          level: course.level,
          duration: course.duration,
          rating: course.rating,
          totalRatings: course.totalRatings,
          bestseller: course.bestseller,
        },
      });
    }

    console.log("Courses synced with database");
  } catch (error) {
    console.error("Failed to sync courses:", error);
  }
}

app.get("/api/profile", authenticateToken, async (req, res) => {
  return res.json({
    message: "You are authenticated",
    user: req.user,
  });
});

app.get(
  "/api/admin/test",
  authenticateToken,
  requireAdmin,
  (req, res) => {
    return res.json({
      message: "Welcome Admin!",
    });
  }
);

async function startServer() {
  await seedCourses();

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();