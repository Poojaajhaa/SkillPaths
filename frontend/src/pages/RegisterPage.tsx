import { useState } from "react";
import { NavLink } from "react-router-dom";

const API_URL = "https://skillpaths-backend.onrender.com";

function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [role, setRole] = useState("USER");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;

    const formData = new FormData(form);

    const data = {
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      role,
    };

    try {
      const response = await fetch(
        `${API_URL}/api/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Registration failed");
      }

      setSuccess("Registration successful!");
      form.reset();
      setRole("USER");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to register"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 px-6 py-16">
      <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">

        <h1 className="text-3xl font-bold text-gray-900">
          Create an Account
        </h1>

        <p className="mt-2 text-gray-600">
          Join SkillPath & start learning.
        </p>

        {error && (
          <p className="mt-6 rounded-lg bg-red-100 p-3 text-sm text-red-600">
            {error}
          </p>
        )}

        {success && (
          <p className="mt-6 rounded-lg bg-green-100 p-3 text-sm text-green-600">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
            <input type="text" name="name" id="name" placeholder="Enter your name" required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" id="email" placeholder="Enter your email" required
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" id="password" placeholder="Enter password" required minLength={8} 
              className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label htmlFor="role" className="mb-2 block text-sm font-medium text-gray-700">
              I want to
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole("USER")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  role === "USER"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
                aria-pressed={role === "USER"}
              >
                Learn (Buyer)
              </button>

              <button
                type="button"
                onClick={() => setRole("SELLER")}
                className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                  role === "SELLER"
                    ? "border-purple-600 bg-purple-50 text-purple-700"
                    : "border-gray-300 text-gray-600 hover:border-gray-400"
                }`}
                aria-pressed={role === "SELLER"}
              >
                Teach (Seller)
              </button>
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60">
            {loading ? "Creating Account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-gray-600">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="font-semibold text-purple-600 hover:text-purple-800"
            >
              Login
            </NavLink>
          </p>
        </form>
      </div>
    </main>
  );
}

export default RegisterPage;

