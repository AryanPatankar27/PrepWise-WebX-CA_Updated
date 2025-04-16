import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, FileText, MapPin, Menu, X, ChevronRight, Users, Award, BarChart , Star} from 'lucide-react';
import Logo from '../assets/PrepLogo.png'
import Name from '../assets/PrepName.png'

const Dashboard = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const stats = [
    { label: 'Interview Performance', value: '85%', icon: BarChart },
    { label: 'Success Rate', value: '92%', icon: Award },
    { label: 'Practice Sessions', value: '50,000+', icon: Star },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Enhanced Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/40 backdrop-blur-md shadow-md' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            {/* Logo */}
            <div className="flex items-center group cursor-pointer">
              <div className="flex-shrink-0">
              <img 
                  src={Logo} 
                  alt="PrepWise Logo" 
                  className="h-12 w-12 object-contain transform transition-all duration-300 group-hover:rotate-12 rounded-2xl"
                />
              </div>
              <div className="ml-3">
                <img 
                  src={Name} 
                  alt="PrepWise" 
                  className="h-8 object-contain transition-all duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {[
                { to: "/resume", icon: FileText, label: "Resume" },
                { to: "/exam-prep", icon: BookOpen, label: "Exam Prep" },
                { to: "/roadmap", icon: MapPin, label: "Roadmap" },
                { to: "/interview-prep", icon: MapPin, label: "Interview Prep" }
              ].map(({ to, icon: Icon, label }) => (
                <Link
                  key={to}
                  to={to}
                  className="flex items-center text-black hover:text-indigo-600 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-indigo-50"
                >
                  <Icon className="w-5 h-5 mr-2" />
                  {label}
                </Link>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden text-gray-700 hover:text-indigo-600 transition-colors duration-200"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`md:hidden transition-all duration-300 ${isMenuOpen ? 'max-h-96' : 'max-h-0'} overflow-hidden bg-white/95 backdrop-blur-md`}>
          <div className="px-4 py-3 space-y-2">
            {[
              { to: "/resume", icon: FileText, label: "Resume" },
              { to: "/exam-prep", icon: BookOpen, label: "Exam Prep" },
              { to: "/roadmap", icon: MapPin, label: "Roadmap" },
              { to: "/interview-prep", icon: MapPin, label: "Interview Prep" }
            ].map(({ to, icon: Icon, label }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center text-gray-700 hover:text-indigo-600 p-3 rounded-lg transition-colors duration-200 hover:bg-indigo-50"
              >
                <Icon className="w-5 h-5 mr-2" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-24 bg-gradient-to-br from-indigo-600 via-purple-600 to-indigo-600 bg-size-200 animate-gradient-x">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="text-white space-y-8 animate-fade-in">
              <h1 className="text-5xl font-bold leading-tight">
                Master Your Career Journey with Confidence
              </h1>
              <p className="text-xl opacity-90 leading-relaxed">
                Transform your interview preparation with AI-powered practice sessions, professional resume building, and personalized career guidance.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="group bg-white text-indigo-600 px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105">
                  Start Now
                  <ChevronRight className="inline ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
                <button className="border-2 border-white text-white px-8 py-4 rounded-xl font-semibold transition-all duration-300 hover:bg-white hover:text-indigo-600">
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Stats Section */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 p-6 bg-white/10 backdrop-blur-lg rounded-2xl">
              {stats.map(({ label, value, icon: Icon }) => (
                <div
                  key={label}
                  className="text-white p-6 rounded-xl bg-white/5 backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:scale-105"
                >
                  <Icon className="w-8 h-8 mb-4" />
                  <div className="text-3xl font-bold mb-2">{value}</div>
                  <div className="text-sm opacity-80">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative">
        {/* Grid Background Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#7c3aed15_1px,transparent_1px),linear-gradient(to_bottom,#7c3aed15_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(124,58,237,0.05),transparent)]" />
        
        {/* Content */}
        <div className="relative py-20 bg-transparent">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Everything You Need to Succeed</h2>
              <p className="text-xl text-gray-600">Comprehensive tools and resources for your career journey</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: BookOpen,
                  title: "AI Mock Interviews",
                  description: "Practice with our intelligent AI interviewer that adapts to your responses and provides real-time feedback."
                },
                {
                  icon: FileText,
                  title: "Smart Resume Builder",
                  description: "Create ATS-friendly resumes using our dynamic builder, which offers real-time editing."
                },
                {
                  icon: MapPin,
                  title: "Personalized Roadmap",
                  description: "Follow a customized learning path based on your goals, experience level, and target roles."
                }
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-white border border-gray-100 transition-all duration-300 hover:scale-105 backdrop-blur-sm"
                  style={{ boxShadow: "0 6px 8px rgba(128, 90, 213, 0.3)" }}
                  onMouseEnter={() => setActiveSection(index)}
                  onMouseLeave={() => setActiveSection(null)}
                >
                  <div className="bg-indigo-50 rounded-xl p-4 w-16 h-16 mb-6 transition-all duration-300 group-hover:bg-indigo-100">
                    <feature.icon className={`w-8 h-8 transition-colors duration-300 ${
                      activeSection === index ? 'text-indigo-600' : 'text-indigo-500'
                    }`} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center">
              <div className="flex-shrink-0">
              <img 
                  src={Logo} 
                  alt="PrepWise Logo" 
                  className="h-12 w-12 object-contain transform transition-all duration-300 group-hover:rotate-12 rounded-2xl"
                />
              </div>
                <div className="ml-3 text-xl font-bold">PrepWise</div>
              </div>
              <p className="text-gray-400">Empowering careers through intelligent preparation</p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Product</h4>
              <div className="space-y-2">
                {['Features', 'Pricing', 'Enterprise', 'Security'].map(item => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <div className="space-y-2">
                {['About', 'Blog', 'Careers', 'Press'].map(item => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Legal</h4>
              <div className="space-y-2">
                {['Privacy', 'Terms', 'Cookie Policy'].map(item => (
                  <a key={item} href="#" className="block text-gray-400 hover:text-white transition-colors duration-200">
                    {item}
                  </a>
                ))}
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-400 mb-4 md:mb-0">
              © 2025 PrepWise. All rights reserved.
            </div>
            <div className="flex space-x-6">
              {['Twitter', 'LinkedIn', 'GitHub'].map(social => (
                <a key={social} href="#" className="text-gray-400 hover:text-white transition-colors duration-200">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Dashboard;