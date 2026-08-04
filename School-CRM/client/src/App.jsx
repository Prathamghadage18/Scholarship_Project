import React from 'react'
import Home from './components/Home'
import Login from './components/Login'
import ProtectedRoute from './config/ProtectedRoute'
import Dashboard from './admin/Dashboard'
import StudentDashboard from './Student/StudentDashboard'
import TeacherDashboard from './Teacher/TeacherDashboard'
import ParentDashboard from './Parent/ParentDashboard'
import PrincipleDashboard from './Principle/PrincipleDashboard'
import { Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner';
// import SignupRoleSelection from './components/RoleSelection'
// import StudentRegistrationForm from './components/StudentRegistrationForm'

const UnauthorizedPage = () => (
  <div className="min-h-screen flex items-center justify-center bg-slate-950 text-white px-6">
    <div className="max-w-md text-center space-y-3">
      <h1 className="text-3xl font-bold">Unauthorized</h1>
      <p className="text-slate-300">You do not have access to this area.</p>
    </div>
  </div>
);

const App = () => {
  return (
    <>
     <Toaster position="top-right"  richColors />
      
      <Routes>
  <Route path='/' element={<Home />} />
  <Route path='/login' element={<Login />} />
  <Route path='/unauthorized' element={<UnauthorizedPage />} />

  <Route element={<ProtectedRoute allowedRoles={["HQ"]} />}>
    <Route path='/admin-dashboard/*' element={<Dashboard />} />
  </Route>

  <Route element={<ProtectedRoute allowedRoles={["STUDENT"]} />}>
    <Route path='/student-dashboard/*' element={<StudentDashboard />} />
  </Route>

  <Route element={<ProtectedRoute allowedRoles={["TEACHER"]} />}>
    <Route path='/teacher-dashboard/*' element={<TeacherDashboard />} />
  </Route>

  <Route element={<ProtectedRoute allowedRoles={["PARENT"]} />}>
    <Route path='/parent-dashboard/*' element={<ParentDashboard />} />
  </Route>

  <Route element={<ProtectedRoute allowedRoles={["PRINCIPAL"]} />}>
    <Route path='/principal-dashboard/*' element={<PrincipleDashboard />} />
  </Route>

  <Route path='*' element={<h1>Page Not Found</h1>} />
</Routes>


    </>
  )
}

export default App
