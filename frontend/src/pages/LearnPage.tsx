import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "https://skillpath-backend.onrender.com";

type Progress = { isCompleted: boolean };

type Lesson = {
    id: number;
    title: string;
    videoUrl: string;
    duration: string | null;
    order: number;
    progress?: Progress[];
};

type Section = {
    id: number;
    title: string;
    order: number;
    lessons: Lesson[];
};

type CourseContent = {
    id: number;
    courseName: string;
    sections: Section[];
};

function LearnPage() {
    const { courseId } = useParams();
    const [course, setCourse] = useState<CourseContent | null>(null);
    const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            const token = localStorage.getItem("token");

            if (!token) {
                setErrorMessage("Please log in first.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/courses/${courseId}/learn`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const contentType = response.headers.get("content-type") || "";
                const data = contentType.includes("application/json")
                    ? await response.json()
                    : null;

                if (!response.ok) {
                    throw new Error(data?.message || "Failed to load course content");
                }

                setCourse(data);

                const firstLesson = data?.sections?.[0]?.lessons?.[0] ?? null;
                setActiveLesson(firstLesson);
            } catch (error: any) {
                setErrorMessage(error?.message || "Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        fetchContent();
    }, [courseId]);

    const toggleComplete = async (lesson: Lesson) => {
        const token = localStorage.getItem("token");
        if (!token) {
            setErrorMessage("Please log in to track progress.");
            return;
        }

        const currentStatus = lesson.progress?.[0]?.isCompleted ?? false;

        try {
            const response = await fetch(
                `${API_URL}/api/lessons/${lesson.id}/progress`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({ isCompleted: !currentStatus }),
                }
            );

            const contentType = response.headers.get("content-type") || "";
            const resData = contentType.includes("application/json")
                ? await response.json()
                : null;

            if (!response.ok) {
                throw new Error(resData?.message || "Failed to update progress");
            }

            // Update local course state
            setCourse((prev) => {
                if (!prev) return prev;

                return {
                    ...prev,
                    sections: prev.sections.map((section) => ({
                        ...section,
                        lessons: section.lessons.map((l) =>
                            l.id === lesson.id
                                ? { ...l, progress: [{ isCompleted: !currentStatus }] }
                                : l
                        ),
                    })),
                };
            });

            if (activeLesson?.id === lesson.id) {
                setActiveLesson({ ...lesson, progress: [{ isCompleted: !currentStatus }] });
            }
        } catch (error) {
            console.error("Progress update error:", error);
            setErrorMessage((error as Error)?.message || "Failed to update progress");
        }
    };

    if (loading) return <div className="p-6">Loading...</div>;
    if (errorMessage) return <div className="p-6 text-red-600">{errorMessage}</div>;
    if (!course) return <div className="p-6">Course not found.</div>;

    const totalLessons = course.sections.reduce(
        (sum, s) => sum + s.lessons.length,
        0
    );
    const completedLessons = course.sections.reduce(
        (sum, s) =>
            sum + s.lessons.filter((l) => l.progress?.[0]?.isCompleted).length,
        0
    );

    return (
        <div className="mx-auto max-w-7xl px-6 py-8">
            <h1 className="mb-2 text-2xl font-bold">{course.courseName}</h1>
            <p className="mb-6 text-sm text-gray-600">
                {completedLessons} / {totalLessons} lessons completed
            </p>

            <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
                <div>
                    {activeLesson ? (
                        <div>
                            <div className="aspect-video w-full overflow-hidden rounded-xl bg-black">
                                <iframe
                                    key={activeLesson.id}
                                    src={activeLesson.videoUrl}
                                    className="h-full w-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                            </div>

                            <div className="mt-4 flex items-center justify-between">
                                <h2 className="text-xl font-semibold">{activeLesson.title}</h2>
                                <button
                                    onClick={() => toggleComplete(activeLesson)}
                                    className={`rounded-lg px-4 py-2 text-sm font-semibold ${
                                        activeLesson.progress?.[0]?.isCompleted
                                            ? "bg-green-100 text-green-700"
                                            : "bg-purple-600 text-white hover:bg-purple-700"
                                    }`}
                                >
                                    {activeLesson.progress?.[0]?.isCompleted
                                        ? "completed"
                                        : "Mark as Completed"}
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p>Select a lesson to begin.</p>
                    )}
                </div>

                <div className="rounded-xl border p-4">
                    <h3 className="mb-3 font-semibold">Course Content</h3>
                    {course.sections.map((section) => (
                        <div key={section.id} className="mb-4">
                            <p className="mb-2 text-sm font-semibold text-gray-700">
                                {section.title}
                            </p>
                            <ul className="space-y-1">
                                {section.lessons.map((lesson) => (
                                    <li key={lesson.id}>
                                        <button
                                            onClick={() => setActiveLesson(lesson)}
                                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm ${
                                                activeLesson?.id === lesson.id
                                                    ? "bg-purple-50 text-purple-700"
                                                    : "hover:bg-gray-50"
                                            }`}
                                        >
                                            <span>
                                                {lesson.progress?.[0]?.isCompleted ? "✔️" : ""}
                                                {lesson.title}
                                            </span>
                                            {lesson.duration && (
                                                <span className="text-xs text-gray-400">
                                                    {lesson.duration}
                                                </span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default LearnPage;