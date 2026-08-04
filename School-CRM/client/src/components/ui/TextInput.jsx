import React from "react";

const TextInput = ({
  label,
  name,
  value,
  onChange,
  type = "text",
  required = false,
  error,
  placeholder = "",
}) => {
  return (
    <div>
      {label && (
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-2 border ${
          error ? "border-red-500" : "border-gray-300"
        } rounded-md focus:ring-primary-500 focus:border-primary-500`}
      />
      {error && <div className="error-message text-xs text-red-500 mt-1">{error}</div>}
    </div>
  );
};

export default TextInput;