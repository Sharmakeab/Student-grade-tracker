import React, { useState, useEffect } from 'react';

const RegisterStudent = ({ onStudentRegistered }) => {
  const [student, setStudent] = useState({ id: '', name: '' });
  const [students, setStudents] = useState([]);
  const [editingStudentId, setEditingStudentId] = useState(null); // Track which student is being edited
  const [updatedName, setUpdatedName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    try {
      const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
      setStudents(storedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleChange = (e) => {
    setStudent({ ...student, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
      const updatedStudents = [...storedStudents, student];
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      alert('Student registered successfully!');
      onStudentRegistered(student); // Pass registered student data to parent component
      setStudent({ id: '', name: '' }); // Clear form fields after successful registration
      fetchStudents(); // Update the list of students
    } catch (error) {
      console.error('Error registering student:', error);
      alert('Failed to register student. Please try again.');
    }
  };

  const handleUpdate = (id) => {
    setEditingStudentId(id);
    const studentToUpdate = students.find(student => student.id === id);
    if (studentToUpdate) {
      setUpdatedName(studentToUpdate.name);
    }
  };

  const handleUpdateSubmit = () => {
    try {
      const updatedStudents = students.map(student => {
        if (student.id === editingStudentId) {
          return { ...student, name: updatedName };
        }
        return student;
      });
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      setEditingStudentId(null);
      setUpdatedName('');
      fetchStudents();
      alert('Student updated successfully!');
    } catch (error) {
      console.error('Error updating student:', error);
      alert('Failed to update student. Please try again.');
    }
  };

  const handleDelete = (id) => {
    try {
      const updatedStudents = students.filter(student => student.id !== id);
      localStorage.setItem('students', JSON.stringify(updatedStudents));
      fetchStudents();
      alert('Student deleted successfully!');
    } catch (error) {
      console.error('Error deleting student:', error);
      alert('Failed to delete student. Please try again.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredStudents = students.filter(student => {
    return student.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
           student.name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-8 bg-white shadow-md rounded-md w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">Student Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">ID:</label>
            <input
              type="text"
              name="id"
              value={student.id}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name:</label>
            <input
              type="text"
              name="name"
              value={student.name}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Register Student
          </button>
        </form>

        <div className="mt-8">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Search:</label>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by ID or Name"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <h3 className="text-lg font-bold mb-2">Registered Students</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border-gray-200 shadow-md rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 border-b-2 border-gray-200 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredStudents.map((student, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">{student.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudentId === student.id ? (
                        <input
                          type="text"
                          value={updatedName}
                          onChange={(e) => setUpdatedName(e.target.value)}
                          className="px-3 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                      ) : (
                        student.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {editingStudentId === student.id ? (
                        <button
                          onClick={handleUpdateSubmit}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdate(student.id)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md mr-2"
                        >
                          Update
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(student.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterStudent;
