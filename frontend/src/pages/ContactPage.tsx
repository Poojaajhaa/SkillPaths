import { useState } from "react";
function ContactPage() {
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [error , setError] = useState<string>("");
    const [loading , setLoading] = useState<boolean>(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;

    setLoading(true);
    setSubmitted(false);
    setError("");

    const formData = new FormData(form);

    const data = {
        name: formData.get("name"),
        email: formData.get("email"),
        subject: formData.get("subject"),
        message: formData.get("message"),
    };

    try {
        const response = await fetch("http://localhost:5000/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || "Something went wrong");
        }

        setSubmitted(true);
        form.reset();

    } catch (err) {
        setError(
            err instanceof Error
                ? err.message
                : "Unable to send message"
        );
    } finally {
        setLoading(false);
    }
};

    return (
        <main>
            <section className="px-6 py-20 bg-gray-50 flex justify-center items-center">
                <div className="text-center max-w-3xl">
                    <h2 className="text-2xl text-purple-900 font-bold uppercase tracking-wide">Get in touch</h2>
                    <h1 className="mt-3 text-3xl font-semibold text-gray-900">We’d Love to Hear From You</h1>
                    <p className="mt-4 text-gray-600 font-medium">
                        Have a question, feedback, or need help? Reach out to the SkillPath team and we’ll be happy to help.
                    </p>
                </div>
            </section>

            <section className="px-6 py-16 bg-white">
                <div className="max-w-6xl mx-auto grid gap-8 rounded-3xl bg-purple-50 p-6 shadow-sm md:grid-cols-2 md:p-10">
                    <div className="rounded-2xl bg-purple-900 p-6 text-white md:p-8">
                        <h2 className="text-2xl font-bold">Contact Info</h2>
                        <p className="mt-4 text-purple-100">
                            We’re here to help with course guidance, admissions, and any support you need.
                        </p>

                        <div className="mt-8 space-y-5 text-base">
                            <div className="flex items-center gap-3">
                                <span className="text-lg">✉️</span>
                                <span>support@skillpath.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📞</span>
                                <span>+91 98765 43210</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className="text-lg">📍</span>
                                <span>New Delhi, India</span>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-2xl bg-white p-6 shadow-sm md:p-8">
                        <h2 className="text-2xl font-bold text-gray-900">Contact Form</h2>

                        {submitted && (
                            <p className="mb-4 rounded-lg bg-green-100 p-3 text-green-700">Message sent successfully!</p>
                        )}
                        {error && (
                            <p className="mb-4 rounded-lg bg-red-100 p-3 text-red-700">{error}</p>
                        )}

                        <form className="mt-6 space-y-5"
                         onSubmit={handleSubmit}
                         >
                            <div>
                                <label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">Full Name</label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    placeholder="Enter your name"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">Email Address</label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="mb-2 block text-sm font-medium text-gray-700">Subject</label>
                                <input
                                    id="subject"
                                    name="subject"
                                    type="text"
                                    required
                                    placeholder="What can we help you with?"
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="mb-2 block text-sm font-medium text-gray-700">Message</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    required
                                    placeholder="Write your message..."
                                    className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-gray-800 outline-none transition focus:border-purple-500 focus:bg-white"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full rounded-xl bg-purple-700 px-5 py-3 font-semibold text-white transition hover:bg-purple-800"
                                disabled={loading}
                            >
                                {loading ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}

export default ContactPage;