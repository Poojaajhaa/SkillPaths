import CourseCard from "../components/courses/CourseCard";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import type { Course } from "../components/courses/CourseCard";

const API_URL = "https://skillpath-backend.onrender.com";

function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams] = useSearchParams();

  useEffect(()=>{
    const categoryFormUrl = searchParams.get("category");

    if(categoryFormUrl) {
      setCategory(categoryFormUrl);
    } else {
      setCategory("All");
    }
  },[searchParams]);

  useEffect(() => {
    const loadCourses = async() => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/api/courses`
        );

        if (!response.ok) {
          throw new Error("Failed to load courses");
        }
        const data = await response.json();

        setCourses(data);
      } catch(error) {
          console.error("Courses error:", error);
          setError("Unable to load courses. Please try again.");
        }finally {
          setLoading(false);
        }
    };
    loadCourses();
  }, []);
  
  const categories = Array.from(
    new Set(courses.map((course) => course.category))
  );

  const learningPaths = categories.map((categoryName) => {
    const categoryCourses = courses.filter(
      (course) => course.category === categoryName
    );

    const pathNames: Record<string, string> = {
      Development: "Frontend Development",
      Design: "UI/UX Design",
      "Data Science": "Data Analytics",
      Business: "Digital Marketing",
    };

    return {
      name: pathNames[categoryName] || categoryName,
      category: categoryName,
      description: `Explore ${categoryName} courses and build practical skills step by step.`,
      courses: categoryCourses.length,
    };
  });

  const filteredCourses = courses.filter((course) => {
    const matchesSearch = course.courseName
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || course.category === category;

    return matchesSearch && matchesCategory;
  });

  const handleLearningPathClick = (categoryName: string) => {
    setCategory(categoryName);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  };
  

  return (
    <main>
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold tracking-wide text-purple-600">
            COURSES
          </p>

          <h1 className="mt-3 font-bold text-gray-900 md:text-5xl">
            Explore courses that help you grow
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Discover practical courses designed to help you build skills,
            learn at your own pace, and move forward in your career.
          </p>
        </div>
      </section>

      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <label htmlFor="search" className="mb-2 block font-bold text-gray-900">
            Search Courses
          </label>

          <input type="text" id="search" placeholder="Search Courses..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-2 block w-full rounded-lg border border-gray-300 p-4"
          />

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={() => setCategory("All")}
              className={`rounded-lg px-4 py-2 font-medium transition ${
              category === "All" ? "bg-purple-600 text-white"
                : "border border-gray-300 bg-white text-gray-600 hover:bg-purple-50"
             }`}
            >
              All
           </button>

           {categories.map((cat) => (
             <button key={cat}
                onClick={() => setCategory(cat)}
                className={`rounded-lg px-4 py-2 font-medium transition ${
                category === cat ? "bg-purple-600 text-white"
                  : "border border-gray-300 bg-white text-gray-600 hover:bg-purple-50"
                }`}
              >
                {cat}
             </button>
            ))}
         </div>
        </div>
      </section>

      {/* Courses */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <h2
              className="text-3xl font-bold text-gray-900"
            >
              {category === "All" ? "All Courses" : `${category} Courses`}</h2>
          </div>

          {
            category != "All" && (
              <button 
              type="button"
              onClick={() => setCategory("All")}
                className="text-sm font-medium text-purple-600 hover:text-purple-800"
              >
                Clear Filter
              </button>
            )
          }
      
          {loading && (
            <div className="py-12 text-center">
              <p className="text-lg font-medium text-gray-600">
                Loading courses...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center">
              <p className="font-medium text-red-600">{error}</p>

              <button
                onClick={() => window.location.reload()}
                className="mt-4 rounded-lg bg-purple-600 px-5 py-2 text-white hover:bg-purple-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!loading && !error && filteredCourses.length === 0 && (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-10 text-center">
              <h3 className="text-xl font-bold text-gray-900">
                No courses found
              </h3>

              <p className="mt-2 text-gray-600">
                Try a different search or category.
              </p>
            </div>
          )}

          {!loading && !error && filteredCourses.length > 0 && (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                />
              ))}
            </div>
          )}
        </div>
      </section>
      {!loading && !error && courses.length > 0 && (
         <section className="px-6 py-12">
        <div className="mx-auto max-w-7xl text-center">
          <p className="font-semibold tracking-wide text-purple-600">
            LEARNING PATHS
          </p>

          <h2 className="mt-3 font-bold text-gray-900 md:text-5xl">
            Choose a path that fits your goals
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">
            Explore courses by category and build the skills you need step by step.
          </p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl gap-8 md:grid-cols-2">
          {learningPaths.map((learningPath) => (
            <button
              key={learningPath.category}
              type="button"
              onClick={() => handleLearningPathClick(learningPath.category)}
              className="group rounded-2xl border border-gray-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-1 hover:border-purple-300 hover:shadow-lg"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-600">{learningPath.name}</h3>

                <span className="whitespace-nowrap rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                   {learningPath.courses}{" "}
                   {learningPath.courses === 1 ? "Course" : "Courses"}
                </span>
              </div>

              <p className="mt-3 text-gray-600">{learningPath.description}</p>

              <p className="mt-5 font-medium text-purple-600">Explore {learningPath.name} →</p>
            </button>
          ))}
        </div>
      </section>
      )}
      
    </main>
  );
}

export default CoursesPage;