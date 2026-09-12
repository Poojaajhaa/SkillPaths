import { NavLink, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import type { Course } from "../components/courses/CourseCard";

const API_URL = "https://skillpaths-backend.onrender.com";


type Lesson = {
    id: number;
    title: string;
    duration: string | null;
    order: number;
};

type section = {
    id: number;
    title: string;
    order: number;
    lessons: Lesson[];
};

type Review = {
    id: number;
    rating: number;
    comment: string | null;
    createdAt: string;
    user: { name: string };
};


function CourseDetailsPage (){
    const { courseName } = useParams();

    const [course, setCourse] = useState<Course | null>(null)
    const [curriculum , setCurriculum] = useState<section[]>([]);
    const [owns, setOwns] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [reviews, setReviews] = useState<Review[]>([]);
    const [myRating, setMyRating] = useState(0);
    const [myComment, setMyComment] = useState("");
    const [submittingReview, setSubmittingReview] = useState(false);
    const [reviewMessage, setReviewMessage] = useState("");


    useEffect(() => {
        const loadCourses = async() => {
            try {
              const response = await fetch(
                `${API_URL}/api/courses/${encodeURIComponent(courseName || "")}`
              );
            
              if(!response.ok){
                throw new Error("Course not found");
              }

              const data: Course = await response.json();
              setCourse(data);

              const curriculumRes = await fetch(
                `${API_URL}/api/courses/${data.id}/curriculum-preview`
              );
              if(curriculumRes.ok){
                const curriculumData = await curriculumRes.json();
                setCurriculum(curriculumData);
              }

              const reviewsRes = await fetch(
                `${API_URL}/api/courses/${data.id}/reviews`
              );
               if (reviewsRes.ok) {
                  const reviewsData = await reviewsRes.json();
                  setReviews(reviewsData);
                }

              const token = localStorage.getItem("token");
              if(token){
                const ownRes = await fetch(
                    `${API_URL}/api/orders/owns/${data.id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                if(ownRes.ok){
                    const ownData = await ownRes.json();
                    setOwns(ownData.owns);
                }
              }
            } catch (err) {
                setError("Unable to load course");
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCourses();
    },[courseName]);

    const addToCart = () => {
        if (!course) return;

        const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
        const alreadyInCart = existingCart.some((c: Course) => c.id === course.id);

        if (!alreadyInCart) {
            const updatedCart = [...existingCart, course];
            localStorage.setItem("cart", JSON.stringify(updatedCart));
            window.dispatchEvent(new Event("cart-change"));
        }
    };

    const submitReview = async () => {
        if (!course || myRating === 0) {
            setReviewMessage("Please select a rating.");
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            setReviewMessage("Please log in to leave a review.");
            return;
        }

        setSubmittingReview(true);
        setReviewMessage("");

        try {
            const response = await fetch(
                `${API_URL}/api/courses/${course.id}/reviews`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        rating: myRating,
                        comment: myComment,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to submit review");
            }

            setMyComment("");
            setMyRating(0);
            setReviewMessage("Review submitted! Thank you.");

            const reviewsRes = await fetch(
                `${API_URL}/api/courses/${course.id}/reviews`
            );
            if (reviewsRes.ok) {
                const reviewsData = await reviewsRes.json();
                setReviews(reviewsData);
            }
        } catch (error: any) {
            setReviewMessage(error.message || "Something went wrong");
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return <p className="p-10 text-center">Loading course...</p>;
    }

    if (error) {
        return <p className="p-10 text-center text-red-600">{error}</p>;
    }

    if (!course) {
        return <p className="p-10 text-center">Course not found</p>;
    }

    const totalLesson = curriculum.reduce((sum, section) => sum + section.lessons.length, 0);

    return (
        <main className="min-h-screen bg-gray-50 px-6 py-16">
            <div className="mx-auto max-w-5xl">
                <div className="rounded-2xl bg-white p-8 shadow-sm">
                    <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">
                        {course.category}
                    </span>
                    <h1 className="mt-5 text-4xl font-bold text-gray-900">{course.courseName}</h1>
                    <p className="mt-4 text-lg text-gray-600">{course.description}</p>

                    <div className="mt-8 grid gap-4 sm:grid-cols-3">
                        <div className="rounded-xl bg-gray-50 p-5">
                            <p className="text-sm text-gray-500">Level</p>
                            <p className="mt-1 font-bold text-gray-900">{course.level}</p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-5">
                            <p className="text-sm text-gray-500">Duration</p>
                            <p className="mt-1 font-bold text-gray-900">{course.duration}</p>
                        </div>

                        <div className="rounded-xl bg-gray-50 p-5">
                            <p className="text-sm text-gray-500">Price</p>
                            <p className="mt-1 font-bold text-purple-600">{course.price}</p>
                        </div>
                    </div>

                    <div className="mt-8">
                        {owns ? (
                            <NavLink
                                to={`/learn/${course.id}`}
                                className="inline-block rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                            >
                                Go to Course
                            </NavLink>
                        ) : (
                            <button
                                type="button"
                                onClick={addToCart}
                                className="rounded-xl bg-purple-600 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-700"
                            >
                                Add to cart
                            </button>
                        )}
                    </div>
                </div>

                {curriculum.length > 0 && (
                    <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
                        <h2 className="mb-4 text-2xl font-bold text-gray-900">Course Content</h2>
                        <p className="mb-4 text-sm text-gray-500">
                            {curriculum.length} sections • {totalLesson} lessons
                        </p>

                        <div className="space-y-4">
                            {curriculum.map((section) => (
                                <div key={section.id} className="rounded-xl border p-4">
                                    <h3 className="mb-2 font-semibold text-gray-900">
                                        {section.order}. {section.title}
                                    </h3>

                                    <ul>
                                        {section.lessons.map((lesson) => (
                                            <li
                                                key={lesson.id}
                                                className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-gray-600"
                                            >
                                                <span>
                                                    {owns ? "▶" : "🔒"}
                                                    {lesson.title}
                                                </span>
                                                {lesson.duration && (
                                                    <span className="text-xs text-gray-400">
                                                        {lesson.duration}
                                                    </span>
                                                )}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-6 rounded-2xl bg-white p-8 shadow-sm">
                    <h2 className="mb-4 text-2xl font-bold text-gray-900">Ratings & Reviews</h2>

                    {course.rating > 0 && (
                        <p className="mb-6 text-sm text-gray-600">
                            ⭐ {course.rating.toFixed(1)} ({course.totalRatings}{" "}
                            {course.totalRatings === 1 ? "review" : "reviews"})
                        </p>
                    )}

                    {owns && (
                        <div className="mb-8 rounded-xl border p-5">
                            <h3 className="mb-3 font-semibold">Leave a Review</h3>

                            <div className="mb-3 flex gap-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setMyRating(star)}
                                        className={`text-2xl ${
                                            star <= myRating ? "text-yellow-500" : "text-gray-300"
                                        }`}
                                        aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
                                    >
                                        ★
                                    </button>
                                ))}
                            </div>

                            <textarea
                                placeholder="Share your experience (optional)"
                                value={myComment}
                                onChange={(e) => setMyComment(e.target.value)}
                                rows={3}
                                className="w-full rounded-lg border px-3 py-2 text-sm"
                            />

                            {reviewMessage && (
                                <p className="mt-2 text-sm text-gray-600">{reviewMessage}</p>
                            )}

                            <button
                                type="button"
                                onClick={submitReview}
                                disabled={submittingReview || myRating === 0}
                                className="mt-3 rounded-lg bg-purple-600 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-700 disabled:opacity-50"
                            >
                                {submittingReview ? "Submitting..." : "Submit Review"}
                            </button>
                        </div>
                    )}

                    {reviews.length === 0 ? (
                        <p className="text-sm text-gray-500">No reviews yet.</p>
                    ) : (
                        <div className="space-y-4">
                            {reviews.map((review) => (
                                <div key={review.id} className="border-b pb-4">
                                    <div className="flex items-center justify-between">
                                        <p className="font-semibold text-gray-900">{review.user.name}</p>
                                        <span className="text-yellow-500">
                                            {"★".repeat(review.rating)}
                                            {"☆".repeat(5 - review.rating)}
                                        </span>
                                    </div>
                                    {review.comment && (
                                        <p className="mt-1 text-sm text-gray-600">{review.comment}</p>
                                    )}
                                    <p className="mt-1 text-xs text-gray-400">
                                        {new Date(review.createdAt).toLocaleDateString()}
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}

export default CourseDetailsPage;