import React from 'react'

const StudentHome = () => {
const StatCard = ({ title, value, color }) => (
    <div
      className={`flex flex-col items-center justify-center bg-white shadow-md rounded-xl p-6 ${color}`}
    >
      <h3 className="text-sm text-gray-600">{title}</h3>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  const SubjectCard = ({ subject, teacher, grade, percent }) => (
    <div className="flex justify-between items-center bg-white rounded-lg p-4 shadow">
      <div>
        <h4 className="font-semibold text-gray-800">{subject}</h4>
        <p className="text-gray-500 text-sm">{teacher}</p>
      </div>
      <div className="text-right">
        <span className="text-lg font-bold">{grade}</span>
        <p className="text-sm text-gray-500">{percent}%</p>
      </div>
    </div>
  );

  const ActivityCard = ({ title, desc, status }) => (
    <div className={`p-4 rounded-lg shadow text-sm ${status}`}>
      <h4 className="font-semibold">{title}</h4>
      <p>{desc}</p>
    </div>
  );

  const NoticeItem = ({ notice, date }) => (
    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg shadow-sm">
      <p className="text-gray-700 text-sm">{notice}</p>
      <span className="text-xs text-gray-500">{date}</span>
    </div>
  );

  const ExamItem = ({ subject, date, doc }) => (
    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg shadow-sm">
      <div>
        <p className="font-semibold">{subject}</p>
        <span className="text-xs text-gray-500">{doc}</span>
      </div>
      <span className="text-sm text-gray-600">{date}</span>
    </div>
  );

  const HolidayItem = ({ festival, date }) => (
    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg shadow-sm">
      <p className="font-semibold">{festival}</p>
      <span className="text-sm text-gray-600">{date}</span>
    </div>
  );

  return (
    <div className="min-h-screen p-6 space-y-8 lg:w-10/12 m-auto">
      {/* Top Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard title="Overall Grade" value="A-" color="text-green-600" />
        <StatCard title="Attendance" value="95%" color="text-blue-600" />
        <StatCard title="Class Rank" value="7th" color="text-purple-600" />
        <StatCard title="Assignments Due" value="3" color="text-red-600" />
      </div>

      {/* Progress Report */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Subject Performance */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold">📚 Subject Performance</h2>
          <SubjectCard
            subject="Mathematics"
            teacher="Ms. Wilson"
            grade="A"
            percent={90}
          />
          <SubjectCard
            subject="Science"
            teacher="Mr. Brown"
            grade="A-"
            percent={85}
          />
          <SubjectCard
            subject="English"
            teacher="Mrs. Davis"
            grade="A"
            percent={88}
          />
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold">📝 Recent Activity</h2>
          <ActivityCard
            title="Math Quiz Completed"
            desc="Score: 92/100 • Yesterday"
            status="bg-green-50"
          />
          <ActivityCard
            title="Science Assignment Submitted"
            desc="On time • 2 days ago"
            status="bg-blue-50"
          />
          <ActivityCard
            title="History Project Due"
            desc="Tomorrow • Not submitted"
            status="bg-red-50"
          />
        </div>
      </div>

      {/* Notice Board, Exams & Holidays */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Notice Board */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold">📢 Notice Board</h2>
          <NoticeItem
            notice="Parent-Teacher meeting scheduled next week."
            date="Sep 5"
          />
          <NoticeItem
            notice="Annual Sports registration open."
            date="Sep 10"
          />
          <NoticeItem
            notice="New library books available."
            date="Sep 12"
          />
        </div>

        {/* Upcoming Exams / Documents */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold">📅 Upcoming Exams</h2>
          <ExamItem subject="Maths Midterm" date="Sep 15" doc="Syllabus PDF" />
          <ExamItem subject="Science Lab Test" date="Sep 18" doc="Lab Manual" />
          <ExamItem subject="English Literature" date="Sep 20" doc="Novel Guide" />
        </div>

        {/* Holidays / Festivals */}
        <div className="bg-white rounded-xl shadow p-6 space-y-4">
          <h2 className="text-lg font-bold">🎉 Festival Holidays</h2>
          <HolidayItem festival="Ganesh Chaturthi" date="Sep 19" />
          <HolidayItem festival="Diwali Break" date="Oct 24 - Oct 28" />
          <HolidayItem festival="Christmas" date="Dec 25" />
        </div>
      </div>
    </div>
  );
};

export default StudentHome
