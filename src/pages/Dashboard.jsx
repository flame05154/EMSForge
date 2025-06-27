// Finalized EMS Student Dashboard with All Advanced Features & Integrated Header
import { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { Doughnut, Line } from 'react-chartjs-2';
import InstructorFeedback from '../components/InstructorFeedback';
import SelfAssessment from '../components/SelfAssessment';
import RotationCalendar from '../components/RotationCalendar';
import InteractiveSkillTable from '../components/InteractiveSkillTable';
import PDFExportButton from '../components/PDFExportButton';
import PeerEvaluation from '../components/PeerEvaluation';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
} from 'chart.js';
import {
  Search, Bell, ChevronDown, LogOut, Settings, UserCircle, Sun, Moon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, PointElement, LineElement);

function Dashboard() {
  const [user, setUser] = useState(null);
  const [skills, setSkills] = useState([]);
  const [evaluations, setEvaluations] = useState([]);
  const [skillTotals, setSkillTotals] = useState({});
  const [monthlyTrends, setMonthlyTrends] = useState({ labels: [], data: [] });
  const [streak, setStreak] = useState(0);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const milestoneGoals = { Airway: 10, IV: 10, CPR: 5, Medication: 5 };

  useEffect(() => {
    if (!token) return navigate('/');

    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      axios.get(`http://165.140.156.98:5000/api/skills/all/${storedUser.id}`).then((res) => {
        const allSkills = res.data;
        setSkills(allSkills);
        processSkillData(allSkills);
        calculateStreak(allSkills);
      });
      axios.get(`http://165.140.156.98:5000/api/evaluations/${storedUser.id}`).then((res) => {
        setEvaluations(res.data);
      });
    }
  }, [navigate, token]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const processSkillData = (data) => {
    const totals = {};
    const trends = {};
    data.forEach((s) => {
      totals[s.skill] = (totals[s.skill] || 0) + 1;
      const month = new Date(s.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
      trends[month] = (trends[month] || 0) + 1;
    });
    setSkillTotals(totals);
    setMonthlyTrends({ labels: Object.keys(trends), data: Object.values(trends) });
  };

  const calculateStreak = (data) => {
    const sortedDates = [...new Set(data.map(s => new Date(s.created_at).toDateString()))].sort(
      (a, b) => new Date(b) - new Date(a)
    );
    let streak = 0;
    let current = new Date().toDateString();
    for (const date of sortedDates) {
      if (date === current) {
        streak++;
        current = new Date(new Date(current).setDate(new Date(current).getDate() - 1)).toDateString();
      } else break;
    }
    setStreak(streak);
  };

  const chartColors = {
    Airway: '#0ea5e9',
    IV: '#8b5cf6',
    CPR: '#facc15',
    Medication: '#ef4444',
    Assessment: '#10b981',
    Other: '#64748b',
  };

  const donutData = {
    labels: Object.keys(skillTotals),
    datasets: [{
      data: Object.values(skillTotals),
      backgroundColor: Object.keys(skillTotals).map(key => chartColors[key] || '#888'),
      borderWidth: 1,
    }],
  };

  const lineData = {
    labels: monthlyTrends.labels,
    datasets: [{
      label: 'Skills Logged',
      data: monthlyTrends.data,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.2)',
      tension: 0.4,
      fill: true,
    }],
  };

  const thisWeekCount = skills.filter((s) => {
    const created = new Date(s.created_at);
    const now = new Date();
    return (now - created) / (1000 * 60 * 60 * 24) < 7;
  }).length;

  const progressBars = Object.keys(milestoneGoals).map((skill) => {
    const count = skillTotals[skill] || 0;
    const percent = Math.min((count / milestoneGoals[skill]) * 100, 100);
    const complete = count >= milestoneGoals[skill];
    return (
      <div key={skill} className="mb-3">
        <div className="flex justify-between text-sm text-gray-300">
          <span>{skill} ({count}/{milestoneGoals[skill]})</span>
          {complete && <span className="text-yellow-400">🏅 Badge Earned!</span>}
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <div className="bg-green-500 h-2 rounded-full transition-all" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    );
  });

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">

        {/* Inlined Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between mb-6 gap-4">
          <div className="relative w-full sm:max-w-md">
            <span className="absolute left-3 top-2.5 text-gray-400">
              <Search size={18} />
            </span>
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-gray-800 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-4 relative" ref={dropdownRef}>
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-gray-400 hover:text-yellow-400 transition"
              aria-label="Toggle Theme"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="relative text-gray-400 hover:text-white">
              <Bell size={20} />
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 rounded-full" />
            </button>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 px-3 py-1 rounded-lg bg-gray-800 hover:bg-gray-700 text-white transition"
            >
              <UserCircle size={24} />
              <div className="text-left hidden sm:block">
                <p className="text-sm font-semibold">{user?.name || 'User'}</p>
                <p className="text-xs text-gray-400">{user?.email || 'user@email.com'}</p>
              </div>
              <ChevronDown size={16} className="text-gray-400" />
            </button>
            <AnimatePresence>
              {dropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-14 w-48 bg-white text-black dark:bg-gray-800 dark:text-white rounded-lg shadow-xl z-50"
                >
                  <ul className="p-2 text-sm">
                    <li
                      className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                      onClick={() => window.location.href = '/account'}
                    >
                      <Settings size={16} /> Settings
                    </li>
                    <li
                      onClick={() => {
                        localStorage.clear();
                        window.location.href = '/';
                      }}
                      className="flex items-center gap-2 px-4 py-2 hover:bg-red-600 hover:text-white cursor-pointer"
                    >
                      <LogOut size={16} /> Logout
                    </li>
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </header>

        {/* Stats, Milestones, Charts, Tools */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-xl"><h2 className="text-sm text-gray-400">Total Skills Logged</h2><p className="text-3xl font-bold mt-2">{skills.length}</p></div>
          <div className="bg-gray-800 p-4 rounded-xl"><h2 className="text-sm text-gray-400">Skills This Week</h2><p className="text-3xl font-bold mt-2">{thisWeekCount}</p></div>
          <div className="bg-gray-800 p-4 rounded-xl"><h2 className="text-sm text-gray-400">Active Streak</h2><p className="text-3xl font-bold mt-2">🔥 {streak} days</p></div>
          <div className="bg-gray-800 p-4 rounded-xl"><h2 className="text-sm text-gray-400">Recent Evaluations</h2>
            <ul className="text-sm mt-2 space-y-1 max-h-24 overflow-y-auto pr-1">
              {evaluations.slice(0, 4).map((evalItem, idx) => (
                <li key={idx} className="text-gray-300">
                  {evalItem.type} - {evalItem.result}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-xl mb-6">
          <h3 className="text-md font-semibold mb-4">📊 Milestone Tracker</h3>
          {progressBars}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-6 rounded-xl"><h3 className="text-md font-semibold mb-4">Skill Breakdown</h3><Doughnut data={donutData} /></div>
          <div className="bg-gray-800 p-6 rounded-xl"><h3 className="text-md font-semibold mb-4">Monthly Logging Volume</h3><Line data={lineData} /></div>
        </div>

        <RotationCalendar />
        <InstructorFeedback userId={user?.id} />
        <SelfAssessment />
        <PeerEvaluation />
        <InteractiveSkillTable skills={skills} />

        <div className="mt-6 flex justify-between items-center">
          <PDFExportButton />
          <div className="flex gap-2 items-center">
            <span className="text-yellow-400">🏅 Badges:</span>
            {Object.keys(milestoneGoals).map(skill =>
              skillTotals[skill] >= milestoneGoals[skill] && (
                <span key={skill} className="text-xs bg-yellow-500 px-2 py-1 rounded-full">{skill}</span>
              )
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;
