import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_URL = "https://skillpath-backend.onrender.com";

type Lesson = {
    id: number;
    title: string;
    videoUrl: string;
    duration: string | null;
    order: number;
};

type Section = {
    id: number;
    title: string;
    order: number;
    lessons: Lesson[];
};

type LessonFormState = {
    title: string;
    videoUrl: string;
    duration: string;
};

const emptyLessonForm = (): LessonFormState => ({
    title: "",
    videoUrl: "",
    duration: "",
});

function CurriculumManager() {
    const { courseId } = useParams();
    const [sections, setSections] = useState<Section[]>([]);
    const [loading, setLoading] = useState(true);
    const [sectionTitle, setSectionTitle] = useState("");
    const [addingSection, setAddingSection] = useState(false);
    const [lessonForms, setLessonForms] = useState<Record<number, LessonFormState>>({});
    const [addingLessonFor, setAddingLessonFor] = useState<number | null>(null);

    const token = localStorage.getItem("token");

    const fetchCurriculum = async () => {
        if (!courseId) return;

        try {
            const response = await fetch(`${API_URL}/api/courses/${courseId}/curriculum`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to load curriculum");
            }

            setSections(data);
        } catch (error) {
            console.error("Curriculum fetch error:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCurriculum();
    }, [courseId]);

    const handleAddSection = async () => {
        if (!sectionTitle.trim() || !courseId) return;

        setAddingSection(true);

        try {
            const response = await fetch(`${API_URL}/api/courses/${courseId}/sections`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: sectionTitle,
                    order: sections.length + 1,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to add section");
            }

            setSectionTitle("");
            await fetchCurriculum();
        } catch (error) {
            console.error("Add section error:", error);
            alert("Failed to add section");
        } finally {
            setAddingSection(false);
        }
    };

    const handleDeleteSection = async (sectionId: number) => {
        const confirmed = window.confirm(
            "Delete this section? All its lessons will be deleted too."
        );
        if(!confirmed) return ;

        try {
            const response = await fetch (
                `${API_URL}/api/sections/${sectionId}`,{
                    method: "DELETE",
                    headers: {Authorization: `Bearer ${token}`},
                }
            );

            if(!response.ok){
                throw new Error ("Failed to delete section")
            }
            await fetchCurriculum();
        } catch (error) {
            console.error("Delete section error" , error);
            alert("Failed to delete section");
        }
    }

    const handleAddLesson = async (sectionId: number) => {
        const form = lessonForms[sectionId] ?? emptyLessonForm();

        if (!form.title.trim() || !form.videoUrl.trim()) {
            alert("Title and video URL are required.");
            return;
        }

        setAddingLessonFor(sectionId);

        try {
            const section = sections.find((s) => s.id === sectionId);
            const nextOrder = (section?.lessons.length ?? 0) + 1;

            const response = await fetch(`${API_URL}/api/sections/${sectionId}/lessons`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    title: form.title,
                    videoUrl: form.videoUrl,
                    duration: form.duration || null,
                    order: nextOrder,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to add lesson");
            }

            setLessonForms((prev) => ({
                ...prev,
                [sectionId]: emptyLessonForm(),
            }));

            await fetchCurriculum();
        } catch (error) {
            console.error("Add lesson error:", error);
            alert("Failed to add lesson");
        } finally {
            setAddingLessonFor(null);
        }
    };

    const updateLessonForm = (
        sectionId: number,
        field: keyof LessonFormState,
        value: string
    ) => {
        setLessonForms((prev) => ({
            ...prev,
            [sectionId]: {
                ...(prev[sectionId] ?? emptyLessonForm()),
                [field]: value,
            },
        }));
    };

    if (loading) {
        return <div className="p-6">Loading curriculum...</div>;
    }

    return (
        <div className="mx-auto max-w-4xl px-6 py-8">
            <h1 className="mb-6 text-2xl font-bold">Manage Curriculum</h1>

            <div className="space-y-6">
                {sections.map((section) => (
                    <div key={section.id} className="rounded-xl border p-5">
                        <h2 className="mb-3 font-semibold">
                            {section.order}.{section.title}
                        </h2>
                        <button onClick={() => handleDeleteSection(section.id)} 
                           className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                         Delete Section</button>

                        <ul className="mb-4 space-y-1">
                            {section.lessons.map((lesson) => (
                                <li key={lesson.id} className="rounded-lg bg-gray-50 px-3 py-2 text-sm">
                                    {lesson.order}.{lesson.title}
                                    {lesson.duration && <span> ({lesson.duration})</span>}
                                </li>
                            ))}
                        </ul>

                        <div className="space-y-2 rounded-lg border border-dashed p-3">
                            <input
                                type="text"
                                placeholder="Lesson title"
                                value={lessonForms[section.id]?.title ?? ""}
                                onChange={(e) => updateLessonForm(section.id, "title", e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />

                            <input
                                type="text"
                                placeholder="Video URL"
                                value={lessonForms[section.id]?.videoUrl ?? ""}
                                onChange={(e) => updateLessonForm(section.id, "videoUrl", e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />

                            <input
                                type="text"
                                placeholder="Duration (optional)"
                                value={lessonForms[section.id]?.duration ?? ""}
                                onChange={(e) => updateLessonForm(section.id, "duration", e.target.value)}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />

                            <button
                                type="button"
                                onClick={() => handleAddLesson(section.id)}
                                disabled={addingLessonFor === section.id}
                                className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                {addingLessonFor === section.id ? "Adding..." : "Add Lesson"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-6 rounded-xl border border-dashed p-5">
                <h3 className="mb-3 font-semibold">Add New Section</h3>
                <div className="flex gap-3">
                    <input
                        type="text"
                        placeholder="Section title (e.g. Introduction)"
                        value={sectionTitle}
                        onChange={(e) => setSectionTitle(e.target.value)}
                        className="flex-1 rounded-lg border px-3 py-2 text-sm"
                    />

                    <button
                        type="button"
                        onClick={handleAddSection}
                        disabled={addingSection}
                        className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                    >
                        {addingSection ? "Adding..." : "+ Add Section"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default CurriculumManager;