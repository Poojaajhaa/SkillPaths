import { useEffect, useState } from "react";
import type { Course } from "../components/courses/CourseCard";
import { useNavigate } from "react-router-dom";

const API_URL = "https://skillpaths-backend.onrender.com";


function CartPage() {
  const [cartItems, setCartItems] = useState<Course[]>([]);
  const [checkingOut, setCheckingOut] = useState(false)
  const navigate = useNavigate();

  useEffect(() => {
    const loadCart = () => {
      try {
        const storedCart = JSON.parse(
          localStorage.getItem("cart") || "[]"
        ) as Course[];

        setCartItems(Array.isArray(storedCart) ? storedCart : []);
      } catch {
        setCartItems([]);
      }
    };

    loadCart();

    window.addEventListener("cart-change", loadCart);

    return () => {
      window.removeEventListener("cart-change", loadCart);
    };
  }, []);

  const removeFromCart = (courseId: number) => {
    const updatedCart = cartItems.filter(
      (item) => item.id !== courseId
    );

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCartItems(updatedCart);

    window.dispatchEvent(new Event("cart-change"));
  };

  const handleCheckout = async() => {
    const token = localStorage.getItem("token");

    if(!token) {
      navigate("/login");
      return;
    }

    setCheckingOut(true);

    try {
      for(const item of cartItems) {
        const response = await fetch(`${API_URL}/api/orders` ,{
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({courseId: item.id}),
        });

        if(!response.ok) {
          const data = await response.json();
          throw new Error(data.message || "Failed to create order");
        } 
      }
          
      localStorage.setItem("cart", JSON.stringify([]));
      window.dispatchEvent(new Event("cart-change"));

      navigate("/my-orders");


    } catch (error) {
        console.error("Checkout error:", error);
        alert("Checkout failed. Please try again.")
    } finally {
      setCheckingOut(false);
    }
  };

  const subtotal = cartItems.reduce((sum: number, item: Course) => {
    const numericPrice = Number(
      String(item.price).replace(/[^\d.]/g, "")
    );

    return sum + (Number.isFinite(numericPrice) ? numericPrice : 0);
  }, 0);

  return (
    <div className="mx-auto max-w-5xl px-6 py-10">
      <h1 className="mb-8 text-3xl font-bold text-gray-900">
        Your Cart
      </h1>

      {cartItems.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-10 text-center shadow-sm">
          <p className="text-lg font-medium text-gray-700">
            Your cart is empty.
          </p>

          <p className="mt-2 text-sm text-gray-500">
            Add a course to get started.
          </p>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-4">
            {cartItems.map((course) => (
              <div
                key={course.id}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    {course.courseName}
                  </h2>

                  <p className="mt-1 text-sm text-gray-600">
                    {course.category}
                  </p>

                  <p className="mt-2 text-lg font-bold text-purple-600">
                    {course.price}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(course.id)}
                  className="rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-100"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <aside className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
              Summary
            </h2>

            <div className="mt-5 flex items-center justify-between text-gray-600">
              <span>Courses</span>
              <span>{cartItems.length}</span>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4 text-lg font-bold text-gray-900">
              <span>Total</span>

              <span>
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>

            <button
              type="button"
              onClick={handleCheckout}
              disabled={checkingOut}
              className="mt-6 w-full rounded-xl bg-purple-600 px-4 py-3 text-sm font-semibold text-white transition hover:bg-purple-700"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}

export default CartPage;

