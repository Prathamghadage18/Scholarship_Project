import React from "react";
import {
  FaUserTie,
  FaStar,
} from "react-icons/fa";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import Slider from "./ui/Slider";

const HomePage = () => {

  const services = [
    { title: "Quality Education", desc: "Smart classrooms and modern learning methods.", img: "https://www.the-report.com/site/assets/files/5710/a-new-plan-for-education-in-brazil_1.647x389.jpg" },
    { title: "Expert Teachers", desc: "Highly qualified and passionate educators.", img: "https://media.istockphoto.com/id/1401278253/photo/yes-you-tell-me-the-answer-to-my-question.webp?b=1&s=612x612&w=0&k=20&c=gIyaTCfI-fh4YwkVu0FdybJHcYyaxQsODkjElixDUCM=" },
    { title: "Cultural Activities", desc: "Opportunities to explore talents beyond academics.", img: "https://i.ytimg.com/vi/qHzvAT6ASqE/maxresdefault.jpg" },
    { title: "Sports & Fitness", desc: "Encouraging physical growth and teamwork.", img: "https://tse1.mm.bing.net/th/id/OIP.5PaVpZf5eqHitM6ednisbwHaE7?r=0&rs=1&pid=ImgDetMain&o=7&rm=3" },
  ];

  const testimonials = [
    {
      name: "Ravi Sharma",
      role: "Parent",
      text: "The school has transformed my child’s confidence and learning ability.",
    },
    {
      name: "Sneha Patil",
      role: "Student",
      text: "Amazing teachers and great opportunities in academics & extracurriculars.",
    },
    {
      name: "Arjun Mehta",
      role: "Alumni",
      text: "This school shaped my future with discipline and knowledge.",
    },
  ];

  const slideImages = [
    {
      img: "https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "School Library",
      description: "Experience the sun, sand, and surf at the beautiful beaches. Relax and unwind with a variety of water sports and seaside activities.",
      buttonText1: "Read More",
      buttonText2: "See More"
    },
    {
      img: "https://images.unsplash.com/photo-1705727210721-961cc64a6895?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "School lab",
      description: "Immerse yourself in the lush greenery and wildlife of the forest. Enjoy hiking trails, wildlife spotting, and nature photography.",
      buttonText1: "Read More",
      buttonText2: "See More"
    },
    {
      img: "https://images.unsplash.com/photo-1566938089211-5821c49b3548?q=80&w=1174&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "school playground",
      description: "Explore the vibrant city life, rich culture, and modern attractions. Visit historical landmarks, museums, and enjoy the nightlife.",
      buttonText1: "Read More",
      buttonText2: "See More"
    },
    {
      img: "https://plus.unsplash.com/premium_vector-1720710527301-367d09920932?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "School life",
      description: "Experience the sun, sand, and surf at the beautiful beaches. Relax and unwind with a variety of water sports and seaside activities.",
      buttonText1: "Read More",
      buttonText2: "See More"
    },
    {
      img: "https://images.unsplash.com/photo-1729655917606-e7bc2db6acb3?q=80&w=1089&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      title: "School events",
      description: "Experience the sun, sand, and surf at the beautiful beaches. Relax and unwind with a variety of water sports and seaside activities.",
      buttonText1: "Read More",
      buttonText2: "See More"
    },
  ];

  return (
    <>
      <Navbar />

      {/* 🌟 Hero Section */}
      <section
        id="home"
        className="relative overflow-hidden z-20 w-full h-[80vh] sm:h-screen flex justify-center items-center"
      >
        <Slider slideImages={slideImages} />
      </section>

      {/* ⭐ Stats Section */}
      <section className="relative z-20 bg-gradient-to-tr from-bgDarkColor via-bgDarkColor to-[#212f7d] py-10 px-3 sm:py-14 sm:px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-2 sm:grid-cols-4  sm:gap-6 text-center">
          <StatCard number="50+" label="Schools Onboarded" />
          <StatCard number="500+" label="Teachers Registered" />
          <StatCard number="10,000+" label="Students Managed" />
          <StatCard number="15,000+" label="Parents Engaged" />
        </div>
      </section>


      <div className=" w-full relative z-20  bg-bgDarkColor py-14 sm:px-6 p-4">
        <section id="about" className="sm:w-10/12 w-full mx-auto flex flex-col sm:flex-row gap-6 px-3 sm:px-6">
          <div className="absolute w-40 h-40 top-[30px] sm:left-[130px] left-[-50px] animate-spin [animation-duration:10s] rounded-full bg-gradient-to-tr from-primary to-[#00000000] opacity-50"></div>
          <div className="sm:w-1/2 w-full sm:p-4 mb-4">
            <h2 className="text-2xl sm:text-4xl text-white font-bold mb-4 sm:mb-6">About Us</h2>
            <p className="text-gray-200 leading-relaxed text-justify text-sm sm:text-base">
              Welcome to Our School,
              From its inception at the President’s Estate in 1941 as Church High School, through its transformation into Naveen Bharat School in 1947, and culminating in the establishment of DPS Mathura Road in 1949, the journey of DPS has been one of vision, growth, and revolutionising education in India. As India embarked on its journey of independence, The DPS Society emerged to fulfill the educational needs of a rapidly progressing nation . With its flagship school at DPS Mathura Road, followed by the establishment of DPS R.K. Puram in 1972, and now spanning the country with 222 schools, the DPS network continues to grow steadfastly in its commitment to serve the society.
            </p>
          </div>
          <div className=" sm:w-1/2 w-full mx-auto">
            <img src="https://www.yayskool.com/images/school/delhi-public-school-patiala-patiala-505721366.jpg" alt="" />
          </div>
        </section>
      </div>


      {/* Services Section */}
      <section id="service" className=" relative sm:flex justify-center items-center z-20  py-16 bg-bgDarkColor ">
        <div className="absolute w-40 h-40 top-[30px] sm:top-[180px] sm:left-[550px] left-[-50px] animate-spin [animation-duration:10s] rounded-full bg-gradient-to-tr from-primary to-[#00000000] opacity-50"></div>
        <div>
          <h2 className="text-2xl sm:text-4xl text-white font-bold sm:text-right ml-5 sm:ml-0 mb-4">Our Services</h2>
        <p className=" text-sm text-gray-200 max-w-4xl sm:text-right mx-auto mb-12 ml-5">
          We are committed to creating a transformative school CRM that empowers
          educators, engages students, and connects parents through technology-driven
          solutions.
        </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3  gap-8 max-w-6xl mx-auto px-6">
          {services.map((s, ind) => (
            <div
              key={ind}
              className=" relative overflow-hidden shadow-sm hover:shadow-md transition group cursor-pointer"
            >
              {/* Image */}
              <div className="flex justify-center z-0">
                <img
                  src={s.img}
                  alt={s.title}
                  className="object-cover w-full h-[200px] hover:scale-105 duration-200"
                />
              </div>

              {/* Text */}
              <div className="p-4 absolute z-20 top-0 left-0 w-full h-full bg-gradient-to-t from-bgDarkColor via-bgDarkColor/80 to-bgDarkColor/0 flex flex-col justify-end">
                <h3 className="text-xl font-semibold text-white mb-2">{s.title}</h3>
                <p className="text-gray-200 text-sm">{s.desc}</p>
              </div>

              {/* Animated Bottom Border */}
              <span className="absolute z-20 bottom-0 left-0 w-0 h-[3px] bg-primary transition-all duration-300 group-hover:w-full"></span>
            </div>

          ))}
        </div>
      </section>

      {/* Mission, Vision & Focus Section */}
      <section id="mission-vision-focus" className=" relative z-20  py-20 bg-bgDarkColor">
        <div className=" relative max-w-6xl mx-auto px-6 sm:text-center my-10">
          {/* Section Title */}
          <div className="absolute w-40 h-40 top-[-30px] sm:left-[250px] left-[-50px] animate-spin [animation-duration:10s] rounded-full bg-gradient-to-tr from-primary to-[#00000000] opacity-50"></div>

          <h2 className="text-2xl sm:text-4xl font-bold mb-4 text-white">Our Mission, Vision & Focus</h2>
          <p className=" text-sm text-gray-200 max-w-4xl text-justify sm:text-center mx-auto mb-12">
            We are committed to creating a transformative school CRM that empowers
            educators, engages students, and connects parents through technology-driven
            solutions.
          </p>

          {/* Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Mission Card */}
            <div className="group relative  rounded-2xl shadow-lg overflow-hidden p-8 transition duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-tr from-[#00000024] to-[#010c47]">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold  mb-4 text-white">
                  🎯 Mission
                </h3>
                <p className=" text-sm text-gray-100">
                  To simplify academic and administrative workflows while promoting
                  collaboration between principals, teachers, students, and parents
                  through a seamless digital platform.
                </p>
              </div>
            </div>

            {/* Vision Card */}
            <div className="group relative  rounded-2xl shadow-lg overflow-hidden p-8 transition duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-tr from-[#26761f89] to-[#00000000]">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold  mb-4 text-white">
                  🌍 Vision
                </h3>
                <p className=" text-sm text-gray-100">
                  To revolutionize education management by building smart, scalable,
                  and inclusive systems that nurture transparency, efficiency, and
                  academic excellence for the future.
                </p>
              </div>
            </div>

            {/* Focus Card */}
            <div className="group relative rounded-2xl shadow-lg overflow-hidden p-8 transition duration-300 hover:scale-105 hover:shadow-xl bg-gradient-to-tr from-[#00000024] to-[#2d0147]">
              <div className="relative z-10">
                <h3 className="text-2xl font-semibold  mb-4 text-white">
                  🔍 Focus
                </h3>
                <p className=" text-sm text-gray-100">
                  We focus on delivering user-friendly solutions, ensuring data security,
                  and creating meaningful insights that empower decision-making and
                  enhance the learning journey.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      
       {/* Features Section */}
      <section id="features" className=" relative lg:flex flex-row-reverse lg:items-center lg:justify-center z-20  py-20 px-6  bg-bgDarkColor">
        <div className="absolute w-40 h-40 top-[50px] md:top-[200px] md:left-[950px] left-[-50px] animate-spin [animation-duration:10s] rounded-full bg-gradient-to-tr from-primary to-[#00000000] opacity-50"></div>
        <div className=" sm:ml-10">
          <h2 className="text-2xl sm:text-4xl text-white font-bold sm:text-left  mb-4">Core Features</h2>
        <p className=" text-sm text-gray-200 max-w-4xl  sm:text-left mx-auto mb-12">
          We are committed to creating a transformative school CRM that empowers
          educators, engages students, and connects parents through technology-driven
          solutions.
        </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            title="Role-Based Access"
            desc="Secure dashboards for Principals, Teachers, Students & Parents."
          />

          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/3135/3135673.png"
            title="Study Materials"
            desc="Teachers upload notes, PDFs & assignments. Students & parents access easily."
          />

          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/3135/3135681.png"
            title="Attendance Management"
            desc="Mark daily attendance & notify parents instantly if absent."
          />

          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/3135/3135698.png"
            title="Grades & Reports"
            desc="Simple report cards & progress tracking for students and parents."
          />

          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/3135/3135712.png"
            title="Bus Tracking"
            desc="Parents view live bus location (manual/GPS updates)."
          />

          <FeatureCard
            image="https://cdn-icons-png.flaticon.com/512/3135/3135706.png"
            title="Parent Portal"
            desc="Announcements, child profile, materials, grades & attendance."
          />
        </div>
      </section>


      <section className=" relative z-20  py-16 px-6  bg-bgDarkColor ">
        {/* Geometric background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute top-0 left-0 w-full h-full bg-repeat bg-[length:40px_40px] text-blue-500"
            style={{
              backgroundImage: `
        linear-gradient(to right, rgb(0 97 255) 1px, transparent 1px),
        linear-gradient(to bottom, rgb(0 97 255) 1px, transparent 1px)
      `,
            }}
          ></div>
        </div>


        <h2 className="text-2xl sm:text-4xl font-bold text-center text-white mb-10">What Our Members Say</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-6xl mx-auto px-3 sm:px-6">
          {testimonials.map((t, i) => (
            <div key={i} className=" z-10 bg-bgDarkColor rounded-3xl border border-[#0d133e] p-6  shadow-sm hover:shadow-lg transition text-center">
              <FaUserTie className="text-primary text-5xl mx-auto mb-4" />
              <p className=" text-gray-200 italic mb-4 text-sm ">“{t.text}”</p>
              <h4 className="text-lg font-semibold text-white">{t.name}</h4>
              <p className="text-sm text-gray-200">{t.role}</p>
              <div className="flex justify-center mt-3 text-yellow-400">
                {[...Array(5)].map((_, idx) => (
                  <FaStar key={idx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>



      {/* CTA Section */}
      <section className=" relative z-20 bg-bgDarkColor py-16 text-center">
        <h2 className="text-2xl sm:text-4xl text-white md:text-4xl font-bold mb-6">
          Transform Your School with Smart CRM
        </h2>
        <p className=" text-sm max-w-2xl mx-auto mb-8 text-gray-200">
          Simple, powerful & accessible tools for teachers, parents, students,
          and principals. Start with the MVP today!
        </p>
        <Link to={'/login'}>
          <button className="bg-primary animate-pulse text-white font-semibold px-8 py-3 rounded-lg  shadow-xl shadow-primary ">
            Get Started
          </button>
        </Link>
        <div className="flex justify-center mt-20 rounded-2xl overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m16!1m12!1m3!1d38709.89409263717!2d77.01623460898655!3d28.456983559303204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!2m1!1sDelhi%20school!5e1!3m2!1sen!2sin!4v1757410080489!5m2!1sen!2sin"
            width={"90%"}
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="relative z-20"
          ></iframe>
        </div>
      </section>

      {/* Newsletter Section */}
      <section id="contact" className=" w-full sm:px-2 py-14  text-center relative overflow-hidden">

        <div className=" fixed -z-0 top-0 left-0 w-full h-full ">
          <img src="https://abandonedkansai.com/wp-content/uploads/2016/10/school-hallway-next-to-a-slope.jpg" alt="bannerimg" className=" w-full h-full object-cover" />
        </div>

        <div className=" relative z-10 sm:max-w-2xl  mx-auto bg-white/20 bg-opacity-90 backdrop-blur-md p-8 sm:rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-white">
            📬 Stay Updated with School CRM
          </h3>
          <p className="mb-6 text-gray-200">
            Subscribe to receive product updates and new features.
          </p>
          <form className="flex flex-col sm:flex-row justify-center gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="px-4 py-3 bg-bgDarkColor w-full focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button className="bg-primary text-white px-6 py-3 shadow hover:bg-primary w-full sm:w-auto">
              Subscribe
            </button>
          </form>

        </div>
      </section>

      <Footer />
    </>
  );
};

const FeatureCard = ({ image, title, desc }) => (
  <div className="bg-gradient-to-tr from-[#202f7b] via-[#00000000] to-[#00000000] backdrop-blur-md p-6 shadow-lg hover:shadow-xl text-center  transition overflow-hidden group">

    <div className="relative -z-0 top-10 group-hover:inset-5 inset-0 duration-200 ">
      {/* Circle 1 - Pink/Purple */}
      <div className="absolute w-20 h-20 top-[-50px] left-[-50px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-400 opacity-50"></div>
      {/* Circle 2 - Cyan/Blue */}
      <div className="absolute w-20 h-20 top-[-80px] left-[-10px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-400 opacity-50"></div>
      {/* Circle 3 - Purple/Blue */}
      <div className="absolute w-20 h-20 top-[-80px] left-[-50px] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 opacity-50"></div>
    </div>

    <div className="mb-4 flex justify-center bg-white rounded-full w-14 h-14 mx-auto items-center shadow-md group-hover:scale-110 transition duration-300">
      <img
        src={image}
        alt={title}
        className="w-16 h-16 object-contain"
      />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-200 text-sm">{desc}</p>

    <div className="relative  -z-0 bottom-0 right-0 group-hover:inset-5 inset-0 duration-200 ">
      {/* Circle 1 - Pink/Purple */}
      <div className="absolute w-20 h-20 top-[-50px] right-[-50px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-400 opacity-50"></div>
      {/* Circle 2 - Cyan/Blue */}
      <div className="absolute w-20 h-20 top-[-30px] right-[-10px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-400 opacity-50"></div>
      {/* Circle 3 - Purple/Blue */}
      <div className="absolute w-20 h-20 top-[-80px] right-[-50px] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 opacity-50"></div>
    </div>
  </div>
);

const StatCard = ({ number, label }) => (
  <div className=" relative  bg-gradient-to-tr from-primary to-[#00000000] opacity-80 sm:rounded-full shadow-sm p-6 hover:shadow-md transition">
    <h3 className=" z-10 text-2xl sm:text-3xl font-bold text-white">{number}</h3>
    <p className=" z-10 text-gray-200 mt-2 text-sm">{label}</p>
  </div>
);

export default HomePage;
