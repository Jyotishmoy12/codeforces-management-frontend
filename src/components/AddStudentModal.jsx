import Modal from 'react-modal'
import { useState } from 'react'
import { api } from '../api/axiosConfig'


const AddStudentModal =({isOpen, onClose, onStudentAdded})=>{
    const [formData, setFormData] = useState({
        name:'',
        email:'',
        phone:'',
        cfHandle:''
    })
    const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e)=>{
    e.preventDefault();
    await api.post('/students', formData);
    onStudentAdded();
    onClose();
  }
   return (
    <Modal isOpen={isOpen} onRequestClose={onClose} ariaHideApp={false}
           className="bg-white dark:bg-gray-800 p-6 rounded shadow w-96 mx-auto mt-24 outline-none">
      <h2 className="text-xl font-bold mb-4">Add Student</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        {['name', 'email', 'phone', 'cfHandle'].map(field => (
          <input key={field} name={field} value={formData[field]} onChange={handleChange}
                 placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                 required
                 className="w-full p-2 border rounded bg-white dark:bg-gray-700 dark:text-white"
          />
        ))}
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded w-full">Add</button>
      </form>
    </Modal>
  );
};

export default AddStudentModal