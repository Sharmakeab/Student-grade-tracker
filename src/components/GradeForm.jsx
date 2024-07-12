import React, { useState, useEffect } from 'react';

const GradeForm = () => {
  const [form, setForm] = useState({ studentId: '', subject: '', grade: '' });
  const [students, setStudents] = useState([]);
  const [grades, setGrades] = useState([]);
  const [editingGradeId, setEditingGradeId] = useState(null); // Track which grade is being edited
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchStudents();
    fetchGrades();
  }, []);

  const fetchStudents = () => {
    try {
      const storedStudents = JSON.parse(localStorage.getItem('students')) || [];
      setStudents(storedStudents);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const fetchGrades = () => {
    try {
      const storedGrades = JSON.parse(localStorage.getItem('grades')) || [];
      setGrades(storedGrades);
    } catch (error) {
      console.error('Error fetching grades:', error);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      if (form.studentId && form.subject && form.grade) {
        const student = students.find((student) => student.id === form.studentId);
        const newGrade = {
          studentId: form.studentId,
          studentName: student.name,
          subject: form.subject,
          grade: form.grade,
        };
        const updatedGrades = [...grades, newGrade];
        localStorage.setItem('grades', JSON.stringify(updatedGrades));
        setGrades(updatedGrades);
        alert('Grade added successfully!');
        setForm({ studentId: '', subject: '', grade: '' }); // Clear form fields after submission
      } else {
        alert('Please fill in all fields.');
      }
    } catch (error) {
      console.error('Error adding grade:', error);
      alert('Failed to add grade. Please try again.');
    }
  };

  const handleUpdate = (id) => {
    setEditingGradeId(id);
    const gradeToUpdate = grades.find(grade => grade.studentId === id);
    if (gradeToUpdate) {
      setForm({
        studentId: gradeToUpdate.studentId,
        subject: gradeToUpdate.subject,
        grade: gradeToUpdate.grade,
      });
    }
  };

  const handleUpdateSubmit = () => {
    try {
      const updatedGrades = grades.map(grade => {
        if (grade.studentId === editingGradeId) {
          return {
            ...grade,
            subject: form.subject,
            grade: form.grade,
          };
        }
        return grade;
      });
      localStorage.setItem('grades', JSON.stringify(updatedGrades));
      setGrades(updatedGrades);
      setEditingGradeId(null);
      setForm({ studentId: '', subject: '', grade: '' });
      alert('Grade updated successfully!');
    } catch (error) {
      console.error('Error updating grade:', error);
      alert('Failed to update grade. Please try again.');
    }
  };

  const handleDelete = (id) => {
    try {
      const updatedGrades = grades.filter(grade => grade.studentId !== id);
      localStorage.setItem('grades', JSON.stringify(updatedGrades));
      setGrades(updatedGrades);
      alert('Grade deleted successfully!');
    } catch (error) {
      console.error('Error deleting grade:', error);
      alert('Failed to delete grade. Please try again.');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredGrades = grades.filter(grade => {
    return grade.studentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
           grade.subject.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="p-4 w-full max-w-lg">
        <h2 className="text-xl font-bold mb-4">Add Grade</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Student:</label>
            <select
              name="studentId"
              value={form.studentId}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Select a student</option>
              {students.map((student) => (
                <option key={student.id} value={student.id}>
                  {student.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Subject:</label>
            <input
              type="text"
              name="subject"
              value={form.subject}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Grade:</label>
            <input
              type="text"
              name="grade"
              value={form.grade}
              onChange={handleChange}
              required
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
            Add Grade
          </button>
        </form>

        {grades.length > 0 && (
          <div className="mt-8">
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Search:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearch}
                placeholder="Search by Student ID or Subject"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <h3 className="text-lg font-bold mb-4">Grades</h3>
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">ID</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">Name</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">Subject</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">Grade</th>
                  <th className="py-2 px-4 border-b border-gray-300 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGrades.map((grade, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b border-gray-300">{grade.studentId}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{grade.studentName}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{grade.subject}</td>
                    <td className="py-2 px-4 border-b border-gray-300">{grade.grade}</td>
                    <td className="py-2 px-4 border-b border-gray-300">
                      {editingGradeId === grade.studentId ? (
                        <button
                          onClick={handleUpdateSubmit}
                          className="px-3 py-1 bg-blue-500 text-white rounded-md mr-2"
                        >
                          Save
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpdate(grade.studentId)}
                          className="px-3 py-1 bg-green-500 text-white rounded-md mr-2"
                        >
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(grade.studentId)}
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
        )}
      </div>
    </div>
  );
};

export default GradeForm;
 