import { NavLink } from "react-router-dom";
import type { Course } from "../../types/course";

type CourseCardProps = {
  course: Course;
};

function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="flex h-full flex-col rounded-2xl bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
          {course.category}
        </span>

        {course.bestseller && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
            Bestseller
          </span>
        )}
      </div>

      <h2 className="mt-5 text-xl font-bold text-gray-900">{course.courseName}</h2>
      <p className="mt-3 flex-1 text-gray-600">{course.description}</p>

      <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-500">
        <span>{course.level}</span>
        <span>{course.duration}</span>
        {course.rating > 0 && (
          <span>
            {course.rating.toFixed(1)} ({course.totalRatings})
          </span>
        )}
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-gray-100 pt-5">
        <span className="font-bold text-purple-600">{course.price}</span>
        <NavLink
          to={`/courses/${encodeURIComponent(course.courseName)}`}
          className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700"
        >
          View Course
        </NavLink>
      </div>
    </article>
  );
}

export default CourseCard;
