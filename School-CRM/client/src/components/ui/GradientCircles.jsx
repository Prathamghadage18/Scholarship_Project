import React from "react";

export default function GradientCircles() {
  return (
    <div className="fixed min-h-screen w-full -z-10 border-gray-200 overflow-hidden">

      <div className="relative -z-0 top-10  ">
        {/* Circle 1 - Pink/Purple */}
        <div className="absolute animate-bounce [animation-duration:6s]  w-40 h-40 top-[50px] left-[-50px] rounded-full bg-gradient-to-tr from-fuchsia-500 to-purple-400 opacity-50"></div>

        {/* Circle 2 - Cyan/Blue */}
        <div className="absolute animate-bounce [animation-duration:5s] w-40 h-40 top-[-50px] left-[50px] rounded-full bg-gradient-to-tr from-cyan-400 to-blue-400 opacity-50"></div>

        {/* Circle 3 - Purple/Blue */}
        <div className="absolute animate-bounce [animation-duration:7s] w-40 h-40 top-[-50px] left-[-50px] rounded-full bg-gradient-to-tr from-purple-500 to-indigo-400 opacity-50"></div>

      </div>

      <div className="relative w-full h-screen -z-0 bottom-0 ">
        {/* Circle 1 - Pink/Purple */}
        <div className="absolute animate-bounce [animation-duration:6s] w-40 h-40 bottom-[50px] right-[-50px]   bg-gradient-to-tr from-fuchsia-500 to-purple-400 opacity-50 rounded-full"></div>

        {/* Circle 2 - Cyan/Blue */}
        <div className="absolute animate-bounce [animation-duration:5s] w-40 h-40 bottom-[-50px] right-[50px]    bg-gradient-to-tr from-cyan-400 to-blue-400 opacity-50 rounded-full"></div>

        {/* Circle 3 - Purple/Blue */}
        <div className="absolute animate-bounce [animation-duration:7s] w-40 h-40  bottom-[-50px] right-[-50px]   bg-gradient-to-tr from-purple-500 to-indigo-400 opacity-50 rounded-full"></div>
      </div>
    </div>
  );
}
