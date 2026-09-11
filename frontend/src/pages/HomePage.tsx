import { NavLink } from "react-router-dom";

function HomePage () {
    const previewCourses = [
        {
          courseName: "React Fundamentals",
          description: "Learn the fundamentals of React and build modern, interactive user interfaces.",
          category: "Development",
          price: "₹1,999",
        },
         {
      courseName: "UI/UX Design Basics",
      description:
        "Understand the principles of user interface and user experience design.",
      category: "Design",
      price: "₹1,499",
    },
    {
      courseName: "JavaScript Essentials",
      description:
        "Build a strong foundation in JavaScript and modern web development.",
      category: "Programming",
      price: "₹999",
    },
    ];
    const testimonials = [
    {
      quote:
        "SkillPath helped me understand concepts more clearly and build practical skills through structured learning.",
      name: "Priya Sharma",
      title: "Aspiring Frontend Developer",
      course: "React Fundamentals",
    },
    {
      quote:
        "The courses are well-structured and the instructors are top-notch. I feel much more confident in my skills.",
      name: "Rahul Verma",
      title: "Data Science Student",
      course: "Data Analytics",
    },
    {
      quote:
        "A great platform for anyone looking to upskill. The community support is a huge plus!",
      name: "Anaya Singh",
      title: "UI/UX Designer",
      course: "UI/UX Design Basics",
    },
  ];
    return (
        <main>
            <section className="mx-auto flex min-h-[80vh] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
                <span className="mb-6 rounded-full bg-purple-100 px-4 py-2 text-sm font-medium text-purple-700">
                    Learn. Grow. Build your Future.
                </span>

                <h1 className="max-w-4xl text-4xl font-bold leading-tight text-gray-900 md:text-6xl">
                    Discover Skills That
                    <span className="text-purple-600">Shape Your Future</span>
                </h1>

                <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-600">
                    Explore courses designed to help you learn new skills, grow your
                    knowledge, and take the next step in your career.
                </p>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row">
                    <NavLink to="/courses" className="rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700">
                        Explore Courses
                    </NavLink>

                    <NavLink to="/about" className="rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition hover:bg-gray-100">
                         Learn More
                    </NavLink>
                </div>
                
            </section>

            {/* Courses preview section */}
            <section className="bg-gray-50 px-6 py-20">
                <div className="mx-auto max-w-7xl">
                   <div className="mb-12 text-center">
                    <p className="font-semibold text-purple-600">
                        EXPLORE COURSES
                    </p>

                    <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                         Learn skills that matter
                    </h2>

                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Explore practical courses designed to help you build knowledge and move forward in your career.
                    </p>
                   </div>


                   {/* course card */}

                   <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                    {previewCourses.map((course)=> (
                        <div key={course.courseName} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                            <span className="inline-block rounded-full bg-purple-100 px-3 py-1 text-sm font-medium text-purple-700">{course.category}</span>
                            <h3 className="mt-5 text-xl font-bold text-gray-900">{course.courseName}</h3>
                            <p className="mt-3 line-clamp-2 text-gray-600" >{course.description}</p>

                            <div className="mt-6 flex items-center justify-between" >
                                <span className="text-lg font-bold text-purple-600">{course.price}</span>
                                <NavLink to="/courses"
                                    className="font-medium text-purple-600 hover:text-purple-800">
                                    View Course
                                </NavLink>
                            </div>
                        </div>

                    ))}


  
                </div>
                <div className="mt-12 text-center">
                    <NavLink to="/courses" className="inline-block rounded-lg bg-purple-600 px-6 py-3 font-semibold text-white transition hover:bg-purple-700" >
                        View All Courses
                    </NavLink>
                </div>
                </div>
            </section>

            {/* why choose Skill path */}
            <section className="bg-white px-6 py-20">
            <div className="mx-auto max-w-7xl">

                <div className="mb-12 text-center">
                    <p className="font-semibold text-purple-600">
                        WHY CHOOSE SKILLPATH
                    </p>

                     <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                        Learn with a clear path
                     </h2>

                     <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        Build practical skills through structured learning designed to help you grow with confidence.
                     </p>
                </div>

                {/* Feature cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-2xl bg-gray-50 p-6">
                        <h3 className="text-lg font-bold text-gray-900">Expert-Led Courses</h3>
                        <p className="mt-2 text-gray-600">
                            Learn from industry professionals who bring real-world experience to every lesson.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-6">
                        <h3 className="text-lg font-bold text-gray-900">Flexible Learning</h3>
                        <p className="mt-2 text-gray-600">
                            Study at your own pace with on-demand videos and lifetime access to course materials.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-6">
                        <h3 className="text-lg font-bold text-gray-900">Community Support</h3>
                        <p className="mt-2 text-gray-600">
                            Join a community of learners and get help from instructors and peers.
                        </p>
                    </div>
                    <div className="rounded-2xl bg-gray-50 p-6">
                        <h3 className="text-lg font-bold text-gray-900">Career-focused Learning</h3>
                        <p className="mt-2 text-gray-600">
                            Build practical skills that help you prepare for real-world opportunities and career growth.
                        </p>
                    </div>
                </div>

            </div>
        </section>

        {/* Student testimonials */}
        <section className="bg-gray-50 px-6 py-20">
              <div className="mx-auto max-w-7xl">
                <div className="mb-12 text-center">
                    <p className="font-semibold text-purple-600">Student Testimonials</p>
                    <h2 className="mt-3 text-3xl font-bold text-gray-900 md:text-4xl">
                        What our students say
                    </h2>
                    <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                        See how learners are building new skills and growing through their learning journey with SkillPath.
                    </p>
                </div>

                {/* card */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.name} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="text-lg text-yellow-500">★★★★★</div>
                <p className="mt-4 text-gray-600">“{testimonial.quote}”</p>
                <div className="mt-6">
                  <h3 className="font-bold text-gray-900">
                    {testimonial.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    {testimonial.title}
                  </p>
                  <p className="mt-1 text-sm text-purple-600">{testimonial.course}</p>
                </div>
              </div>
            ))} 
          </div>
            </div>
        </section>

         {/* final CTA */}
         <section>
            <div className="mx-auto max-w-7xl text-center px-6 py-20">
                    <h2 className="text-3xl font-bold text-gray-900 md:text-4xl">Take the next step toward your career</h2>
                    <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-600">Explore practical courses, build valuable skills, and learn at your own pace with SkillPath.</p>
                    <NavLink to="/courses" className="mt-8 inline-block rounded-lg bg-purple-600 px-6 py-3 font-medium text-white transition hover:bg-purple-700">Explore Courses</NavLink>
            </div>
         </section>
        </main>
    )
}

export default HomePage;