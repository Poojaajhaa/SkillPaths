import { NavLink } from "react-router-dom";
function AboutPage() {

  const whoItsFor =[
    {
      title:"Beginners",
      description:"Start from the basics and build practical skills with beginner-friendly courses."
    },
    {
      title:"Students",
      description:"Gain practical knowledge and skills that complement your academic learning."
    },
    {
      title:"Career Switchers",
      description:"Learn new skills and prepare for opportunities in a different career path."
    },
    {
      title:"Professionals",
      description:"Upgrade your existing skills and stay prepared for the changing digital workplace."
    }
  ];

  const features = [
    {
      title: "Beginner-Friendly",
      description: "Learn through clear and easy-to-follow lessons."
    },{
      title: "Practical Learning",
      description: "Build skills through real-world examples and projects."
    },{
      title: "Flexible Learning",
      description: "Learn at your own pace and fit learning into your schedule."
    },{
      title: "Industry-Relevant",
      description: "Develop skills that align with modern digital career opportunities."
    }
      
  ];

  const educators = [
    {
      name: "Priya Sharma",
      role: "Frontend Developer",
      description: "Helps learners build strong frontend foundations through practical web development projects."
    },{
      name: "Rahul Verma",
      role: "Data Analytics Instructor",
      description: "Guides learners in understanding data, finding useful insights, and applying analytics to real-world problems."
    },{
      name: "Anaya Singh",
      role: "UI/UX Design Instructor",
      description: "Teaches learners how to create intuitive interfaces and meaningful user experiences through practical design methods."
    }
  ]
  return (
    <main>
      <section className="bg-gray-50 px-6 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <p className="font-semibold text-purple-600 tracking-wide">ABOUT SKILLPATH</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900 md:text-5xl">Learn practical skills for the modern digital world</h1>
          <p className="mt-4 text-lg text-gray-600 mx-auto max-w-2xl">SkillPath helps learners build practical, career-focused skills through structured courses designed for real-world growth.</p>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-10">Our Mission & Vision</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Our Mission</h2>
              <p className="mt-3 text-gray-600">SkillPath’s mission is to make practical, career-focused learning simple and accessible for learners at every stage.</p>
            </div>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900">Our Vision</h2>
              <p className="mt-3 text-gray-600">Our vision is to help people build relevant skills, grow with confidence, and prepare for opportunities in the modern digital world.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <div className="mb-10 text-center">
             <h2 className="text-3xl font-bold text-gray-900">
               Who It's For
             </h2>
             <p className="mx-auto mt-4 max-w-2xl text-gray-600">
                SkillPath is designed for learners at different stages of their learning and career journey.
             </p>
          </div>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {whoItsFor.map((person) => (
            <div
             key={person.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900">
            {person.title}
          </h3>
          <p className="mt-3 text-gray-600">
            {person.description}
          </p>
        </div>
      ))}
    </div>
   </div>
  </section>
  <section className="bg-gray-50 px-6 py-20">
   <div className="mx-auto max-w-7xl">
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        What Makes SkillPath Different
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-gray-600">
        Learn with a practical approach designed to make skill-building clear,
        flexible, and relevant.
      </p>
    </div>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {features.map((feature) => (
        <div
          key={feature.title}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900">
            {feature.title}
          </h3>
          <p className="mt-3 text-gray-600">
            {feature.description}
          </p>
        </div>
      ))}
    </div>
   </div>
  </section>

  <section className="px-6 py-20">
    <div className="mx-auto max-w-7xl">
    <div className="mb-10 text-center">
      <h2 className="text-3xl font-bold text-gray-900">
        Meet Our Educators
      </h2>
    </div>

    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
      {educators.map((educator) => (
        <div
          key={educator.name}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <h3 className="text-xl font-bold text-gray-900">
            {educator.name}
          </h3>
          <p className="mt-3 text-gray-600">
            {educator.role}
          </p>
          <p className="mt-3 text-gray-600">
            {educator.description}
          </p>
        </div>
      ))}
    </div>
   </div>
  </section>

  <section className="bg-purple-600 px-6 py-20">
  <div className="mx-auto max-w-3xl text-center">
    <h2 className="text-3xl font-bold text-white md:text-4xl">
      Start building skills that move you forward
    </h2>

    <p className="mx-auto mt-4 max-w-2xl text-purple-100">
      Explore practical courses and take the next step toward your learning and
      career goals with SkillPath.
    </p>

    <NavLink
      to="/courses"
      className="mt-8 inline-block rounded-lg bg-white px-6 py-3 font-semibold text-purple-600 transition hover:bg-gray-100"
    >
      Explore Courses
    </NavLink>
  </div>
</section>
  
</main>
  );
}

export default AboutPage;