import { NavLink, useParams } from "react-router-dom";

const articles = [
  {
    id: 1,
    category: "Web Development",
    title: "5 Skills Every Beginner Developer Should Learn",
    description:
      "Discover the essential technical and problem-solving skills that can help you build a strong foundation in web development.",
    date: "August 18, 2026",
    content:
      "Starting web development can feel overwhelming because there are many technologies to learn. A strong foundation in HTML, CSS, JavaScript, Git, and problem-solving can help beginners build confidence and create real projects.",
  },
  {
    id: 2,
    category: "Career",
    title: "How to Build a Strong Learning Routine",
    description:
      "Learn practical ways to stay consistent, manage your time, and make steady progress while learning new skills.",
    date: "August 15, 2026",
    content:
      "A good learning routine is based on consistency rather than studying for long hours. Set clear goals, divide your learning into smaller tasks, practice regularly, and review what you have learned.",
  },
  {
    id: 3,
    category: "Technology",
    title: "Why Learning New Skills Matters",
    description:
      "Explore how continuous learning can help you adapt to changing technology and grow your career.",
    date: "August 12, 2026",
    content:
      "Technology continues to change quickly. Learning new skills helps you understand new tools, solve problems more effectively, and stay prepared for new opportunities.",
  },
];

function ArticleDetailsPage() {
  const { id } = useParams();

  const article = articles.find(
    (article) => article.id === Number(id)
  );

  if (!article) {
    return (
      <main className="px-6 py-20 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Article Not Found
        </h1>

        <NavLink
          to="/blog"
          className="mt-6 inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white"
        >
          Back to Blog
        </NavLink>
      </main>
    );
  }

  return (
    <main>
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
            {article.category}
          </span>

          <h1 className="mt-5 text-3xl font-bold text-gray-900 md:text-5xl">
            {article.title}
          </h1>

          <p className="mt-5 text-gray-500">
            By SkillPath Team • {article.date}
          </p>
        </div>
      </section>

      <section className="px-6 py-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-lg leading-8 text-gray-600">
            {article.description}
          </p>

          <div className="mt-8">
            <p className="leading-8 text-gray-700">
              {article.content}
            </p>
          </div>

          <NavLink
            to="/blog"
            className="mt-10 inline-block font-medium text-purple-600 hover:text-purple-800"
          >
            ← Back to Blog
          </NavLink>
        </div>
      </section>
    </main>
  );
}

export default ArticleDetailsPage;

