import React, { useEffect, useRef, useState } from "react";
import { IoChevronDown } from "react-icons/io5";

const Select = ({ options, placeholder, inp, setInp, error }) => {
  const [showOptions, setShowOptions] = useState(false);
  const optionRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (optionRef.current && !optionRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={optionRef}
      className="w-full relative"
    >
      <div
        className={`flex items-center border rounded-md px-3 py-2 cursor-pointer ${error ? 'border-red-500' : 'border-gray-300'} bg-white`}
        onClick={() => setShowOptions(!showOptions)}
      >
        <input
          type="text"
          placeholder={placeholder}
          value={inp}
          onChange={(e) => setInp(e.target.value)}
          className="w-full outline-none text-sm text-gray-700 bg-transparent"
        />
        <IoChevronDown className="text-gray-500" />
      </div>
      {showOptions && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          {options.filter((ele) => ele.toLowerCase().includes(inp.toLowerCase())).map((ele, index) => (
            <div
              key={index}
              onClick={() => {
                setInp(ele);
                setShowOptions(false);
              }}
              className="px-4 py-2 hover:bg-blue-500 hover:text-white cursor-pointer text-sm"
            >
              {ele}
            </div>
          ))}
          {options.filter((ele) => ele.toLowerCase().includes(inp.toLowerCase())).length === 0 && (
            <div className="px-4 py-2 text-gray-500 text-sm">No results found</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Select;
