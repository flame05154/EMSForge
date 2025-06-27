import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ThemeSwitcher from '../components/ThemeSwitcher';

function InstructorReviewPanel() {
  const [skills, setSkills] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [note, setNote] = useState('');
  const [analytics, setAnalytics] = useState({ avgTimeToReview: 0, backlog: 0 });
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    axios.get('http://165.140.156.98:5000/api/skills/pending-review')
      .then(res => {
        setSkills(res.data);
        calculateAnalytics(res.data);
      })
      .catch(() => console.error('❌ Failed to fetch skills for review'));
  }, []);

  const calculateAnalytics = (skills) => {
    const now = new Date();
    const totalTime = skills.reduce((sum, s) => sum + ((now - new Date(s.created_at)) / 3600000), 0);
    const avg = skills.length ? (totalTime / skills.length).toFixed(1) : 0;
    setAnalytics({ avgTimeToReview: avg, backlog: skills.length });
  };

  const handleApprove = async (skillId) => {
    await axios.put(`http://165.140.156.98:5000/api/skills/approve/${skillId}`, {
      feedback,
      note,
      instructor_id: user?.id,
    });
    setSkills(skills.filter(skill => skill.id !== skillId));
    setSelectedSkill(null);
    setFeedback('');
    setNote('');
  };

  const handleReject = async (skillId) => {
    await axios.put(`http://165.140.156.98:5000/api/skills/reject/${skillId}`, {
      feedback,
      note,
      instructor_id: user?.id,
    });
    setSkills(skills.filter(skill => skill.id !== skillId));
    setSelectedSkill(null);
    setFeedback('');
    setNote('');
  };

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <Header user={user} />
          <ThemeSwitcher />
        </div>

        <h2 className="text-2xl font-bold text-blue-400 mb-6">🧾 Instructor Review Panel</h2>

        {/* Instructor Analytics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-sm text-gray-400">⏱️ Avg. Time to Feedback</h3>
            <p className="text-3xl font-bold mt-2">{analytics.avgTimeToReview} hrs</p>
          </div>
          <div className="bg-gray-800 p-4 rounded-xl">
            <h3 className="text-sm text-gray-400">📦 Skills Awaiting Review</h3>
            <p className="text-3xl font-bold mt-2">{analytics.backlog}</p>
          </div>
        </div>

        {/* Pending Skill List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-800 p-4 rounded-xl h-[32rem] overflow-y-auto">
            <h3 className="text-md font-semibold mb-4">📝 Review Queue</h3>
            <ul className="space-y-3">
              {skills.map(skill => (
                <li key={skill.id} onClick={() => setSelectedSkill(skill)} className={`p-3 rounded-lg cursor-pointer ${selectedSkill?.id === skill.id ? 'bg-blue-700' : 'bg-gray-700 hover:bg-gray-600'}`}>
                  <div className="font-bold">{skill.skill}</div>
                  <div className="text-sm text-gray-400">Patient: {skill.patientName || 'N/A'} — {new Date(skill.created_at).toLocaleString()}</div>
                </li>
              ))}
            </ul>
          </div>

          {/* Skill Review Panel */}
          {selectedSkill && (
            <div className="bg-gray-800 p-6 rounded-xl flex flex-col">
              <h3 className="text-md font-semibold mb-4">📄 Review Skill Log</h3>
              <div className="text-sm mb-4 space-y-1">
                <p><strong>Skill:</strong> {selectedSkill.skill}</p>
                <p><strong>Patient Age:</strong> {selectedSkill.age}</p>
                <p><strong>Gender:</strong> {selectedSkill.gender}</p>
                <p><strong>Chief Complaint:</strong> {selectedSkill.chiefComplaint}</p>
                <p><strong>Disposition:</strong> {selectedSkill.disposition}</p>
                <p><strong>Status:</strong> {selectedSkill.status}</p>
                <p><strong>Attempts:</strong> {selectedSkill.attempts}</p>
                <p><strong>Confidence:</strong> {selectedSkill.confidence}/5</p>
                <p><strong>Notes:</strong> {selectedSkill.notes}</p>
              </div>

              {/* Feedback */}
              <label className="mt-4 text-sm mb-1">Instructor Feedback</label>
              <textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4 border border-gray-600"
                rows={3}
              />

              <label className="text-sm mb-1">Instructor Notes (Internal)</label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full bg-gray-700 text-white rounded px-3 py-2 mb-4 border border-gray-600"
                rows={2}
              />

              {/* Approve / Reject Buttons */}
              <div className="flex justify-end gap-4 mt-auto">
                <button onClick={() => handleReject(selectedSkill.id)} className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded">❌ Reject</button>
                <button onClick={() => handleApprove(selectedSkill.id)} className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded">✅ Approve</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default InstructorReviewPanel;
