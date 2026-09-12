import { NavLink } from "react-router-dom";
import { useState } from "react";

const API_URL = "https://skillpath-backend.onrender.com";

function BlogPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const articles = [
    {
        id: 1,
      category: "Web Development",
      title: "5 Skills Every Beginner Developer Should Learn",
      Description:
        "Discover the essential technical and problem-solving skills that can help you build a strong foundation in web development.",
      Date: "August 18, 2026",
    },
    {
        id: 2,
      category: "Career",
      title: "How to Build a Strong Learning Routine",
      Description:
        "Learn practical ways to stay consistent, manage your time, and make steady progress while learning new skills.",
      Date: "August 15, 2026",
    },
    {
        id: 3,
      category: "Technology",
      title: "Why Learning New Skills Matters",
      Description:
        "Explore how continuous learning can help you adapt to changing technology and grow your career.",
      Date: "August 12, 2026",
    },
  ];

  const handleSubscribe = async () => {
    setMessage("");
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await fetch(
        `${API_URL}/api/subscribe`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
             email: email.trim(),
           }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Subscription failed");
      }

      setMessage("Successfully subscribed! 🎉");
      setEmail("");
    } catch (error) {
      console.error("Subscribe error:", error);
      setError(
        error instanceof Error ? error.message : "Unable to subscribe. Please try again."
      )
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="flex items-center justify-center bg-gray-50 px-6 py-20">
        <div>
          <h2 className="text-center text-3xl font-bold text-purple-600">
            OUR BLOG
          </h2>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Insights to help learn and grow
          </h1>

          <p className="mt-3 text-center text-gray-600">
            Explore practical insights, learning resources, and career tips to
            help you build new skills and grow in your journey.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="px-6 py-20">
        <div className="mx-auto flex max-w-4xl flex-col items-center rounded-2xl bg-gray-50 px-6 py-12 text-center">
          <p className="text-center text-3xl font-bold text-purple-600">
            FEATURED ARTICLE
          </p>

          <div>
            <span className="bg-purple-600 text-sm font-bold text-white">
              Development
            </span>

            <h2 className="mt-5 text-3xl font-bold text-gray-900 md:text-4xl">
              How to start your journey in web development?
            </h2>
          </div>

          <p className="mt-4 max-w-2xl text-gray-500">
            A beginner-friendly guide to understanding the essential skills,
            tools, and learning path needed to start a career in web
            development.
          </p>

          <p className="mt-4 text-sm text-gray-500">
            By SkillPath Team • August 20, 2026
          </p>

          <NavLink
            to="/courses"
            className="mt-6 rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700"
          >
            Read More
          </NavLink>
        </div>
      </section>

      {/* Latest Articles */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 text-center">
            <p className="font-semibold text-purple-600">
              LATEST ARTICLES
            </p>

            <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
              Learn, Grow and Stay Updated
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-gray-600">
              Explore helpful articles, practical tips, and insights to support
              your learning and career journey.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                  {article.category}
                </span>

                <h3 className="mt-5 text-xl font-bold text-gray-900">
                  {article.title}
                </h3>

                <p className="mt-3 line-clamp-3 text-gray-600">
                  {article.Description}
                </p>

                <p className="mt-4 text-sm text-gray-500">
                  {article.Date}
                </p>

                <NavLink
                  to={`/blog/${article.id}`}
                  className="mt-6 inline-block font-medium text-purple-600 transition hover:text-purple-800"
                >
                  Read Article →
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Subscribe */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl rounded-2xl bg-purple-50 px-6 py-12 text-center">
          <h2 className="text-sm font-bold text-purple-600">
            STAY UPDATED
          </h2>

          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
            Keep Learning. Keep Growing.
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Get the latest learning resources, career tips, and helpful
            insights from SkillPath delivered to your inbox.
          </p>

          <div className="mx-auto mt-8 flex max-w-xl flex-col gap-3 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-100"
            />

            <button
              type="button"
              onClick={handleSubscribe}
              disabled={submitting}
              className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? "Subscribing..." : "Subscribe"}
            </button>
          </div>

          {message && (
            <p className="mt-4 font-medium text-green-600">
              {message}
            </p>
          )}

          {error && (
            <p className="mt-4 font-medium text-red-600">
              {error}
            </p>
          )}
        </div>
      </section>
    </main>
  );
}

export default BlogPage;

