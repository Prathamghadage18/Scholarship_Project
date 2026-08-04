import React, { useState } from "react";
import TextInput from "./ui/TextInput";

const StudentRegistrationForm = () => {
  const [formData, setFormData] = useState({
    user: "",
    parent: "",
    class: "",
    rollNumber: "",
    dateOfBirth: "",
    address: "",
    phone: "",
    busAssignment: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    let newErrors = {};
    if (!formData.user) newErrors.user = "User ID is required";
    if (!formData.parent) newErrors.parent = "Parent ID is required";
    if (!formData.class) newErrors.class = "Class ID is required";
    if (!formData.rollNumber) newErrors.rollNumber = "Roll Number is required";

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    console.log("✅ Submitted Data:", formData);
    // TODO: send formData to backend API
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 sm:p-2">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-2xl"
      >
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
          Student Registration
        </h2>

       <div className=" grid sm:grid-cols-2 gap-4">
         {/* User ID */}
        <div className="mb-4">
          <TextInput
            label="User ID"
            name="user"
            value={formData.user}
            onChange={handleChange}
            required
            error={errors.user}
            placeholder="Enter User ID"
          />
        </div>

        {/* Parent ID */}
        <div className="mb-4">
          <TextInput
            label="Parent ID"
            name="parent"
            value={formData.parent}
            onChange={handleChange}
            required
            error={errors.parent}
            placeholder="Enter Parent ID"
          />
        
       </div>

        {/* Class ID */}
        <div className="mb-4">
          <TextInput
            label="Class ID"
            name="class"
            value={formData.class}
            onChange={handleChange}
            required
            error={errors.class}
            placeholder="Enter Class ID"
          />
        </div>

        {/* Roll Number */}
        <div className="mb-4">
          <TextInput
            label="Roll Number"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            required
            error={errors.rollNumber}
            placeholder="Enter Roll Number"
          />
        </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <TextInput
            label="Date of Birth"
            name="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={handleChange}
          />
        </div>

        {/* Address */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            rows="3"
            placeholder="Enter Address"
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        {/* Phone */}
        <div className="mb-4">
          <TextInput
            label="Phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Enter Phone Number"
          />
        </div>

        {/* Bus Assignment */}
        <div className="mb-4">
          <TextInput
            label="Bus Assignment ID"
            name="busAssignment"
            value={formData.busAssignment}
            onChange={handleChange}
            placeholder="Enter Bus Assignment ID"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          Register Student
        </button>
      </form>
    </div>
  );
};

export default StudentRegistrationForm;