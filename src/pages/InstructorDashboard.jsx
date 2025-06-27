import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ThemeSwitcher from '../components/ThemeSwitcher';

function InstructorDashboard() {
  const [user, setUser] = useState(null);
  const [pendingSkills, setPendingSkills] = useState([]);
  const [feedbackMap, setFeedbackMap] = useState({});
  const [analytics, setAnalytics] = useState({ averageTime: 0, backlogCount: 0 });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (storedUser) {
      setUser(storedUser);
      fetchPendingSkills();
    }
  }, []);

  const fetchPendingSkills = async () => {
    try {
      const res = await axios.get('http://165.140.156.98:5000/api/instructor/pending-skills');
      const skills = res.data;
      setPendingSkills(skills);

      const avgTime = skills.length
        ? Math.floor(skills.reduce((sum, s) => sum + (new Date() - new Date(s.created_at)), 0) / skills.length / (1000 * 60 * 60))
        : 0;

      setAnalytics({ averageTime: avgTime, backlogCount: skills.length });
    } catch (err) {
      console.error('❌ Error fetching pending skills:', err);
    }
  };

  const handleDecision = async (id, decision) => {
    try {
      await axios.post(`http://165.140.156.98:5000/api/instructor/skill-review/${id}`, {
        decision,
        note: feedbackMap[id] || ''
      });
      fetchPendingSkills();
    } catch (err) {
      alert('Failed to process decision.');
    }
  };

  const handleNoteChange = (id, value) => {
    setFeedbackMap(prev => ({ ...prev, [id]: value }));
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-6">
          <Header user={user} />
          <ThemeSwitcher />
        </div>

        <h2 className="text-2xl font-bold mb-4 text-blue-400">🧑‍🏫 Instructor Dashboard</h2>

        {/* Instructor Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-sm text-gray-400">⏱️ Avg Time to Feedback</h3>
            <p className="text-3xl font-bold mt-2">{analytics.averageTime} hrs</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-sm text-gray-400">📥 Pending Reviews</h3>
            <p className="text-3xl font-bold mt-2">{analytics.backlogCount}</p>
          </div>
        </div>

        {/* Skill Review Queue */}
        <div className="bg-gray-800 p-6 rounded-xl">
          <h3 className="text-md font-semibold mb-4">📋 Skill Review Queue</h3>
          {pendingSkills.length === 0 ? (
            <p className="text-gray-400">No pending skill logs to review.</p>
          ) : (
            <ul className="space-y-6">
              {pendingSkills.map(skill => (
                <li key={skill.id} className="bg-gray-900 p-4 rounded-lg shadow-inner border border-gray-700">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-blue-300">{skill.skill}</p>
                      <p className="text-sm text-gray-400">
                        {skill.age} y/o {skill.gender} | Logged {Math.round((new Date() - new Date(skill.created_at)) / 3600000)} hrs ago
                      </p>
                      <p className="text-sm text-gray-300 mt-1 italic">"{skill.notes}"</p>
                    </div>
                    <div className="flex flex-col gap-2">
                      <button
                        onClick={() => handleDecision(skill.id, 'approved')}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded text-sm"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => handleDecision(skill.id, 'rejected')}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-1 rounded text-sm"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-xs text-gray-400 mb-1">Instructor Notes</label>
                    <textarea
                      className="w-full bg-gray-700 text-white p-2 rounded border border-gray-600"
                      rows="3"
                      placeholder="Feedback, suggestions, or required corrections..."
                      value={feedbackMap[skill.id] || ''}
                      onChange={(e) => handleNoteChange(skill.id, e.target.value)}
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorDashboard;
