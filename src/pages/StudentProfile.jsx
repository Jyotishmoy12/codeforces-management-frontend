import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { api } from '../api/axiosConfig';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar
} from 'recharts';
import HeatMap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';
import dayjs from 'dayjs';
import { 
    Trophy, 
    Target, 
    TrendingUp, 
    Calendar, 
    Award, 
    Code, 
    BarChart3, 
    Activity,
    Star,
    Zap,
    Users,
    Clock
} from 'lucide-react';

const StudentProfile = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [filterDays, setFilterDays] = useState(90);
    const [profileData, setProfileData] = useState(null);

    const fetchStudent = async () => {
        try {
            const response = await api.get(`/students/${id}`);
            setStudent(response.data);
            console.log("student:", response.data);
        } catch (error) {
            console.error("Error fetching student:", error);
        }
    };

    const fetchProfileData = async () => {
        try {
            const res = await api.get(`/students/${id}/profile?days=${filterDays}`);
            setProfileData(res.data);
            console.log("profileData:", res.data);
        } catch (error) {
            console.error("Error fetching profile data:", error);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [id]);

    useEffect(() => {
        fetchProfileData();
    }, [filterDays]);

    if (!student || !profileData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-purple-400 border-t-transparent mb-4"></div>
                    <p className="text-white text-xl font-semibold">Loading amazing data...</p>
                </div>
            </div>
        );
    }

    const StatCard = ({ icon: Icon, title, value, subtitle, color }) => (
        <div className={`bg-gradient-to-r ${color} p-6 rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-white/80 text-sm font-medium uppercase tracking-wide">{title}</p>
                    <p className="text-white text-3xl font-bold mt-1">{value}</p>
                    {subtitle && <p className="text-white/70 text-sm mt-1">{subtitle}</p>}
                </div>
                <Icon className="h-12 w-12 text-white/60" />
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Header Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 backdrop-blur-3xl"></div>
                <div className="relative px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-8 animate-fade-in">
                            <div className="flex items-center justify-center mb-4">
                                <div className="bg-gradient-to-r from-purple-400 to-blue-400 p-3 rounded-full shadow-lg">
                                    <Trophy className="h-8 w-8 text-white" />
                                </div>
                            </div>
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent mb-4">
                                {student.name}'s Journey
                            </h1>
                            <div className="flex items-center justify-center gap-2 text-white/80">
                                <Code className="h-5 w-5" />
                                <span className="text-lg">Codeforces: {student.cfHandle}</span>
                            </div>
                        </div>

                        {/* Filter Buttons */}
                        <div className="flex justify-center mb-8">
                            <div className="bg-white/10 backdrop-blur-lg rounded-full p-2 shadow-xl">
                                <div className="flex gap-2 flex-wrap justify-center">
                                    {[30, 90, 365].map(days => (
                                        <button
                                            key={days}
                                            onClick={() => setFilterDays(days)}
                                            className={`px-4 sm:px-6 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 ${
                                                filterDays === days 
                                                    ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg'
                                                    : 'text-white/70 hover:text-white hover:bg-white/10'
                                            }`}
                                        >
                                            <Clock className="h-4 w-4 inline mr-2" />
                                            {days} days
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    <StatCard
                        icon={Target}
                        title="Total Solved"
                        value={profileData.totalSolved}
                        color="from-emerald-500 to-teal-600"
                    />
                    <StatCard
                        icon={Star}
                        title="Hardest Problem"
                        value={profileData.hardestProblem || '—'}
                        color="from-purple-500 to-indigo-600"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Average Rating"
                        value={profileData.avgRating}
                        color="from-orange-500 to-red-600"
                    />
                    <StatCard
                        icon={Zap}
                        title="Daily Average"
                        value={profileData.avgPerDay}
                        subtitle="problems/day"
                        color="from-blue-500 to-cyan-600"
                    />
                </div>

                {/* Rating Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl mb-12 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-r from-purple-400 to-blue-400 p-2 rounded-lg">
                            <Activity className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Rating Evolution</h2>
                    </div>
                    <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={profileData.contests}>
                                <defs>
                                    <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis 
                                    dataKey="date" 
                                    tickFormatter={(date) => dayjs(date).format('MMM D')}
                                    stroke="rgba(255,255,255,0.7)"
                                    fontSize={12}
                                />
                                <YAxis domain={['auto', 'auto']} stroke="rgba(255,255,255,0.7)" fontSize={12} />
                                <Tooltip 
                                    labelFormatter={(value) => dayjs(value).format('MMMM D, YYYY')}
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}
                                />
                                <Line 
                                    type="monotone" 
                                    dataKey="newRating" 
                                    stroke="url(#ratingGradient)"
                                    strokeWidth={3}
                                    dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 6 }}
                                    activeDot={{ r: 8, fill: '#3b82f6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Contest Table */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl mb-12 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 p-2 rounded-lg">
                            <Users className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Contest History</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[600px]">
                            <thead>
                                <tr className="border-b border-white/20">
                                    <th className="text-left py-4 px-3 sm:px-6 text-white/80 font-semibold text-sm sm:text-base">Date</th>
                                    <th className="text-left py-4 px-3 sm:px-6 text-white/80 font-semibold text-sm sm:text-base">Contest</th>
                                    <th className="text-center py-4 px-3 sm:px-6 text-white/80 font-semibold text-sm sm:text-base">Rank</th>
                                    <th className="text-center py-4 px-3 sm:px-6 text-white/80 font-semibold text-sm sm:text-base">Rating Δ</th>
                                    <th className="text-center py-4 px-3 sm:px-6 text-white/80 font-semibold text-sm sm:text-base">Unsolved</th>
                                </tr>
                            </thead>
                            <tbody>
                                {profileData.contests.map((c, index) => (
                                    <tr key={c.contestId} className="border-b border-white/10 hover:bg-white/5 transition-colors duration-200">
                                        <td className="py-4 px-3 sm:px-6 text-white/90 text-sm sm:text-base">{new Date(c.date).toLocaleDateString()}</td>
                                        <td className="py-4 px-3 sm:px-6 text-white/90 font-medium text-sm sm:text-base">{c.name}</td>
                                        <td className="py-4 px-3 sm:px-6 text-center">
                                            <span className="bg-blue-500/20 text-blue-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                                #{c.rank}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 sm:px-6 text-center">
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${
                                                c.delta > 0 
                                                    ? 'bg-green-500/20 text-green-300' 
                                                    : c.delta < 0 
                                                        ? 'bg-red-500/20 text-red-300'
                                                        : 'bg-gray-500/20 text-gray-300'
                                            }`}>
                                                {c.delta > 0 ? `+${c.delta}` : c.delta}
                                            </span>
                                        </td>
                                        <td className="py-4 px-3 sm:px-6 text-center">
                                            <span className="bg-orange-500/20 text-orange-300 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                                                {c.unsolvedCount}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Problems by Rating Chart */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl mb-12 hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-2 rounded-lg">
                            <BarChart3 className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Problems by Rating</h2>
                    </div>
                    <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={Object.entries(profileData.ratingBuckets).map(([rating, count]) => ({
                                rating,
                                count
                            }))}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                                        <stop offset="95%" stopColor="#059669" stopOpacity={0.6}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="rating" stroke="rgba(255,255,255,0.7)" fontSize={12} />
                                <YAxis stroke="rgba(255,255,255,0.7)" fontSize={12} />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'rgba(0,0,0,0.8)',
                                        border: 'none',
                                        borderRadius: '12px',
                                        color: 'white'
                                    }}
                                />
                                <Bar 
                                    dataKey="count" 
                                    fill="url(#barGradient)"
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Submission Heatmap */}
                <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 sm:p-8 shadow-2xl hover:bg-white/15 transition-all duration-300">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-2 rounded-lg">
                            <Calendar className="h-6 w-6 text-white" />
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-white">Submission Heatmap</h2>
                    </div>
                    <div className="bg-white/5 rounded-xl p-4 overflow-x-auto">
                        <HeatMap
                            startDate={dayjs().subtract(filterDays, 'day').toDate()}
                            endDate={new Date()}
                            values={Object.entries(profileData.heatmap).map(([date, count]) => ({
                                date,
                                count
                            }))}
                            classForValue={value => {
                                if (!value) return 'color-empty';
                                if (value.count > 5) return 'color-scale-4';
                                if (value.count > 3) return 'color-scale-3';
                                if (value.count > 1) return 'color-scale-2';
                                return 'color-scale-1';
                            }}
                            showWeekdayLabels
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in {
                    animation: fade-in 0.6s ease-out;
                }
                
                /* Heatmap Custom Styles */
                .react-calendar-heatmap .color-empty {
                    fill: rgba(255, 255, 255, 0.1);
                }
                .react-calendar-heatmap .color-scale-1 {
                    fill: #22c55e;
                    opacity: 0.3;
                }
                .react-calendar-heatmap .color-scale-2 {
                    fill: #22c55e;
                    opacity: 0.5;
                }
                .react-calendar-heatmap .color-scale-3 {
                    fill: #22c55e;
                    opacity: 0.7;
                }
                .react-calendar-heatmap .color-scale-4 {
                    fill: #22c55e;
                    opacity: 1;
                }
                .react-calendar-heatmap text {
                    fill: rgba(255, 255, 255, 0.7);
                    font-size: 12px;
                }

                /* Mobile Responsive Table */
                @media (max-width: 640px) {
                    .react-calendar-heatmap {
                        font-size: 10px;
                    }
                }
            `}</style>
        </div>
    );
};

export default StudentProfile;