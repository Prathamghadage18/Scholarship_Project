import React from "react";

const StudentMaterials = () => {
  const materials = [
    { title: "Mathematics Chapter 5", subject: "Math", teacher: "Ms. Wilson", date: "2024-01-15" },
    { title: "Science Lab Report Template", subject: "Science", teacher: "Mr. Brown", date: "2024-01-14" },
    { title: "History Assignment Guidelines", subject: "History", teacher: "Mrs. Taylor", date: "2024-01-13" },
  ];

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-6 lg:w-10/12 m-auto">
      <h2 className="text-lg font-bold flex items-center gap-2">📚 Study Materials</h2>

      <div className="space-y-3">
        {materials.map((mat, index) => (
          <div
            key={index}
            className="flex items-center justify-between bg-white border rounded-lg p-4 shadow-sm hover:shadow-md transition"
          >
            <div className="flex items-center gap-4">
              <div className="bg-gray-100 p-3 rounded-lg">
                📄
              </div>
              <div>
                <h4 className="font-semibold">{mat.title}</h4>
                <p className="text-gray-500 text-sm">
                  {mat.subject} • {mat.teacher} • {mat.date}
                </p>
              </div>
            </div>
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Download
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudentMaterials;
