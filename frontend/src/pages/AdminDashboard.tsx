import { useEffect, useState } from "react";
import type { Course } from "../components/courses/CourseCard";

const API_URL = "https://skillpath-backend.onrender.com";

function AdminDashboard() {
  const [, setCourses] = useState<Course[]>([]);
  const [, setLoading] = useState(true);

  const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
  const isAdmin = storedUser?.role === "ADMIN";

  type User = {
    id: number;
    name: string;
    email: string;
    role: string;
  };

  const [, setUsers] = useState<User[]>([]);

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
    if(!isAdmin) return;
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
  },[isAdmin]);

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      {/* ... baaki JSX same hai, kuch change nahi hua ... */}
    </main>
  );
}

export default AdminDashboard;