import { useEffect, useState } from 'react'
import { api } from '../api/axiosConfig'
import AddStudentModal from './AddStudentModal'
import EditStudentModal from './EditStudentModal'
import { 
  FaSyncAlt, 
  FaTrash, 
  FaPen, 
  FaEnvelopeOpenText,
  FaUserPlus,
  FaDownload,
  FaEye,
  FaUsers,
  FaTrophy,
  FaChartLine,
  FaClock,
  FaExclamationTriangle
} from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const StudentTable = () => {
  const [students, setStudents] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [syncingIds, setSyncingIds] = useState(new Set())
  const [deletingIds, setDeletingIds] = useState(new Set())
  const navigate = useNavigate()

  const fetchStudents = async () => {
    try {
      setLoading(true)
      const res = await api.get('/students')
      console.log('Fetched students:', res.data)
      setStudents(res.data)
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setDeletingIds(prev => new Set([...prev, id]))
        await api.delete(`/students/${id}`)
        fetchStudents()
      } catch (error) {
        console.error('Error deleting student:', error)
      } finally {
        setDeletingIds(prev => {
          const newSet = new Set(prev)
          newSet.delete(id)
          return newSet
        })
      }
    }
  }

  const syncNow = async (id) => {
    try {
      setSyncingIds(prev => new Set([...prev, id]))
      await api.post(`/students/${id}/sync-now`)
      fetchStudents()
    } catch (error) {
      console.error('Error syncing student:', error)
    } finally {
      setSyncingIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const toggleReminder = async (id) => {
    try {
      await api.post(`/students/${id}/toggle-reminder`)
      fetchStudents()
    } catch (error) {
      console.error('Error toggling reminder:', error)
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setEditModalOpen(true)
  }

  const getRatingColor = (rating) => {
    if (!rating) return 'text-gray-400'
    if (rating >= 2400) return 'text-red-500 font-bold'
    if (rating >= 2100) return 'text-orange-500 font-bold'
    if (rating >= 1900) return 'text-purple-500 font-bold'
    if (rating >= 1600) return 'text-blue-500 font-bold'
    if (rating >= 1400) return 'text-cyan-500 font-bold'
    if (rating >= 1200) return 'text-green-500 font-bold'
    return 'text-gray-600'
  }

  const getStatsCards = () => {
    const totalStudents = students.length
    const avgRating = students.length > 0 
      ? Math.round(students.reduce((sum, s) => sum + (s.currentRating || 0), 0) / students.length)
      : 0
    const maxRatingStudent = students.reduce((max, s) => 
      (s.currentRating || 0) > (max.currentRating || 0) ? s : max, students[0] || {})

    return [
      {
        title: 'Total Students',
        value: totalStudents,
        icon: FaUsers,
        color: 'bg-gradient-to-r from-blue-500 to-blue-600',
        textColor: 'text-blue-600'
      },
      {
        title: 'Average Rating',
        value: avgRating || 'N/A',
        icon: FaChartLine,
        color: 'bg-gradient-to-r from-green-500 to-green-600',
        textColor: 'text-green-600'
      },
      {
        title: 'Highest Rating',
        value: maxRatingStudent?.currentRating || 'N/A',
        icon: FaTrophy,
        color: 'bg-gradient-to-r from-yellow-500 to-yellow-600',
        textColor: 'text-yellow-600'
      }
    ]
  }

  useEffect(() => { 
    fetchStudents() 
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-lg text-gray-600">Loading students...</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Student Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Manage and track your coding students' progress
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setModalOpen(true)} 
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                          text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 
                          shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaUserPlus className="group-hover:rotate-12 transition-transform duration-300" />
                Add Student
              </button>
              <button 
                onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}/students/download/csv`, '_blank')}
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                          text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 
                          shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <FaDownload className="group-hover:translate-y-1 transition-transform duration-300" />
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {getStatsCards().map((stat, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl 
                        transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                    {stat.title}
                  </p>
                  <p className={`text-3xl font-bold mt-2 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`p-4 rounded-xl ${stat.color} shadow-lg`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-700 dark:to-gray-600">
                <tr>
                  {[
                    { label: 'Name', icon: FaUsers },
                    { label: 'Email', icon: FaEnvelopeOpenText },
                    { label: 'Phone', icon: null },
                    { label: 'CF Handle', icon: null },
                    { label: 'Rating', icon: FaTrophy },
                    { label: 'Max Rating', icon: FaChartLine },
                    { label: 'Last Sync', icon: FaClock },
                    { label: 'Actions', icon: null }
                  ].map((header, index) => (
                    <th 
                      key={index}
                      className="px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 
                                uppercase tracking-wider border-b border-gray-200 dark:border-gray-600"
                    >
                      <div className="flex items-center gap-2">
                        {header.icon && <header.icon className="h-4 w-4" />}
                        {header.label}
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {students.map((student, index) => (
                  <tr 
                    key={student._id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200
                              animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 dark:text-gray-100">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {student.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {student.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-mono text-sm bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                        {student.cfHandle}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold ${getRatingColor(student.currentRating)}`}>
                        {student.currentRating || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`font-bold ${getRatingColor(student.maxRating)}`}>
                        {student.maxRating || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600 dark:text-gray-400">
                      {student.cfDataLastUpdated 
                        ? new Date(student.cfDataLastUpdated).toLocaleDateString()
                        : (
                          <span className="flex items-center gap-1 text-amber-600">
                            <FaExclamationTriangle className="h-3 w-3" />
                            Never
                          </span>
                        )
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => syncNow(student._id)} 
                          disabled={syncingIds.has(student._id)}
                          title="Sync Now"
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 
                                    rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          <FaSyncAlt className={`h-4 w-4 ${syncingIds.has(student._id) ? 'animate-spin' : 'hover:rotate-180 transition-transform duration-300'}`} />
                        </button>

                        <button 
                          onClick={() => toggleReminder(student._id)} 
                          title={student.emailReminderDisabled ? "Enable Reminder" : "Disable Reminder"}
                          className="p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200"
                        >
                          <FaEnvelopeOpenText
                            className={`h-4 w-4 transition-all duration-300 ${
                              !student.emailReminderDisabled 
                                ? 'text-green-600 hover:scale-110' 
                                : 'text-gray-400 hover:text-gray-600'
                            }`}
                          />
                        </button>

                        <button 
                          onClick={() => handleEdit(student)} 
                          title="Edit Student"
                          className="p-2 text-amber-600 hover:text-amber-800 hover:bg-amber-50 dark:hover:bg-amber-900/20 
                                    rounded-lg transition-all duration-200"
                        >
                          <FaPen className="h-4 w-4 hover:scale-110 transition-transform duration-200" />
                        </button>

                        <button 
                          onClick={() => navigate(`/students/${student._id}`)} 
                          title="View Details"
                          className="p-2 text-emerald-600 hover:text-emerald-800 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 
                                    rounded-lg transition-all duration-200"
                        >
                          <FaEye className="h-4 w-4 hover:scale-110 transition-transform duration-200" />
                        </button>

                        <button 
                          onClick={() => deleteStudent(student._id)} 
                          disabled={deletingIds.has(student._id)}
                          title="Delete Student"
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 dark:hover:bg-red-900/20 
                                    rounded-lg transition-all duration-200 disabled:opacity-50"
                        >
                          <FaTrash className={`h-4 w-4 ${deletingIds.has(student._id) ? 'animate-pulse' : 'hover:scale-110 transition-transform duration-200'}`} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {students.length === 0 && (
            <div className="text-center py-12">
              <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                No students found
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Get started by adding your first student to the system.
              </p>
            </div>
          )}
        </div>

        {/* Modals */}
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          student={editingStudent}
          onStudentUpdated={fetchStudents}
        />

        <AddStudentModal 
          isOpen={isModalOpen} 
          onClose={() => setModalOpen(false)} 
          onStudentAdded={fetchStudents} 
        />
      </div>

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in {
          animation: fade-in 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  )
}

export default StudentTable