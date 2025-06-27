import { useEffect, useState } from 'react';
import axios from 'axios';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import ThemeSwitcher from '../components/ThemeSwitcher';
import { useNavigate } from 'react-router-dom';

function InstructorStudentList() {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    setUser(storedUser);

    axios.get('http://165.140.156.98:5000/api/users/students')
      .then(res => setStudents(res.data))
      .catch(() => console.error('❌ Failed to fetch students'));
  }, []);

  return (
    <div className="flex bg-gray-900 text-white min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6">
        <div className="flex justify-between items-center mb-4">
          <Header user={user} />
          <ThemeSwitcher />
        </div>

        <h2 className="text-2xl font-bold text-blue-400 mb-6">👨‍🎓 Students Overview</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-gray-800 p-5 rounded-xl shadow-md border border-gray-700">
              <h3 className="text-lg font-semibold text-white">{student.name}</h3>
              <p className="text-sm text-gray-400 mb-2">{student.email}</p>

              <div className="text-sm text-gray-300 space-y-1 mb-3">
                <p><strong>Total Skills:</strong> {student.totalSkills || 0}</p>
                <p><strong>IVs:</strong> {student.skillCounts?.IV || 0} / 10</p>
                <p><strong>CPRs:</strong> {student.skillCounts?.CPR || 0} / 5</p>
                <p><strong>Airways:</strong> {student.skillCounts?.Airway || 0} / 10</p>
                <p><strong>Current Streak:</strong> 🔥 {student.streak || 0} days</p>
              </div>

              <div className="flex justify-between mt-4">
                <button
                  onClick={() => navigate(`/reports?student=${student.id}`)}
                  className="bg-blue-600 hover:bg-blue-700 text-sm px-3 py-1 rounded"
                >
                  📋 View Reports
                </button>
                <button
                  onClick={() => navigate(`/review-panel?student=${student.id}`)}
                  className="bg-purple-600 hover:bg-purple-700 text-sm px-3 py-1 rounded"
                >
                  🧾 Pending Reviews
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default InstructorStudentList;
