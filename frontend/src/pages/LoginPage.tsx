import { useState } from "react";
import { useNavigate } from "react-router-dom";

function LoginPage(){
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const navigate = useNavigate();

   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    setError("");
    setSuccess("");

    const form = e.currentTarget;

    const formData = new FormData(form);

    const data = {
      email: formData.get("email"),
      password: formData.get("password"),
    };

    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );

      const result = await response.json();
      console.log("LOGIN RESULT:" , result);

      if (!response.ok) {
        throw new Error(result.message || "Login failed");
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));
      window.dispatchEvent(new Event("auth-change"))
      console.log("SAVED TOKEN:",localStorage.getItem("token"));
      setSuccess("Login successful!");
      navigate("/");
      
      const token = localStorage.getItem("token");
      const profileResponse = await fetch(
          "http://localhost:5000/api/profile",
          {
            headers: {
               Authorization: `Bearer ${token}`,
            },
    }
);

const profileData = await profileResponse.json();

console.log(profileData);
      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to login"
      );
    } finally {
      setLoading(false);
    }
  };

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-16">
            <div className="mx-auto max-w-md rounded-2xl bg-white p-8 shadow-sm">
                <h1 className="text-3xl font-bold text-gray-900">Welcome Back</h1>
                <p className="mt-2 text-gray-600">Login to continue learning with SkillPath.</p>
            </div>

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
                    <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email</label>
                    <input type="email" id="email" name="email" placeholder="Enter email here" required
                      className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                    />
                </div>

                <div>
                    <label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">Password</label>
                    <input type="password" id="password" name="password" placeholder="Enter password here" required
                       className="w-full rounded-xl border border-gray-300 px-4 py-3 outline-none focus:border-purple-500"
                    />
                </div>
                <button type="submit" disabled={loading} className="w-full rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800 disabled:cursor-not-allowed disabled:opacity-60">
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    )
}
export default LoginPage;