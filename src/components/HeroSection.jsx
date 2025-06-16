import React, { useState, useEffect } from 'react';
import { Code, Users, TrendingUp, Trophy, Calendar, Mail, Moon, Sun, ArrowRight, Play, Zap, Target, BarChart3, Clock, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FloatingIcon = ({ icon: Icon, delay = 0, size = 20 }) => (
  <div 
    className="absolute opacity-20 animate-pulse"
    style={{
      animationDelay: `${delay}s`,
      animationDuration: '3s',
      left: `${Math.random() * 80 + 10}%`,
      top: `${Math.random() * 80 + 10}%`,
    }}
  >
    <Icon size={size} />
  </div>
);

const AnimatedCounter = ({ end, suffix = '', duration = 2000 }) => {
  const [count, setCount] = useState(0);
  
  useEffect(() => {
    let startTime = null;
    const animate = (currentTime) => {
      if (startTime === null) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      setCount(Math.floor(progress * end));
      if (progress < 1) requestAnimationFrame(animate);
    };
    requestAnimationFrame(animate);
  }, [end, duration]);
  
  return <span>{count}{suffix}</span>;
};

const FeatureCard = ({ icon: Icon, title, description, delay = 0 }) => (
  <div 
    className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 transform hover:scale-105 transition-all duration-300 hover:bg-white/15"
    style={{ animationDelay: `${delay}ms` }}
  >
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
      <Icon className="text-white" size={24} />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-300 text-sm leading-relaxed">{description}</p>
  </div>
);

const CodeforcesTravkerHero = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const features = [
    {
      icon: Users,
      title: "Student Management",
      description: "Comprehensive student profiles with Codeforces integration and progress tracking"
    },
    {
      icon: TrendingUp,
      title: "Rating Analytics",
      description: "Real-time rating graphs, contest history, and performance insights"
    },
    {
      icon: BarChart3,
      title: "Problem Analysis",
      description: "Detailed problem-solving statistics with rating buckets and heatmaps"
    },
    {
      icon: Mail,
      title: "Smart Notifications",
      description: "Automated inactivity detection with customizable reminder emails"
    }
  ];

  const navigate = useNavigate()
  const goToStudentsPage= () => {
     navigate('/studentpage');
  }
 

  return (
    <div className={`min-h-screen relative overflow-hidden transition-all duration-500 ${
      isDarkMode ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900' : 'bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50'
    }`}>
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <FloatingIcon 
            key={i} 
            icon={[Code, Trophy, Zap, Target, Shield][i % 5]} 
            delay={i * 0.2} 
            size={16 + (i % 3) * 4}
          />
        ))}
      </div>

      {/* Gradient Orbs */}
      <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>

      {/* Header */}
      <header className="relative z-10 px-6 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-2 rounded-xl">
              <Code className="text-white" size={28} />
            </div>
            <div>
              <h1 className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                CodeTracker Pro
              </h1>
              <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                Codeforces Student Management
              </p>
            </div>
          </div>
          
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className={`p-3 rounded-xl transition-all duration-300 ${
              isDarkMode 
                ? 'bg-white/10 hover:bg-white/20 text-white' 
                : 'bg-gray-900/10 hover:bg-gray-900/20 text-gray-900'
            }`}
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </header>

      {/* Main Hero Content */}
      <main className="relative z-10 px-6 pt-16 pb-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-full px-6 py-2 mb-8">
              <Zap className="text-yellow-400 mr-2" size={16} />
              <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Now with Real-time Sync & Analytics
              </span>
            </div>
            
            <h1 className={`text-6xl md:text-7xl font-bold mb-6 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              Master
              <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
                {' '}Competitive{' '}
              </span>
              Programming
            </h1>
            
            <p className={`text-xl md:text-2xl mb-12 max-w-4xl mx-auto leading-relaxed ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Transform your coding journey with intelligent student tracking, automated progress monitoring, 
              and comprehensive Codeforces analytics that drive real results.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center cursor-pointer" onClick={goToStudentsPage}>
                Start Tracking Students 
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </button>
              
              
            </div>

            {/* Stats */}
           
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                delay={index * 100}
              />
            ))}
          </div>

          {/* Interactive Dashboard Preview */}
          <div className="bg-white/5 backdrop-blur-sm border border-white/20 rounded-2xl p-8 mb-20">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Powerful Dashboard Analytics
              </h2>
              <p className={`text-lg ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Everything you need to track and improve student performance
              </p>
            </div>

            

            
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-blue-500/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-2xl p-12">
              <h2 className={`text-4xl font-bold mb-6 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                Ready to Elevate Your Students?
              </h2>
              <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                Join thousands of educators using CodeTracker Pro to transform competitive programming education
              </p>
              <button className="group bg-gradient-to-r from-blue-500 to-purple-600 text-white px-12 py-4 rounded-xl font-semibold text-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105 flex items-center mx-auto" onClick={goToStudentsPage}>
                Get Started Free
                <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={24} />
              </button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default CodeforcesTravkerHero;