import React, { useState, useEffect } from "react";
import { listStudents, listTeachers, createStudent, createTeacher, deleteStudent, deleteTeacher } from "../config/schoolSaas";
import { toast } from "sonner";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUserType, setAddUserType] = useState("student"); // 'student' or 'teacher'
  const [filterRole, setFilterRole] = useState("all");
  
  // Form state for adding users
  const [addForm, setAddForm] = useState({
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    password: "",
    // Student specific
    admission_number: "",
    class_name: "",
    section: "",
    // Teacher specific
    employee_id: "",
    subject_name: "",
    assigned_class: "",
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const [students, teachers] = await Promise.all([
        listStudents(),
        listTeachers()
      ]);
      
      const combinedUsers = [
        ...students.map(s => ({
          id: s.id,
          name: s.display_name,
          email: s.user?.email || "",
          role: "Student",
          class: `${s.class_name}${s.section ? ` - ${s.section}` : ""}`,
          status: s.is_active ? "Active" : "Inactive",
          admission_number: s.admission_number,
          type: "student"
        })),
        ...teachers.map(t => ({
          id: t.id,
          name: t.display_name,
          email: t.user?.email || "",
          role: "Teacher",
          class: t.subject_name || t.assigned_class || "N/A",
          status: t.is_active ? "Active" : "Inactive",
          employee_id: t.employee_id,
          type: "teacher"
        }))
      ];
      setUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    
    try {
      if (addUserType === "student") {
        await createStudent({
          username: addForm.username,
          email: addForm.email,
          first_name: addForm.first_name,
          last_name: addForm.last_name,
          password: addForm.password,
          admission_number: addForm.admission_number,
          class_name: addForm.class_name,
          section: addForm.section,
        });
        toast.success("Student added successfully");
      } else {
        await createTeacher({
          username: addForm.username,
          email: addForm.email,
          first_name: addForm.first_name,
          last_name: addForm.last_name,
          password: addForm.password,
          employee_id: addForm.employee_id,
          subject_name: addForm.subject_name,
          assigned_class: addForm.assigned_class,
        });
        toast.success("Teacher added successfully");
      }
      
      setShowAddModal(false);
      setAddForm({
        username: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        admission_number: "",
        class_name: "",
        section: "",
        employee_id: "",
        subject_name: "",
        assigned_class: "",
      });
      fetchUsers();
    } catch (error) {
      console.error("Error adding user:", error);
      toast.error(error.response?.data?.detail || "Failed to add user");
    }
  };

  const handleDeleteUser = async (user) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;
    
    try {
      if (user.type === "student") {
        await deleteStudent(user.id);
      } else {
        await deleteTeacher(user.id);
      }
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete user");
    }
  };

  const filteredUsers = filterRole === "all" 
    ? users 
    : users.filter(u => u.role.toLowerCase() === filterRole.toLowerCase());

  const stats = {
    teachers: users.filter(u => u.role === "Teacher").length,
    students: users.filter(u => u.role === "Student").length,
    parents: 0, // Not implemented yet
    staff: users.filter(u => u.role === "Teacher").length,
  };

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4 lg:w-10/12 m-auto">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">👥 User Management</h2>
        <div className="flex gap-2">
          <button 
            onClick={() => {
              setAddUserType("student");
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded-lg"
          >
            + Add Student
          </button>
          <button 
            onClick={() => {
              setAddUserType("teacher");
              setShowAddModal(true);
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg"
          >
            + Add Teacher
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-blue-600">{stats.teachers}</p>
          <p className="text-sm">Teachers</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-green-600">{stats.students}</p>
          <p className="text-sm">Students</p>
        </div>
        <div className="bg-purple-50 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-purple-600">{stats.parents}</p>
          <p className="text-sm">Parents</p>
        </div>
        <div className="bg-orange-50 p-4 rounded-lg text-center">
          <p className="text-xl font-bold text-orange-600">{stats.staff}</p>
          <p className="text-sm">Staff</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Search users..."
          className="border rounded-lg px-3 py-2 w-1/2"
          onChange={(e) => {
            const search = e.target.value.toLowerCase();
            if (search === "") {
              fetchUsers();
            } else {
              setUsers(users.filter(u => 
                u.name.toLowerCase().includes(search) || 
                u.email.toLowerCase().includes(search)
              ));
            }
          }}
        />
        <select 
          className="border rounded-lg px-3 py-2"
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">All Roles</option>
          <option value="teacher">Teacher</option>
          <option value="student">Student</option>
        </select>
      </div>

      {/* Table */}
      <table className="sm:w-full text-left border-t overflow-scroll">
        <thead>
          <tr className="text-sm text-gray-600">
            <th className="py-2">User</th>
            <th>Role</th>
            <th>Class/Subject</th>
            <th>ID</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody className="text-sm overflow-scroll">
          {loading ? (
            <tr>
              <td colSpan="6" className="text-center py-4">Loading...</td>
            </tr>
          ) : filteredUsers.length === 0 ? (
            <tr>
              <td colSpan="6" className="text-center py-4">No users found</td>
            </tr>
          ) : (
            filteredUsers.map((u, i) => (
              <tr key={i} className="border-t">
                <td className="py-3">
                  <div>
                    <p className="font-semibold">{u.name}</p>
                    <p className="text-gray-500 text-xs">{u.email}</p>
                  </div>
                </td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    u.role === "Teacher" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600"
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td>{u.class}</td>
                <td className="text-xs text-gray-500">{u.admission_number || u.employee_id || "-"}</td>
                <td>
                  <span className={`px-2 py-1 rounded text-xs ${
                    u.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"
                  }`}>
                    {u.status}
                  </span>
                </td>
                <td className="space-x-2">
                  <button 
                    onClick={() => handleDeleteUser(u)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Add User Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">
                Add {addUserType === "student" ? "Student" : "Teacher"}
              </h3>
              <button 
                onClick={() => setShowAddModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Username *</label>
                <input
                  type="text"
                  required
                  value={addForm.username}
                  onChange={(e) => setAddForm({...addForm, username: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Email *</label>
                <input
                  type="email"
                  required
                  value={addForm.email}
                  onChange={(e) => setAddForm({...addForm, email: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">First Name *</label>
                  <input
                    type="text"
                    required
                    value={addForm.first_name}
                    onChange={(e) => setAddForm({...addForm, first_name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Last Name</label>
                  <input
                    type="text"
                    value={addForm.last_name}
                    onChange={(e) => setAddForm({...addForm, last_name: e.target.value})}
                    className="w-full border rounded-lg px-3 py-2"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Password *</label>
                <input
                  type="password"
                  required
                  minLength="8"
                  value={addForm.password}
                  onChange={(e) => setAddForm({...addForm, password: e.target.value})}
                  className="w-full border rounded-lg px-3 py-2"
                />
              </div>
              
              {addUserType === "student" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Admission Number *</label>
                    <input
                      type="text"
                      required
                      value={addForm.admission_number}
                      onChange={(e) => setAddForm({...addForm, admission_number: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Class *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g., 10A"
                        value={addForm.class_name}
                        onChange={(e) => setAddForm({...addForm, class_name: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Section</label>
                      <input
                        type="text"
                        value={addForm.section}
                        onChange={(e) => setAddForm({...addForm, section: e.target.value})}
                        className="w-full border rounded-lg px-3 py-2"
                      />
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Employee ID *</label>
                    <input
                      type="text"
                      required
                      value={addForm.employee_id}
                      onChange={(e) => setAddForm({...addForm, employee_id: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Subject Name</label>
                    <input
                      type="text"
                      value={addForm.subject_name}
                      onChange={(e) => setAddForm({...addForm, subject_name: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Assigned Class</label>
                    <input
                      type="text"
                      value={addForm.assigned_class}
                      onChange={(e) => setAddForm({...addForm, assigned_class: e.target.value})}
                      className="w-full border rounded-lg px-3 py-2"
                    />
                  </div>
                </>
              )}
              
              <div className="flex gap-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg"
                >
                  Add {addUserType === "student" ? "Student" : "Teacher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
