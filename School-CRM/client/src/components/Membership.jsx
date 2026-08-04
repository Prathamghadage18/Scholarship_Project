import React from "react";
import { FaCheckCircle } from "react-icons/fa";

const Membership = () => {
  const plans = [
    {
      id: 1,
      duration: "1 Year",
      price: "₹4,999",
      desc: "Perfect for schools starting out with CRM",
      features: [
        "Access to all CRM modules",
        "Basic support",
        "1 year updates",
        "Student & Teacher management",
        "Priority support",
        "Attendance Management",
        "Early access to new features",
        "Customizable modules",
      ],
    },
    {
      id: 2,
      duration: "2 Years",
      price: "₹8,999",
      desc: "Best value for growing schools",
      features: [
        "Access to all CRM modules",
        "Basic support",
        "2 year updates",
        "Student & Teacher management",
        "Priority support",
        "Attendance Management",
        "Early access to new features",
        "Customizable modules",
      ],
      highlight: true,
    },
    {
      id: 3,
      duration: "3 Years",
      price: "₹12,999",
      desc: "Long-term savings for schools",
      features: [
        "Access to all CRM modules",
        "Basic support",
        "3 year updates",
        "Student & Teacher management",
        "Priority support",
        "Attendance Management",
        "Early access to new features",
        "Customizable modules",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-bgDarkColor relative z-50 flex flex-col items-center py-40 px-4">
      <div className="absolute w-40 h-40 top-[130px] sm:left-[400px] left-[-50px] animate-spin [animation-duration:10s] rounded-full bg-gradient-to-tr from-primary to-[#00000000] opacity-50"></div>
      <h1 className="text-2xl sm:text-4xl font-bold text-white mb-4">
        Choose Your Membership Plan
      </h1>
      <p className="text-white mb-10 text-center max-w-3xl">
        Select the best subscription for your school to get full access to CRM
        features, including student management, teacher management, and advanced
        reporting.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
        {plans.map((plan) => (
          <div
            key={plan.id}
            className={`${plan.id==2 ? " scale-110":"hover:scale-105"} relative overflow-hidden bg-gradient-to-t from-[#00000024] to-[#010c47] rounded-3xl p-6 bg-blend-darken flex flex-col justify-between  transition-transform pb-10`}>
            <div>

            <h2 className="text-xl font-semibold text-white mb-2">
                {plan.duration}
              </h2>
              <p className="text-white mb-4">{plan.desc}</p>
              <p className="text-3xl font-bold text-white  mb-6">
                {plan.price}
              </p>
              <ul className="space-y-2">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-white text-sm">
                    <FaCheckCircle className="text-green-500 mr-2  " />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            <div className=" absolute bottom-0 left-0 w-full ">
              <button
              className={`mt-6 w-full py-4 px-4 relative overflow-hidden font-semibold   bg-primary text-white`}
            >
               <span className="shimmer"></span>
              Choose {plan.duration}
            </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Membership;
