import { NavLink } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-purple-50 px-6 py-12">
      <div className="mx-auto grid max-w-7xl gap-10 text-center md:grid-cols-3 md:text-left">
        <div>
          <h2 className="text-2xl font-bold text-purple-600">
            SkillPath
          </h2>

          <p className="mt-4 max-w-sm text-gray-600">
            Learn practical skills, grow your knowledge, and build your future
            with SkillPath.
          </p>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">
            QUICK LINKS
          </h3>
          <div className="mt-4 flex flex-col gap-3">
            <NavLink to="/" className="text-gray-600 transition hover:text-purple-600">Home</NavLink>
            <NavLink to="/courses" className="text-gray-600 transition hover:text-purple-600">Courses</NavLink>
            <NavLink to="/about" className="text-gray-600 transition hover:text-purple-600">About</NavLink>
            <NavLink to="/blog" className="text-gray-600 transition hover:text-purple-600">Blog</NavLink>
          </div>
        </div>
        <div>
          <h3 className="text-sm font-bold text-gray-900">SUPPORT</h3>

          <div className="mt-4">
            <NavLink to="/contact" className="text-gray-600 transition hover:text-purple-600">Contact</NavLink>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-purple-200 pt-6 text-center">
        <p className="text-sm text-gray-500">
          © 2026 SkillPath. All rights reserved.
        </p>
      </div>

    </footer>
  );
}

export default Footer;