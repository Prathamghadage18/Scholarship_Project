import React, { useState, useRef, useEffect } from "react";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import { motion, AnimatePresence } from "framer-motion";

const ImageSlider = ({ slideImages, autoPlay = true, interval = 8000 }) => {
  const [counter, setCounter] = useState(0);
  const [typedText, setTypedText] = useState(""); // ✅ add typedText state
  const slidesRef = useRef(null);
  const timeoutRef = useRef(null);

  const goPrev = () => {
    setCounter((prev) => (prev === 0 ? slideImages.length - 1 : prev - 1));
  };

  const goNext = () => {
    setCounter((prev) => (prev === slideImages.length - 1 ? 0 : prev + 1));
  };

  // Auto slide
  useEffect(() => {
    if (autoPlay) {
      timeoutRef.current = setTimeout(goNext, interval);
    }
    return () => clearTimeout(timeoutRef.current);
  }, [counter, autoPlay, interval]);

  useEffect(() => {
    if (slidesRef.current) {
      slidesRef.current.style.transform = `translateX(-${counter * 100}%)`;
    }
  }, [counter]);

  // Typing effect for description
  useEffect(() => {
    let i = 0;
    setTypedText(""); // reset text when slide changes
    const text = slideImages[counter].description;
    const typingInterval = setInterval(() => {
      if (i < text.length) {
        setTypedText((prev) => prev + text.charAt(i));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 40); // speed of typing
    return () => clearInterval(typingInterval);
  }, [counter, slideImages]);

  return (
    <div
      className="relative w-full h-full overflow-hidden shadow-xl group"
      // onMouseEnter={() => clearTimeout(timeoutRef.current)}
      onMouseLeave={() => (timeoutRef.current = setTimeout(goNext, interval))}
    >
      {/* Slides */}
      <div
        className="flex w-full h-full transition-transform duration-700 ease-in-out"
        ref={slidesRef}
      >
        {slideImages.map((ele, index) => (
          <div key={index} className="w-full h-full flex-shrink-0 relative">
            <img
              src={ele.img}
              alt={ele.title}
              className="object-cover brightness-50 w-full h-full"
            />

            <div className="absolute inset-0 bg-animated"></div>

            {/* Slide Content with Animation */}
            <div className="sm:w-1/2 w-full absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-8 text-white text-center">
              <AnimatePresence mode="wait">
                {counter === index && (
                  <motion.div
                    key={ele.title}
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -40 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                  >
                    <p className="sm:text-7xl text-4xl font-bold uppercase text-left drop-shadow-lg sm:text-center">
                      {ele.title}
                    </p>
                    <hr className="my-2 ml-1 border-white/70" />
                    <p className="text-left ml-1 sm:text-center text-sm text-gray-200 whitespace-pre-line">
                      {typedText}
                      <span className="animate-pulse">|</span>
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-20 w-full flex justify-end gap-4 items-center px-4 transform -translate-y-1/2">
        <button
          className="text-white sm:text-5xl text-3xl hover:scale-110 transition"
          onClick={goPrev}
        >
          <BsArrowLeftCircle />
        </button>
        <button
          className="text-white sm:text-5xl text-3xl hover:scale-110 transition"
          onClick={goNext}
        >
          <BsArrowRightCircle />
        </button>
      </div>

      {/* Dots Indicators */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex sm:gap-2 gap-1">
        {slideImages.map((_, ind) => (
          <button
            key={ind}
            onClick={() => setCounter(ind)}
            className={`sm:w-3 sm:h-3 w-2 h-2 rounded-full transition-all duration-300 ${
              counter === ind ? "bg-white scale-125 shadow-lg" : "bg-white/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default ImageSlider;