import Modal from 'react-modal'
import { useState } from 'react'
import { api } from '../api/axiosConfig'

const AddStudentModal = ({ isOpen, onClose, onStudentAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cfHandle: ''
  })

  const handleChange = (e) => {
    setFormData((prev) => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/students', formData)
      onStudentAdded()
      onClose()
      // Reset form after successful submission
      setFormData({
        name: '',
        email: '',
        phone: '',
        cfHandle: ''
      })
    } catch (error) {
      console.error('Error adding student:', error)
      // Handle error appropriately
    }
  }

  const fieldLabels = {
    name: 'Full Name',
    email: 'Email Address',
    phone: 'Phone Number',
    cfHandle: 'Codeforces Handle'
  }

  return (
    <Modal 
      isOpen={isOpen} 
      onRequestClose={onClose} 
      ariaHideApp={false}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 mx-auto mt-24 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Add New Student
        </h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl font-bold"
        >
          ×
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'email', 'phone', 'cfHandle'].map(field => (
          <div key={field}>
            <label 
              htmlFor={field}
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              {fieldLabels[field]}
            </label>
            <input 
              id={field}
              name={field} 
              type={field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              value={formData[field]} 
              onChange={handleChange}
              placeholder={`Enter ${fieldLabels[field].toLowerCase()}`}
              required
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        ))}
        
        <div className="flex gap-3 pt-4">
          <button 
            type="button"
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 
                       dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
                       rounded-md transition-colors focus:ring-2 focus:ring-blue-500 
                       focus:ring-offset-2"
          >
            Add Student
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default AddStudentModal