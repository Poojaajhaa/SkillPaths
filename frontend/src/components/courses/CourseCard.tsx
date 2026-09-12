import { NavLink } from "react-router-dom";

const API_URL = "https://skillpath-backend.onrender.com";

export type Course = {
  id: number;
  courseName: string;
  description: string;
  category: string;
  price: string;
  level: string;
  duration: string;
  rating: number;
  totalRatings: number;
  bestseller: boolean;
};

export type CourseCardProps = {
  course: Course;
};

function CourseCard({ course }: CourseCardProps) {

  const handleAddToCart = () => {
    const existingCart = JSON.parse(
      localStorage.getItem("cart") || "[]"
    );

    const alreadyInCart = existingCart.some(
      (item: Course) => item.id === course.id
    );

    if (alreadyInCart) {
      alert("Course is already in your cart!");
      return;
    }

    const updatedCart = [...existingCart, course];

    localStorage.setItem(
      "cart",
      JSON.stringify(updatedCart)
    );

    window.dispatchEvent(new Event("cart-change"));

    alert("Course added to cart!");
  };

  const handleBuy = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify({
          courseId: course.id,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Purchase failed");
        return;
      }

      alert("Order created successfully!");
    } catch (error) {
      console.error("Purchase error:", error);
      alert("Purchase failed");
    }
  }
    

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">

      {/* Category */}
      <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
        {course.category}
      </span>

      {course.bestseller && (
        <span className="ml-2 inline-block rounded-full bg-yellow-100 px-3 py-1 text-sm font-semibold text-yellow-700">
          Bestseller
        </span>
      )}

      {/* Course Name */}
      <h3 className="mt-5 text-xl font-bold text-gray-900">
        {course.courseName}
      </h3>

      <div className="mt-2 flex items-center gap-2">
        <span className="font-bold text-yellow-500">
          ⭐ {course.rating}
        </span>

        <span className="text-sm text-gray-500">
           ({course.totalRatings} ratings)
        </span>
      </div>

      {/* Description */}
      <p className="mt-5 text-gray-600">
        {course.description}
      </p>

      {/* Level + Duration */}
      <div className="mt-5 flex items-center gap-4 text-sm font-bold text-gray-500">
        <span className="text-gray-900">
          {course.level}
        </span>

        <span className="text-gray-900">
          {course.duration}
        </span>
      </div>

      {/* Price */}
      <h3 className="mt-5 text-xl font-bold text-gray-900">
        {course.price}
      </h3>

      {/* Cart + Buy */}
      <div className="mt-5 flex gap-3">

        <button
          type="button"
          onClick={handleAddToCart}
          className="flex-1 rounded-xl border border-purple-600 px-4 py-3 text-sm font-semibold text-purple-600 transition hover:bg-purple-50"
        >
          Add to Cart
        </button>

        <button
          type="button"
          onClick={handleBuy}
          className="flex-1 rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
        >
          Buy Now
        </button>

      </div>

      {/* View Course */}
      <div className="mt-6 flex items-center justify-between">

        <NavLink
          to={`/courses/${course.courseName}`}
          className="font-medium text-purple-600 hover:text-purple-800"
        >
          View Course
        </NavLink>

      </div>

    </div>
  );
}

export default CourseCard;
