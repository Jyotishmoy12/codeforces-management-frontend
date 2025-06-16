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

// Skeleton loading components
const StatCardSkeleton = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-20 mb-3"></div>
        <div className="h-8 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
      </div>
      <div className="p-4 bg-gray-300 dark:bg-gray-600 rounded-xl w-14 h-14"></div>
    </div>
  </div>
)

const TableRowSkeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-24"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-32"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-16"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-12"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-20"></div>
    </td>
    <td className="px-6 py-4 whitespace-nowrap">
      <div className="flex items-center gap-2">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-lg"></div>
        ))}
      </div>
    </td>
  </tr>
)

const StudentTable = () => {
  const [students, setStudents] = useState([])
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [isEditModalOpen, setEditModalOpen] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [syncingIds, setSyncingIds] = useState(new Set())
  const [deletingIds, setDeletingIds] = useState(new Set())
  const [togglingReminderIds, setTogglingReminderIds] = useState(new Set())
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  const fetchStudents = async (showLoader = false) => {
    try {
      if (showLoader) {
        setInitialLoading(true)
        setError(null)
      }
      const res = await api.get('/students')
      console.log('Fetched students:', res.data)
      setStudents(res.data)
    } catch (error) {
      console.error('Error fetching students:', error)
      if (showLoader) {
        setError('Failed to load students. Please try again.')
      }
    } finally {
      if (showLoader) {
        setInitialLoading(false)
      }
    }
  }

  const deleteStudent = async (id) => {
    if (window.confirm('Are you sure you want to delete this student?')) {
      try {
        setDeletingIds(prev => new Set([...prev, id]))
        await api.delete(`/students/${id}`)
        await fetchStudents()
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
      await fetchStudents()
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
      setTogglingReminderIds(prev => new Set([...prev, id]))
      await api.post(`/students/${id}/toggle-reminder`)
      await fetchStudents()
    } catch (error) {
      console.error('Error toggling reminder:', error)
    } finally {
      setTogglingReminderIds(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  const handleEdit = (student) => {
    setEditingStudent(student)
    setEditModalOpen(true)
  }

  const handleStudentAdded = () => {
    fetchStudents()
    setModalOpen(false)
  }

  const handleStudentUpdated = () => {
    fetchStudents()
    setEditModalOpen(false)
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
    fetchStudents(true)
  }, [])

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
                disabled={initialLoading}
                className="group bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 
                          text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 
                          shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FaUserPlus className="group-hover:rotate-12 transition-transform duration-300" />
                Add Student
              </button>
              <button
                onClick={() => window.open(`${import.meta.env.VITE_BACKEND_URL}/students/download/csv`, '_blank')}
                disabled={initialLoading}
                className="group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 
                          text-white px-6 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 
                          shadow-lg hover:shadow-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                <FaDownload className="group-hover:translate-y-1 transition-transform duration-300" />
                Download CSV
              </button>
            </div>
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="mb-8 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <FaExclamationTriangle className="h-5 w-5 text-red-500" />
              <div>
                <h3 className="text-red-800 dark:text-red-400 font-medium">Error</h3>
                <p className="text-red-700 dark:text-red-300">{error}</p>
              </div>
              <button
                onClick={() => fetchStudents(true)}
                className="ml-auto bg-red-100 hover:bg-red-200 dark:bg-red-800 dark:hover:bg-red-700 
                          text-red-800 dark:text-red-200 px-4 py-2 rounded-lg transition-colors"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {initialLoading ? (
            // Show skeleton stats cards while loading
            [...Array(3)].map((_, index) => <StatCardSkeleton key={index} />)
          ) : (
            getStatsCards().map((stat, index) => (
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
            ))
          )}
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
                    { label: 'Max Rated Problem', icon: FaChartLine },
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
                {initialLoading ? (
                  // Show skeleton rows while loading
                  [...Array(5)].map((_, index) => <TableRowSkeleton key={index} />)
                ) : students.length > 0 ? (
                  students.map((student, index) => (
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
                            disabled={togglingReminderIds.has(student._id)}
                            title={student.emailReminderDisabled ? "Enable Reminder" : "Disable Reminder"}
                            className="flex items-center gap-2 px-3 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-all duration-200 disabled:opacity-50"
                          >
                            <FaEnvelopeOpenText
                              className={`h-4 w-4 transition-all duration-300 ${togglingReminderIds.has(student._id)
                                  ? 'animate-pulse text-gray-400'
                                  : !student.emailReminderDisabled
                                    ? 'text-green-600 hover:scale-110'
                                    : 'text-gray-400 hover:text-gray-600'
                                }`}
                            />
                            <span className={`text-xs font-medium transition-colors duration-200 ${!student.emailReminderDisabled ? 'text-green-600' : 'text-gray-500'
                              }`}>
                              {togglingReminderIds.has(student._id)
                                ? 'Updating...'
                                : !student.emailReminderDisabled
                                  ? 'ON'
                                  : 'OFF'
                              }
                            </span>
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
                  ))
                ) : (
                  // Empty state
                  <tr>
                    <td colSpan="8" className="text-center py-12">
                      <FaUsers className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
                        No students found
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        Get started by adding your first student to the system.
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <EditStudentModal
          isOpen={isEditModalOpen}
          onClose={() => setEditModalOpen(false)}
          student={editingStudent}
          onStudentUpdated={handleStudentUpdated}
        />

        <AddStudentModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onStudentAdded={handleStudentAdded}
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