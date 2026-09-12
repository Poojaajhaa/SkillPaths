import { useEffect, useState } from "react";
import type { Course } from "../components/courses/CourseCard";

const API_URL = "https://skillpaths-backend.onrender.com";

function AdminDashboard() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
  const isAdmin = storedUser?.role === "ADMIN";

  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
  };

  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch(`${API_URL}/api/admin/courses`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      }
    })
      .then((response) => response.json())
      .then((data) => {
        setCourses(data);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchUser = async () => {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/api/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();

      setUsers(data);
    }
    fetchUser();
  }, [isAdmin]);

  const handleAddCourse = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);

    const data = {
      courseName: String(formData.get("courseName") ?? ""),
      description: String(formData.get("description") ?? ""),
      category: String(formData.get("category") ?? ""),
      price: String(formData.get("price") ?? ""),
      level: String(formData.get("level") ?? ""),
      duration: String(formData.get("duration") ?? ""),
    };

    const token = localStorage.getItem("token");
    const url = editingCourse
      ? `${API_URL}/api/courses/${editingCourse.id}`
      : `${API_URL}/api/courses`;
    const method = editingCourse ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        console.error("Failed to save course.");
        return;
      }

      if (editingCourse) {
        setCourses((prev) =>
          prev.map((course) =>
            course.id === editingCourse.id ? result.course : course
          )
        );
        setEditingCourse(null);
      } else {
        setCourses((prev) => [...prev, result.course]);
      }

      e.currentTarget.reset();
      setShowForm(false);
    } catch (error) {
      console.error("Failed to save course:", error);
    }
  };

  const handleEdit = (course: Course) => {
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    const response = await fetch(
      `${API_URL}/api/courses/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      }
    );

    if (response.ok) {
      setCourses((prev) =>
        prev.filter((course) => course.id !== id)
      )
    }
  }

  const handleMakeSeller = async (userId: number) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/users/${userId}/make-seller`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        console.error("Failed to update seller status.");
        return;
      }

      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId ? { ...user, role: "SELLER" } : user
        )
      );
    } catch (error) {
      console.error("Failed to make user a seller:", error);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-900">{isAdmin ? "Admin Dashboard" : "Seller Dashboard"}</h1>

        <p className="mt-2 text-gray-600">
          {isAdmin ? "Manage SkillPath courses and users." : "Manage your courses."}
        </p>

        <button
          onClick={() => {
            setEditingCourse(null);
            setShowForm(true);
          }}
          className="mt-6 rounded-lg bg-purple-600 px-5 py-2.5 font-semibold text-white hover:bg-purple-700"
        >
          Add Course
        </button>

        {showForm && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900">
              {editingCourse ? "Edit Course" : "Add New Course"}
            </h2>

            <form
              key={editingCourse ? editingCourse.courseName : "new-course"}
              onSubmit={handleAddCourse}
              className="mt-6 space-y-5"
            >
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Course Name
                </label>

                <input
                  type="text"
                  name="courseName"
                  required
                  defaultValue={editingCourse?.courseName || ""}
                  placeholder="Enter course name"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Description
                </label>

                <textarea
                  name="description"
                  required
                  defaultValue={editingCourse?.description || ""}
                  placeholder="Enter course description"
                  rows={4}
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Category
                </label>

                <input
                  type="text"
                  name="category"
                  required
                  defaultValue={editingCourse?.category || ""}
                  placeholder="e.g. Development"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Price
                </label>

                <input
                  type="text"
                  name="price"
                  required
                  defaultValue={editingCourse?.price || ""}
                  placeholder="e.g. ₹1,999"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Level
                </label>

                <input
                  type="text"
                  name="level"
                  required
                  defaultValue={editingCourse?.level || ""}
                  placeholder="e.g. Beginner"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Duration
                </label>

                <input
                  type="text"
                  name="duration"
                  required
                  defaultValue={editingCourse?.duration || ""}
                  placeholder="e.g. 6 Weeks"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white hover:bg-purple-800"
              >
                {editingCourse ? "Update Course" : "Add Course"}
              </button>
            </form>
          </div>
        )}

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_0.9fr]">
          <div>
            {loading ? (
              <p className="text-gray-600">Loading courses...</p>
            ) : (
              <div className="grid gap-6 md:grid-cols-2">
                {courses.map((course) => (
                  <div key={course.id} className="rounded-2xl bg-white p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-900">{course.courseName}</h2>

                    <p className="mt-2 text-gray-600">{course.description}</p>

                    <p className="mt-4 font-semibold text-purple-600">{course.price}</p>

                    <p className="mt-2 text-sm text-gray-600">Level: {course.level}</p>

                    <p className="mt-1 text-sm text-gray-600">Duration: {course.duration}</p>

                    <div className="mt-6 flex gap-3 border-t border-gray-100 pt-4">
                      <button
                        type="button"
                        onClick={() => handleEdit(course)}
                        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(course.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isAdmin && (
            <aside className="rounded-2xl bg-white p-5 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900">Manage Users</h2>

              <div className="mt-4 space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-gray-900">{user.name}</p>
                        <p className="text-sm text-gray-600">{user.email}</p>
                      </div>

                      <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-800">
                        {user.role}
                      </span>
                    </div>

                    {user.role === "USER" && (
                      <button
                        type="button"
                        onClick={() => handleMakeSeller(user.id)}
                        className="mt-3 rounded-lg bg-green-600 px-4 py-2 text-sm font-semibold text-white hover:bg-green-700"
                      >
                        Make Seller
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </aside>
          )}
        </div>
      </div>
    </main>
  );
}

export default AdminDashboard;