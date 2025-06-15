import Modal from 'react-modal';
import { useState, useEffect } from 'react';
import { api } from '../api/axiosConfig';

const EditStudentModal = ({ isOpen, onClose, student, onStudentUpdated }) => {
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', cfHandle: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        cfHandle: student.cfHandle || '',
      });
    }
  }, [student]);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await api.put(`/students/${student._id}`, formData);
    console.log("updated students:", response.data)
    onStudentUpdated();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}
           className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 mx-auto mt-24 outline-none">
      <h2 className="text-xl font-bold mb-4">Edit Student</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {['name', 'email', 'phone', 'cfHandle'].map(field => (
          <input key={field} name={field} value={formData[field]} onChange={handleChange}
                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                 required
                 className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Update</button>
      </form>
    </Modal>
  );
};

export default EditStudentModal;
