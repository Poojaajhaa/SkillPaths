import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";

const API_URL = "https://skillpaths-backend.onrender.com";

type MyCourse = {
    id: number;
    courseName: string;
    category: string;
    totalLessons: number;
    completedLessons: number;
};

function MyLearningPage() {
    const [courses, setCourses] = useState<MyCourse[]>([])
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const categories = ["All", ...new Set(courses.map((course) => course.category))];
    const filteredCourses =
        selectedCategory === "All"
            ? courses
            : courses.filter((course) => course.category === selectedCategory);

    useEffect(() => {
      const fetchMyLearning = async () => {
        const token = localStorage.getItem("token");

        if(!token) {
            setErrorMessage("Please log in to view your course.");
            setLoading(false);
            return;
        }

        try {
            const response = await fetch (
                `${API_URL}/api/my-learning`, {
                    headers: { Authorization: `Bearer ${token}`}
                }
            );

            const data = await response.json();

            if(!response.ok) {
                throw new Error(data.message || "Failed to fetch your courses");
            }
            setCourses(Array.isArray(data?.courses) ? data.courses : Array.isArray(data) ? data : []);
        } catch (error: any) {
            setErrorMessage(error.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
      };
      fetchMyLearning();

    },[]);

    if(loading) {
        return <div className="p-6">Loading your courses...</div>
    }

    if(errorMessage) {
        return <div className="p-6 text-red-600">{errorMessage}</div>
    }

    return (
        <div className="mx-auto max-w-6xl px-6 py-10">
            <h1 className="mb-8 text-3xl font-bold text-gray-900">My Learning</h1>

            <div className="flex flex-col gap-6 md:flex-row">
                <aside className="w-full md:w-64">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">
                            Categories
                        </p>

                        <div className="space-y-2">
                            {categories.map((category) => (
                                <button
                                    key={category}
                                    type="button"
                                    onClick={() => setSelectedCategory(category)}
                                    className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-sm font-medium transition ${
                                        selectedCategory === category
                                            ? "bg-indigo-600 text-white shadow-sm"
                                            : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                                    }`}
                                >
                                    <span>{category === "All" ? "Show all" : category}</span>
                                    <span className={`text-xs ${selectedCategory === category ? "text-indigo-100" : "text-gray-400"}`}>
                                        {category === "All" ? courses.length : courses.filter((course) => course.category === category).length}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </aside>

                <main className="flex-1">
                    {courses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
                            <p className="text-lg font-medium text-gray-700">You haven't enrolled in any courses yet</p>
                        </div>
                    ) : filteredCourses.length === 0 ? (
                        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
                            <p className="text-lg font-medium text-gray-700">No courses in this category yet.</p>
                        </div>
                    ) : (
                        <div className="grid gap-5">
                            {filteredCourses.map((course) => (
                                <div
                                    key={course.id}
                                    className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                                >
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-600">
                                                {course.category}
                                            </p>
                                            <h2 className="mt-2 text-xl font-bold text-gray-900">{course.courseName}</h2>
                                        </div>
                                        <NavLink
                                            to={`/courses/${course.id}`}
                                            className="rounded-lg bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
                                        >
                                            Continue
                                        </NavLink>
                                    </div>

                                    <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
                                        <span>{course.totalLessons} lessons</span>
                                        <span>•</span>
                                        <span>{course.completedLessons} completed</span>
                                    </div>

                                    <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-gray-200">
                                        <div
                                            className="h-full rounded-full bg-indigo-600"
                                            style={{
                                                width: `${course.totalLessons === 0 ? 0 : (course.completedLessons / course.totalLessons) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default MyLearningPage;