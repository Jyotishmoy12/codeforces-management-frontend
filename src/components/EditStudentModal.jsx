import Modal from 'react-modal'
import { useState, useEffect } from 'react'
import { api } from '../api/axiosConfig'

const EditStudentModal = ({ isOpen, onClose, student, onStudentUpdated }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    cfHandle: ''
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        cfHandle: student.cfHandle || ''
      })
    }
  }, [student])

  const handleChange = (e) => {
    setFormData((prev) => ({ 
      ...prev, 
      [e.target.name]: e.target.value 
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await api.put(`/students/${student._id}`, formData)
      console.log('Updated student:', response.data)
      onStudentUpdated()
      onClose()
    } catch (error) {
      console.error('Error updating student:', error)
      // Handle error appropriately
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (!isLoading) {
      onClose()
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
      onRequestClose={handleClose} 
      ariaHideApp={false}
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl w-96 mx-auto mt-24 outline-none"
      overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">
          Edit Student
        </h2>
        <button
          onClick={handleClose}
          disabled={isLoading}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 
                     text-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed"
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
              disabled={isLoading}
              className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-md 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                         placeholder-gray-500 dark:placeholder-gray-400
                         disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        ))}
        
        <div className="flex gap-3 pt-4">
          <button 
            type="button"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 
                       text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 
                       dark:hover:bg-gray-700 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 
                       rounded-md transition-colors focus:ring-2 focus:ring-blue-500 
                       focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
                       flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Updating...
              </>
            ) : (
              'Update Student'
            )}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default EditStudentModal