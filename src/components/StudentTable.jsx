import { useEffect, useState } from 'react';
import { api } from '../api/axiosConfig';
import AddStudentModal from './AddStudentModal';
import EditStudentModal from './EditStudentModal';
import { FaSyncAlt, FaTrash, FaPen, FaEnvelopeOpenText } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom'


const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [isEditModalOpen, setEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    const res = await api.get('/students');
    console.log("fetched students:", res.data);
    setStudents(res.data);
  };

  const deleteStudent = async (id) => {
    if (window.confirm('Delete this student?')) {
      await api.delete(`/students/${id}`);
      fetchStudents();
    }
  };

  const syncNow = async (id) => {
    await api.post(`/students/${id}/sync-now`);
    fetchStudents();
  };

  const toggleReminder = async (id) => {
    await api.post(`/students/${id}/toggle-reminder`);
    fetchStudents();
  };
  const handleEdit = (student) => {
    setEditingStudent(student);
    setEditModalOpen(true);
  }

  useEffect(() => { fetchStudents(); }, []);

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <div>
          <button onClick={() => setModalOpen(true)} className="bg-green-600 text-white px-4 py-2 rounded mr-2">
            + Add Student
          </button>
          <button onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}/students/download/csv`, '_blank')}
            className="bg-blue-600 text-white px-4 py-2 rounded">
            Download CSV
          </button>

        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th>Name</th><th>Email</th><th>Phone</th><th>CF Handle</th>
              <th>Rating</th><th>Max</th><th>Last Sync</th><th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {students.map(s => (
              <tr key={s._id} className="text-center border-t">
                <td>{s.name}</td><td>{s.email}</td><td>{s.phone}</td><td>{s.cfHandle}</td>
                <td>{s.currentRating}</td><td>{s.maxRating}</td>
                <td>{new Date(s.lastSyncedAt).toLocaleDateString()}</td>
                <td className="space-x-2">
                  <button onClick={() => syncNow(s._id)} title="Sync Now"><FaSyncAlt /></button>
                  <button onClick={() => deleteStudent(s._id)} title="Delete"><FaTrash className="text-red-500" /></button>
                  <button onClick={() => toggleReminder(s._id)} title="Toggle Reminder">
                    <FaEnvelopeOpenText
                      className={!s.emailReminderDisabled ? 'text-green-600' : 'text-gray-400'}
                    />

                  </button>
                  <button onClick={() => handleEdit(s)} className="text-green-600 hover:underline mr-2">Edit</button>
                  <button onClick={() => navigate(`/students/${s._id}`)} className="text-blue-600 hover:underline mr-2">View</button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setEditModalOpen(false)}
        student={editingStudent}
        onStudentUpdated={fetchStudents}
      />

      <AddStudentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onStudentAdded={fetchStudents} />
    </div>
  );
};

export default StudentTable